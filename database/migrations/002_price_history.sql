-- 002_price_history.sql
-- Histórico de preços — base do desconto real vs anunciado

CREATE TABLE IF NOT EXISTS product_price_history (
    id              BIGSERIAL PRIMARY KEY,
    product_id      BIGINT         NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    price           NUMERIC(12, 2) NOT NULL,
    original_price  NUMERIC(12, 2),
    captured_at     TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_history_product
    ON product_price_history (product_id, captured_at DESC);

CREATE INDEX IF NOT EXISTS idx_price_history_captured
    ON product_price_history (captured_at DESC);

-- Consultas recentes por produto (dedupe fica no workflow de ingestão)
