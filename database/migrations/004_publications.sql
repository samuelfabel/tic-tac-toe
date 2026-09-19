-- 004_publications.sql
-- Publicações + configurações de canal + regras de afiliado por canal

CREATE TABLE IF NOT EXISTS channel_settings (
    channel               VARCHAR(50) PRIMARY KEY,
    max_posts_per_day     INTEGER NOT NULL DEFAULT 5,
    min_interval_minutes  INTEGER NOT NULL DEFAULT 60,
    enabled               BOOLEAN DEFAULT TRUE,
    updated_at            TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS channel_rules (
    id         BIGSERIAL PRIMARY KEY,
    source     VARCHAR(50) NOT NULL,
    channel    VARCHAR(50) NOT NULL,
    allowed    BOOLEAN     NOT NULL DEFAULT TRUE,
    reason     TEXT,
    UNIQUE (source, channel)
);

CREATE TABLE IF NOT EXISTS publications (
    id              BIGSERIAL PRIMARY KEY,
    product_id      BIGINT REFERENCES products (id) ON DELETE SET NULL,
    channel         VARCHAR(50) NOT NULL,
    content         TEXT,
    affiliate_url   TEXT,
    status          VARCHAR(30) NOT NULL DEFAULT 'pending',
    -- pending | scheduled | published | failed | skipped
    external_id     VARCHAR(255),
    skip_reason     TEXT,
    scheduled_at    TIMESTAMP,
    published_at    TIMESTAMP,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_publications_product
    ON publications (product_id, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_publications_channel_day
    ON publications (channel, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_publications_status
    ON publications (status);
