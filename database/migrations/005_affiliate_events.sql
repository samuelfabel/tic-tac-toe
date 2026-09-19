-- 005_affiliate_events.sql
-- Funil: clique → pedido → venda → comissão

CREATE TABLE IF NOT EXISTS affiliate_events (
    id               BIGSERIAL PRIMARY KEY,
    product_id       BIGINT REFERENCES products (id) ON DELETE SET NULL,
    publication_id   BIGINT REFERENCES publications (id) ON DELETE SET NULL,
    source           VARCHAR(50),
    event_type       VARCHAR(50) NOT NULL,
    -- CLICK | ORDER | SALE | COMMISSION | CANCELLED | RETURNED
    value            NUMERIC(12, 2),
    currency         VARCHAR(10) DEFAULT 'BRL',
    external_ref     VARCHAR(255),
    metadata         JSONB,
    occurred_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_events_type
    ON affiliate_events (event_type, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_affiliate_events_product
    ON affiliate_events (product_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_affiliate_events_publication
    ON affiliate_events (publication_id);
