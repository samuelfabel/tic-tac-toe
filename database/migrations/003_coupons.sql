-- 003_coupons.sql

CREATE TABLE IF NOT EXISTS coupons (
    id               BIGSERIAL PRIMARY KEY,
    source           VARCHAR(50),
    code             VARCHAR(100),
    description      TEXT,
    discount_type    VARCHAR(30),  -- percent | fixed | frete
    discount_value   NUMERIC(12, 2),
    minimum_purchase NUMERIC(12, 2),
    maximum_discount NUMERIC(12, 2),
    starts_at        TIMESTAMP,
    expires_at       TIMESTAMP,
    product_id       BIGINT REFERENCES products (id) ON DELETE SET NULL,
    category         VARCHAR(100),
    affiliate_url    TEXT,
    active           BOOLEAN DEFAULT TRUE,
    created_at       TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_active
    ON coupons (active) WHERE active = TRUE;

CREATE INDEX IF NOT EXISTS idx_coupons_product
    ON coupons (product_id);

CREATE INDEX IF NOT EXISTS idx_coupons_expires
    ON coupons (expires_at);
