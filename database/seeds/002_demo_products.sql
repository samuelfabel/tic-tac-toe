-- Seed de exemplo para desenvolvimento local (produtos fictícios)
-- Não usar em produção.

INSERT INTO products (
    source, source_product_id, title, description,
    product_url, affiliate_url, image_url,
    category, subcategory, price, original_price,
    rating, review_count, sold_count,
    commission_percent, extra_commission_percent, currency
) VALUES
(
    'shopee', 'DEMO-001',
    'Kit 20 peças brinquedo educativo madeira',
    'Kit educativo com peças de madeira para crianças.',
    'https://example.com/p/DEMO-001',
    'https://example.com/aff/DEMO-001',
    'https://example.com/img/DEMO-001.jpg',
    'CRIANCA', 'BRINQUEDOS',
    39.90, 89.90,
    4.80, 1520, 8000,
    5.000, 10.000, 'BRL'
),
(
    'shopee', 'DEMO-002',
    'Bombinha tira leite elétrica portátil',
    NULL,
    'https://example.com/p/DEMO-002',
    'https://example.com/aff/DEMO-002',
    'https://example.com/img/DEMO-002.jpg',
    'MATERNIDADE', 'AMAMENTACAO',
    129.90, 199.90,
    4.60, 430, 2100,
    8.000, 0, 'BRL'
),
(
    'mercadolivre', 'DEMO-ML-001',
    'Fralda descartável RN pacote econômico',
    NULL,
    'https://example.com/p/DEMO-ML-001',
    'https://example.com/aff/DEMO-ML-001',
    'https://example.com/img/DEMO-ML-001.jpg',
    'BEBE', 'HIGIENE',
    54.90, 69.90,
    4.70, 890, 15000,
    4.000, 0, 'BRL'
)
ON CONFLICT (source, source_product_id) DO NOTHING;

-- Histórico simulado (produto DEMO-001 caiu de preço)
INSERT INTO product_price_history (product_id, price, original_price, captured_at)
SELECT p.id, v.price, v.original_price, NOW() - (v.days || ' days')::INTERVAL
FROM products p
CROSS JOIN (VALUES
    (28, 89.90, 99.90),
    (21, 79.90, 99.90),
    (14, 69.90, 99.90),
    (7,  49.90, 89.90),
    (0,  39.90, 89.90)
) AS v(days, price, original_price)
WHERE p.source = 'shopee' AND p.source_product_id = 'DEMO-001'
ON CONFLICT DO NOTHING;

INSERT INTO coupons (
    source, code, description, discount_type, discount_value,
    minimum_purchase, maximum_discount, expires_at, product_id, active
)
SELECT
    'shopee', 'KIDS20', 'R$20 off em brinquedos', 'fixed', 20.00,
    50.00, 20.00, NOW() + INTERVAL '7 days', p.id, TRUE
FROM products p
WHERE p.source = 'shopee' AND p.source_product_id = 'DEMO-001'
ON CONFLICT DO NOTHING;
