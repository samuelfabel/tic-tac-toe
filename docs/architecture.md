# Arquitetura — Kids Deals Platform

## Visão

Plataforma automatizada de ofertas/cupons infantis monetizada por afiliados.
O sistema **não** publica tudo: coleta → normaliza → filtra → score → curadoria IA → conteúdo → distribuição.

```
MARKETPLACES → INGESTION (n8n) → PostgreSQL
                                      ↓
                            OPPORTUNITY ENGINE (score)
                                      ↓
                              CONTENT ENGINE (IA)
                                      ↓
                    Instagram / WhatsApp / Telegram / Web
                                      ↓
                              AFFILIATE EVENTS → analytics
```

## Princípios

1. **Source abstrato** — todo adapter emite `ProductNormalized` (`src/contracts/`).
2. **Preço é regra** — desconto histórico e score são determinísticos (`src/scoring/`).
3. **IA não inventa fatos** — classifica e escreve copy; `null` quando não souber.
4. **Channel rules** — ex.: Mercado Livre não vai para WhatsApp/Telegram.
5. **Sem scraping no MVP** — API/feed oficial de afiliados primeiro.
6. **Sem K8s no MVP** — Docker Compose: n8n + Postgres na VPS.

## Componentes

| Componente | Tecnologia | Responsabilidade |
|---|---|---|
| Ingestion | n8n workflows `n8n/sources/` | Coleta e normalização |
| Product DB | PostgreSQL 16 | Produtos, preços, cupons, pubs, eventos |
| Opportunity Engine | JS em n8n + `src/scoring/` | Score 0–100 |
| Content Engine | LLM + prompts/ | Classificação e copy |
| Distribution | n8n + APIs oficiais | IG / WA / TG |
| Analytics | `affiliate_events` + Metabase | Clique → venda → comissão |

## Opportunity Score (100 pts)

| Bloco | Pts | Nota |
|---|---|---|
| Desconto/preço | 30 | 70% histórico + 30% anunciado |
| Comissão (+ extra) | 20 | receita potencial = preço × (base+extra)% |
| Avaliação | 15 | rating |
| Qtd. avaliações | 10 | escala log |
| Vendas | 10 | escala log |
| Histórico | 10 | proximidade do mínimo 30d |
| Cupom | 5 | cupom ativo |

Threshold inicial: **70**.

## Fluxo de sprints

1. Postgres + n8n + Shopee (upsert + preço)
2. Histórico + score + cupons
3. IA classificação + copy
4. Instagram (Graph API)
5. WhatsApp Cloud API
6. Analytics / eventos de afiliado

## Infra MVP

```
VPS
├── n8n
├── PostgreSQL
├── Caddy/Nginx (HTTPS)
└── backup diário (infrastructure/backup/backup.sh)
```

Imagens: no MVP, guardar só URLs; depois S3/R2.
