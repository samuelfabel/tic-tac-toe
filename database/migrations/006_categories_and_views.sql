-- 006_categories_and_views.sql
-- Taxonomia + views úteis para scoring e dashboard

CREATE TABLE IF NOT EXISTS categories (
    id          SERIAL PRIMARY KEY,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    parent_slug VARCHAR(100) REFERENCES categories (slug),
    label_pt    VARCHAR(150) NOT NULL
);

-- Views auxiliares

CREATE OR REPLACE VIEW v_product_price_stats AS
SELECT
    p.id AS product_id,
    p.price AS current_price,
    MIN(h.price) FILTER (WHERE h.captured_at >= NOW() - INTERVAL '30 days') AS min_price_30d,
    AVG(h.price) FILTER (WHERE h.captured_at >= NOW() - INTERVAL '30 days') AS avg_price_30d,
    MAX(h.price) FILTER (WHERE h.captured_at >= NOW() - INTERVAL '30 days') AS max_price_30d,
    COUNT(h.id) FILTER (WHERE h.captured_at >= NOW() - INTERVAL '30 days') AS samples_30d
FROM products p
LEFT JOIN product_price_history h ON h.product_id = p.id
GROUP BY p.id, p.price;

CREATE OR REPLACE VIEW v_daily_metrics AS
SELECT
    DATE(ae.occurred_at) AS day,
    COUNT(*) FILTER (WHERE ae.event_type = 'CLICK') AS clicks,
    COUNT(*) FILTER (WHERE ae.event_type = 'ORDER') AS orders,
    COUNT(*) FILTER (WHERE ae.event_type = 'SALE') AS sales,
    COALESCE(SUM(ae.value) FILTER (WHERE ae.event_type = 'COMMISSION'), 0) AS commission
FROM affiliate_events ae
GROUP BY DATE(ae.occurred_at)
ORDER BY day DESC;

CREATE OR REPLACE VIEW v_publications_today AS
SELECT
    channel,
    COUNT(*) FILTER (WHERE status = 'published') AS published_count
FROM publications
WHERE published_at::date = CURRENT_DATE
GROUP BY channel;
