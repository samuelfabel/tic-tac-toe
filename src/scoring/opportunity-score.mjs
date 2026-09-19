/**
 * Opportunity Score — coração do sistema (determinístico).
 *
 * Distribuição (100 pontos):
 *  30 → desconto/preço (prioriza desconto HISTÓRICO sobre anunciado)
 *  20 → comissão (padrão + extra)
 *  15 → avaliação (rating)
 *  10 → quantidade de avaliações
 *  10 → vendas
 *  10 → histórico de preço (menor preço / queda vs média)
 *   5 → cupom ativo
 */

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function announcedDiscountPercent(price, original) {
  if (original == null || original <= 0 || price >= original) return 0;
  return ((original - price) / original) * 100;
}

function historicalDiscountPercent(price, avg30) {
  if (avg30 == null || avg30 <= 0 || price >= avg30) return 0;
  return ((avg30 - price) / avg30) * 100;
}

/** 30 pts — desconto: 70% peso no histórico, 30% no anunciado */
function scoreDiscount(product, stats) {
  const announced = announcedDiscountPercent(product.price, product.original_price);
  const historical = historicalDiscountPercent(product.price, stats?.avg_price_30d ?? null);
  const effective = historical * 0.7 + announced * 0.3;
  const points = clamp((effective / 50) * 30, 0, 30);
  const flags = [];
  if (stats?.min_price_30d != null && product.price <= stats.min_price_30d && (stats.samples_30d ?? 0) >= 3) {
    flags.push('MENOR_PRECO_30D');
  }
  if (historical >= 25) {
    flags.push('ABAIXO_DA_MEDIA_HISTORICA');
  }
  return { points: Math.round(points * 100) / 100, flags };
}

/** 20 pts — comissão total (padrão + extra). 15%+ → full */
function scoreCommission(product) {
  const base = product.commission_percent ?? 0;
  const extra = product.extra_commission_percent ?? 0;
  const totalPct = base + extra;
  const points = clamp((totalPct / 15) * 20, 0, 20);
  const potential_revenue = (product.price * totalPct) / 100;
  return {
    points: Math.round(points * 100) / 100,
    potential_revenue: Math.round(potential_revenue * 100) / 100,
  };
}

/** 15 pts — rating 0–5 */
function scoreRating(rating) {
  if (rating == null) return 0;
  return Math.round(clamp((rating / 5) * 15, 0, 15) * 100) / 100;
}

/** 10 pts — review_count (log scale, 5000+ ≈ full) */
function scoreReviews(count) {
  if (count == null || count <= 0) return 0;
  const points = (Math.log10(count + 1) / Math.log10(5001)) * 10;
  return Math.round(clamp(points, 0, 10) * 100) / 100;
}

/** 10 pts — sold_count (log scale, 10000+ ≈ full) */
function scoreSales(count) {
  if (count == null || count <= 0) return 0;
  const points = (Math.log10(count + 1) / Math.log10(10001)) * 10;
  return Math.round(clamp(points, 0, 10) * 100) / 100;
}

/** 10 pts — histórico: proximidade do mínimo 30d + amostras */
function scorePriceHistory(product, stats) {
  if (!stats || stats.samples_30d < 2 || stats.min_price_30d == null || stats.max_price_30d == null) {
    return 0;
  }
  const range = stats.max_price_30d - stats.min_price_30d;
  if (range <= 0) return 2;
  const proximityToMin = 1 - (product.price - stats.min_price_30d) / range;
  return Math.round(clamp(proximityToMin * 10, 0, 10) * 100) / 100;
}

/** 5 pts — cupom ativo */
function scoreCoupon(hasCoupon) {
  return hasCoupon ? 5 : 0;
}

export function calculateOpportunityScore(input) {
  const { product, price_stats, has_active_coupon = false } = input;
  const discount = scoreDiscount(product, price_stats);
  const commission = scoreCommission(product);
  const rating = scoreRating(product.rating);
  const reviews = scoreReviews(product.review_count);
  const sales = scoreSales(product.sold_count);
  const price_history = scorePriceHistory(product, price_stats);
  const coupon = scoreCoupon(has_active_coupon);

  const total =
    Math.round(
      (discount.points + commission.points + rating + reviews + sales + price_history + coupon) * 100
    ) / 100;

  return {
    discount: discount.points,
    commission: commission.points,
    rating,
    reviews,
    sales,
    price_history,
    coupon,
    total: clamp(total, 0, 100),
    flags: discount.flags,
    potential_revenue: commission.potential_revenue,
  };
}

/** Threshold padrão do MVP */
export const DEFAULT_SCORE_THRESHOLD = 70;

export function isPublishCandidate(score, threshold = DEFAULT_SCORE_THRESHOLD) {
  return score.total >= threshold;
}

/**
 * Controle de repetição de publicação.
 * < 24h → bloquear
 * 24h–7d → só se queda forte de preço (>= 15% vs última publicação)
 * > 7d → ok
 */
export function shouldRepublish(opts) {
  const now = opts.now ?? new Date();
  const strongDrop = opts.strongDropPercent ?? 15;

  if (!opts.lastPublishedAt) {
    return { allow: true, reason: 'never_published' };
  }

  const hours = (now.getTime() - opts.lastPublishedAt.getTime()) / (1000 * 60 * 60);

  if (hours < 24) {
    return { allow: false, reason: 'within_24h' };
  }

  if (hours < 24 * 7) {
    const prev = opts.priceAtLastPublish;
    if (prev != null && prev > 0) {
      const drop = ((prev - opts.currentPrice) / prev) * 100;
      if (drop >= strongDrop) {
        return { allow: true, reason: 'price_drop_within_7d' };
      }
    }
    return { allow: false, reason: 'within_7d_no_price_drop' };
  }

  return { allow: true, reason: 'after_7d' };
}
