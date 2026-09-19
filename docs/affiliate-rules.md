# Regras de afiliados e canais

> Atualize este documento sempre que o ToS de um programa mudar.
> A fonte da verdade operacional é a tabela `channel_rules`.

## Princípio

O sistema **não deve** construir automações que violem o programa de afiliados.
Antes de publicar, o workflow consulta:

```sql
SELECT allowed FROM channel_rules
WHERE source = $source AND channel = $channel;
```

## Shopee (BR)

- Programa de afiliados ativo no Brasil (comissão padrão + Comissão Extra de vendedores).
- Comissão Extra: verificar janela de atribuição vigente (ex.: clique → compra em N dias).
- Preferir integração oficial / feed de ofertas; marcação de produtos no Instagram quando a conta for elegível.
- Pagamento: acompanhar valor mínimo de saque vigente no painel.

**Canais (seed inicial):** Instagram ✅ · WhatsApp ✅ · Telegram ✅ · Linktree ✅

## Mercado Livre

- Links de afiliado gerados pelos métodos oficiais do programa.
- Documentação recente indica restrições: **WhatsApp e Telegram entre canais não permitidos** para recomendações.
- Seed do banco já bloqueia esses canais (`allowed = false`).

**Canais (seed inicial):** Instagram ✅ · Linktree ✅ · WhatsApp ❌ · Telegram ❌

## Amazon (posterior)

- Associates BR — validar ToS de canais e deep links antes de ativar.
- Seed inicial libera canais com nota para revisão manual.

## Regras gerais de publicação

1. Sem scraping como fundação.
2. Sem browser automation para “postar no Instagram”.
3. Tokens apenas em credentials/env do n8n.
4. Anti-spam: <24h bloqueia; 24h–7d só com queda forte de preço; >7d ok.
5. Frequência via `channel_settings` (IG 3–5/dia, WA 5–10/dia, TG 10–20/dia).

## Checklist antes de ligar um canal

- [ ] Conta/programa aprovado
- [ ] Credenciais no n8n (não no JSON do workflow)
- [ ] Linha em `channel_rules` revisada
- [ ] `channel_settings.enabled = true`
- [ ] Teste com 1 produto demo
- [ ] Log em `publications` ok
