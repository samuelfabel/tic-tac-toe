-- Seed: taxonomia + configs de canal + regras de afiliado
-- Espelho de database/migrations/007_seed_categories.sql (reload manual)

INSERT INTO categories (slug, parent_slug, label_pt) VALUES
    ('MATERNIDADE', NULL, 'Maternidade'),
    ('GESTANTE', 'MATERNIDADE', 'Gestante'),
    ('AMAMENTACAO', 'MATERNIDADE', 'Amamentação'),
    ('ENXOVAL', 'MATERNIDADE', 'Enxoval'),
    ('POS_PARTO', 'MATERNIDADE', 'Pós-parto'),
    ('ACESSORIOS_MATERNIDADE', 'MATERNIDADE', 'Acessórios'),
    ('BEBE', NULL, 'Bebê'),
    ('ALIMENTACAO', 'BEBE', 'Alimentação'),
    ('HIGIENE', 'BEBE', 'Higiene'),
    ('SONO', 'BEBE', 'Sono'),
    ('PASSEIO', 'BEBE', 'Passeio'),
    ('ROUPAS_BEBE', 'BEBE', 'Roupas'),
    ('SEGURANCA', 'BEBE', 'Segurança'),
    ('CRIANCA', NULL, 'Criança'),
    ('BRINQUEDOS', 'CRIANCA', 'Brinquedos'),
    ('ROUPAS_CRIANCA', 'CRIANCA', 'Roupas'),
    ('CALCADOS', 'CRIANCA', 'Calçados'),
    ('ESCOLA', 'CRIANCA', 'Escola'),
    ('LIVROS', 'CRIANCA', 'Livros'),
    ('JOGOS', 'CRIANCA', 'Jogos'),
    ('ELETRONICOS', 'CRIANCA', 'Eletrônicos'),
    ('CASA_COM_CRIANCAS', NULL, 'Casa com crianças'),
    ('ORGANIZACAO', 'CASA_COM_CRIANCAS', 'Organização'),
    ('COZINHA', 'CASA_COM_CRIANCAS', 'Cozinha'),
    ('LIMPEZA', 'CASA_COM_CRIANCAS', 'Limpeza'),
    ('DECORACAO', 'CASA_COM_CRIANCAS', 'Decoração'),
    ('PRESENTES', NULL, 'Presentes'),
    ('PRESENTE_BEBE', 'PRESENTES', 'Bebê'),
    ('PRESENTE_CRIANCA', 'PRESENTES', 'Criança'),
    ('PRESENTE_MATERNIDADE', 'PRESENTES', 'Maternidade')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO channel_settings (channel, max_posts_per_day, min_interval_minutes, enabled) VALUES
    ('instagram', 5, 120, TRUE),
    ('whatsapp', 8, 60, TRUE),
    ('telegram', 15, 30, FALSE),
    ('linktree', 20, 15, TRUE)
ON CONFLICT (channel) DO UPDATE SET
    max_posts_per_day = EXCLUDED.max_posts_per_day,
    min_interval_minutes = EXCLUDED.min_interval_minutes,
    enabled = EXCLUDED.enabled,
    updated_at = NOW();

INSERT INTO channel_rules (source, channel, allowed, reason) VALUES
    ('shopee', 'instagram', TRUE, NULL),
    ('shopee', 'whatsapp', TRUE, NULL),
    ('shopee', 'telegram', TRUE, NULL),
    ('shopee', 'linktree', TRUE, NULL),
    ('mercadolivre', 'instagram', TRUE, NULL),
    ('mercadolivre', 'linktree', TRUE, NULL),
    ('mercadolivre', 'whatsapp', FALSE, 'Programa de afiliados ML: WhatsApp não permitido para recomendações'),
    ('mercadolivre', 'telegram', FALSE, 'Programa de afiliados ML: Telegram não permitido para recomendações'),
    ('amazon', 'instagram', TRUE, NULL),
    ('amazon', 'whatsapp', TRUE, 'Verificar ToS atual do Associates BR'),
    ('amazon', 'telegram', TRUE, 'Verificar ToS atual do Associates BR'),
    ('amazon', 'linktree', TRUE, NULL)
ON CONFLICT (source, channel) DO UPDATE SET
    allowed = EXCLUDED.allowed,
    reason = EXCLUDED.reason;
