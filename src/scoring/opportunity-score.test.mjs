/**
 * Testes do Opportunity Score (sem framework — rode: node --test)
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOpportunityScore,
  isPublishCandidate,
  shouldRepublish,
} from './opportunity-score.mjs';

describe('calculateOpportunityScore', () => {
  it('prioriza desconto histórico sobre anunciado', () => {
    const withHistory = calculateOpportunityScore({
      product: {
        price: 50,
        original_price: 55, // anunciado fraco
        rating: 4.8,
        review_count: 1500,
        sold_count: 8000,
        commission_percent: 5,
        extra_commission_percent: 10,
      },
      price_stats: {
        avg_price_30d: 82,
        min_price_30d: 50,
        max_price_30d: 89,
        samples_30d: 10,
      },
      has_active_coupon: true,
    });

    const weakHistory = calculateOpportunityScore({
      product: {
        price: 50,
        original_price: 100, // anunciado forte
        rating: 4.8,
        review_count: 1500,
        sold_count: 8000,
        commission_percent: 5,
        extra_commission_percent: 0,
      },
      price_stats: {
        avg_price_30d: 51,
        min_price_30d: 49,
        max_price_30d: 52,
        samples_30d: 10,
      },
      has_active_coupon: false,
    });

    assert.ok(withHistory.flags.includes('ABAIXO_DA_MEDIA_HISTORICA'));
    assert.ok(withHistory.flags.includes('MENOR_PRECO_30D'));
    assert.ok(withHistory.total > weakHistory.total);
    assert.equal(withHistory.potential_revenue, 7.5);
    assert.equal(weakHistory.potential_revenue, 2.5);
  });

  it('inclui comissão extra no score e na receita potencial', () => {
    const a = calculateOpportunityScore({
      product: { price: 50, commission_percent: 5, extra_commission_percent: 10 },
    });
    const b = calculateOpportunityScore({
      product: { price: 50, commission_percent: 5, extra_commission_percent: 0 },
    });
    assert.ok(a.commission > b.commission);
    assert.equal(a.potential_revenue, 7.5);
  });

  it('respeita threshold 70', () => {
    const strong = calculateOpportunityScore({
      product: {
        price: 39.9,
        original_price: 89.9,
        rating: 4.8,
        review_count: 1520,
        sold_count: 8000,
        commission_percent: 5,
        extra_commission_percent: 10,
      },
      price_stats: {
        avg_price_30d: 75,
        min_price_30d: 39.9,
        max_price_30d: 89.9,
        samples_30d: 8,
      },
      has_active_coupon: true,
    });
    assert.ok(isPublishCandidate(strong, 70));
  });
});

describe('shouldRepublish', () => {
  const now = new Date('2026-09-19T12:00:00Z');

  it('bloqueia republicação em menos de 24h', () => {
    const decision = shouldRepublish({
      lastPublishedAt: new Date('2026-09-19T06:00:00Z'),
      now,
      currentPrice: 40,
      priceAtLastPublish: 40,
    });
    assert.equal(decision.allow, false);
    assert.equal(decision.reason, 'within_24h');
  });

  it('permite entre 24h e 7d se preço caiu muito', () => {
    const decision = shouldRepublish({
      lastPublishedAt: new Date('2026-09-17T12:00:00Z'),
      now,
      currentPrice: 40,
      priceAtLastPublish: 50,
    });
    assert.equal(decision.allow, true);
    assert.equal(decision.reason, 'price_drop_within_7d');
  });

  it('permite após 7 dias', () => {
    const decision = shouldRepublish({
      lastPublishedAt: new Date('2026-09-01T12:00:00Z'),
      now,
      currentPrice: 40,
      priceAtLastPublish: 40,
    });
    assert.equal(decision.allow, true);
    assert.equal(decision.reason, 'after_7d');
  });
});
