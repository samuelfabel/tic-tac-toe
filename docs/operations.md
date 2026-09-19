# Operações — MVP

## Subir o stack

```bash
cp infrastructure/.env.example infrastructure/.env
# edite senhas e N8N_ENCRYPTION_KEY

cd infrastructure
docker compose --env-file .env up -d
```

- n8n: http://localhost:5678  
- Postgres: localhost:5432 (não exponha em produção)

As migrations em `database/migrations/` rodam **automaticamente** na primeira criação do volume Postgres.

## Seed demo (opcional)

```bash
npm run db:seed-demo
# ou:
docker exec -i kids-deals-postgres psql -U kidsdeals -d kids_deals < database/seeds/002_demo_products.sql
```

## Importar workflows n8n

1. Abra n8n → Workflows → Import from File
2. Importe na ordem sugerida:
   - `n8n/sources/shopee.json`
   - `n8n/scoring/product-score.json`
   - `n8n/scoring/price-analysis.json`
   - `n8n/content/generate-content.json`
   - `n8n/distribution/instagram.json`
   - `n8n/distribution/whatsapp.json`
   - `n8n/analytics/affiliate-events.json`
3. Configure credentials: Postgres, OpenAI, Meta, WhatsApp, HTTP Header Auth (Shopee)
4. Ajuste URLs de feed (`SHOPEE_OFFER_FEED_URL`, etc.)
5. Ative os schedules só depois do smoke test manual

## Testar o score localmente (sem Docker)

```bash
npm test
npm run score:demo
```

## Backup

```bash
chmod +x infrastructure/backup/backup.sh
# cron diário, ex.: 3h da manhã
0 3 * * * /opt/kids-deals/infrastructure/backup/backup.sh >> /var/log/kids-deals-backup.log 2>&1
```

## Segurança (checklist)

- [ ] HTTPS (Caddy/Nginx) na frente do n8n
- [ ] Postgres **sem** porta pública em produção
- [ ] `N8N_BASIC_AUTH_*` forte + 2FA no provedor quando possível
- [ ] Tokens só em Credentials / `.env` (nunca no JSON versionado)
- [ ] Webhooks com secret
- [ ] Firewall (só 80/443)
- [ ] Backup diário testado (restore trial)
- [ ] Rodar Security Audit do n8n periodicamente

## Dashboard (Metabase)

Conecte no mesmo Postgres e use as views:

- `v_daily_metrics` — cliques, pedidos, comissão/dia
- `v_publications_today` — volume por canal
- `v_product_price_stats` — histórico 30d

Indicadores sugeridos: publicados hoje, cliques, pedidos, comissão, top categorias, top produtos.

## Troubleshooting

| Sintoma | Ação |
|---|---|
| Migration não rodou | Volume antigo: `docker compose down -v` (apaga dados) ou rode SQL manual |
| Score sempre 0 | Sem histórico ainda — rode ingestão algumas vezes |
| WA/ML não publica | Verifique `channel_rules` |
| IA inventando preço | Garanta prompts/ e copy factual do Code node |
| Webhook 401/aberto | Ative auth no node Webhook |
