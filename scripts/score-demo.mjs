#!/usr/bin/env node
/**
 * Demo local do Opportunity Score (sem banco).
 */
import { calculateOpportunityScore, isPublishCandidate } from '../src/scoring/opportunity-score.mjs';

const result = calculateOpportunityScore({
  product: {
    title: 'Kit 20 peças brinquedo educativo',
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

console.log(JSON.stringify({
  score: result,
  publish_candidate: isPublishCandidate(result, 70),
}, null, 2));
