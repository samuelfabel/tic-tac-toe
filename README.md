# Kids Deals Platform

Plataforma **automática de achadinhos infantis** (gestantes, bebês, mães, pais e crianças), monetizada por links de afiliados.

O sistema não publica milhares de produtos à cega. Ele pergunta:

> “Dentre as ofertas disponíveis, quais são boas oportunidades para o meu público **agora**?”

```
PRODUTOS → COLETA → NORMALIZAÇÃO → FILTROS → SCORE → IA CURADORIA → CONTEÚDO
                                                              ↓
                                              Instagram · WhatsApp · Telegram
```

## Stack do MVP

| Camada | Escolha |
|---|---|
| Automação | **n8n** |
| Banco | **PostgreSQL 16** |
| Score | JS determinístico (`src/scoring/`) |
| IA | API LLM (classificar + copy) |
| Infra | Docker Compose em VPS |
| Dashboard | Metabase (posterior) |
| Imagens | URLs no MVP → S3/R2 depois |

**Sem** Kubernetes, **sem** Redis, **sem** scraping como fundação.

## Início rápido

```bash
# 1) Ambiente
cp infrastructure/.env.example infrastructure/.env
# edite POSTGRES_PASSWORD, N8N_ENCRYPTION_KEY, N8N_BASIC_AUTH_PASSWORD

# 2) Subir n8n + Postgres (migrations sobem sozinhas)
cd infrastructure
docker compose --env-file .env up -d

# 3) (opcional) dados demo
cd ..
npm run db:seed-demo

# 4) Testar o Opportunity Score localmente
npm test
npm run score:demo
```

- n8n: http://localhost:5678  
- Detalhes operacionais: [`docs/operations.md`](docs/operations.md)

## Estrutura do repositório

```
kids-deals-platform/
├── README.md
├── infrastructure/
│   ├── docker-compose.yml
│   ├── .env.example
│   └── backup/
├── database/
│   ├── migrations/          # schema + seed de categorias/regras
│   └── seeds/               # demo opcional
├── n8n/
│   ├── sources/             # Shopee, Mercado Livre
│   ├── scoring/             # score + análise de preço
│   ├── content/             # IA + copy
│   ├── distribution/        # Instagram, WhatsApp, Telegram
│   └── analytics/           # eventos de afiliado
├── prompts/                 # classify / generate / validate
├── src/
│   ├── contracts/           # JSON Schema ProductNormalized
│   └── scoring/             # Opportunity Score + testes
├── scripts/
└── docs/
    ├── architecture.md
    ├── affiliate-rules.md
    └── operations.md
```

## Opportunity Score

Fórmula determinística (100 pontos). A IA **não** decide se o preço é bom.

| Bloco | Pontos |
|---|---|
| Desconto/preço (histórico > anunciado) | 30 |
| Comissão (+ Comissão Extra) | 20 |
| Avaliação | 15 |
| Qtd. de avaliações | 10 |
| Vendas | 10 |
| Histórico de preço | 10 |
| Cupom ativo | 5 |

Threshold inicial de publicação: **≥ 70** (`OPPORTUNITY_SCORE_THRESHOLD`).

Exemplo: produto a R$50 com 5% + 10% extra → receita potencial R$7,50 (entra no score de comissão).

## Modelo de dados (resumo)

- `products` — catálogo normalizado multi-source  
- `product_price_history` — base do “menor preço registrado”  
- `coupons` — cupom + produto/categoria  
- `publications` — o que saiu em cada canal  
- `affiliate_events` — CLICK → ORDER → SALE → COMMISSION  
- `channel_settings` / `channel_rules` — frequência e compliance  

Ver SQL em `database/migrations/`.

## Workflows n8n

Importe os JSONs de `n8n/` (veja `docs/operations.md`).

| Workflow | Função |
|---|---|
| `WF_SOURCE_SHOPEE` | Coleta oficial → normalize → upsert → preço |
| `WF_SOURCE_MERCADOLIVRE` | Idem para ML |
| `WF_PRODUCT_SCORE` | Score + threshold |
| `WF_PRICE_ANALYSIS` | Flags de histórico 30d |
| `WF_GENERATE_CONTENT` | IA + copy factual |
| `WF_DISTRIBUTE_*` | Canais oficiais |
| `WF_AFFILIATE_EVENTS` | Webhook de métricas |

Todo source adapter emite o mesmo contrato: [`src/contracts/product-normalized.schema.json`](src/contracts/product-normalized.schema.json).

## Regras de ouro

1. **IA não inventa** preço, desconto, idade, cupom, material, certificação, frete… → `null`.
2. **Channel rules** — Mercado Livre não publica em WhatsApp/Telegram (`docs/affiliate-rules.md`).
3. **Anti-spam** — <24h não republica; 24h–7d só com queda forte; >7d ok.
4. **Segredos** só em credentials/env — nunca dentro do workflow versionado.
5. **API oficial primeiro**; scraping é último recurso.

## Roadmap (sprints)

1. Postgres + n8n + Shopee (produto, preço, imagem, afiliado, comissão)  
2. Histórico de preços + score + cupons  
3. IA: classificação + copy  
4. Instagram (Graph API / ferramentas oficiais)  
5. WhatsApp Business Cloud  
6. Analytics clique → venda → comissão  

Depois de tráfego/vendas: extrair o Product Engine do n8n para uma app própria. Manter **source abstrato** desde o dia 1 (Shopee primeira fonte, não a única).

## Documentação

- [Arquitetura](docs/architecture.md)
- [Regras de afiliados](docs/affiliate-rules.md)
- [Operações](docs/operations.md)
- Prompts em [`prompts/`](prompts/)
