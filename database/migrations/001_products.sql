-- 001_products.sql
-- Produtos normalizados de qualquer marketplace (source abstrato)

CREATE TABLE IF NOT EXISTS products (
    id                      BIGSERIAL PRIMARY KEY,
    source                  VARCHAR(50)  NOT NULL,
    source_product_id       VARCHAR(255) NOT NULL,
    title                   TEXT         NOT NULL,
    description             TEXT,
    product_url             TEXT,
    affiliate_url           TEXT,
    image_url               TEXT,
    category                VARCHAR(100),
    subcategory             VARCHAR(100),
    target_age_min          INTEGER,
    target_age_max          INTEGER,
    audience                TEXT[],
    price                   NUMERIC(12, 2),
    original_price          NUMERIC(12, 2),
    rating                  NUMERIC(3, 2),
    review_count            INTEGER,
    sold_count              INTEGER,
    commission_percent      NUMERIC(6, 3),
    extra_commission_percent NUMERIC(6, 3) DEFAULT 0,
    currency                VARCHAR(10)  DEFAULT 'BRL',
    opportunity_score       NUMERIC(5, 2),
    ai_quality              VARCHAR(20),
    ai_publishable          BOOLEAN,
    ai_content_angle        TEXT,
    ai_reason               TEXT,
    ai_classified_at        TIMESTAMP,
    first_seen_at           TIMESTAMP    NOT NULL DEFAULT NOW(),
    last_seen_at            TIMESTAMP    NOT NULL DEFAULT NOW(),
    active                  BOOLEAN      DEFAULT TRUE,
    UNIQUE (source, source_product_id)
);

CREATE INDEX IF NOT EXISTS idx_products_source ON products (source);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products (active) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_score ON products (opportunity_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_products_last_seen ON products (last_seen_at DESC);
