#!/usr/bin/env bash
# Backup diário do PostgreSQL (MVP — rode via cron na VPS)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="${SCRIPT_DIR}/../backup"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
FILENAME="kids_deals_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

# Carrega .env se existir
if [[ -f "${SCRIPT_DIR}/../.env" ]]; then
  # shellcheck disable=SC1091
  source "${SCRIPT_DIR}/../.env"
fi

POSTGRES_USER="${POSTGRES_USER:-kidsdeals}"
POSTGRES_DB="${POSTGRES_DB:-kids_deals}"
CONTAINER="${POSTGRES_CONTAINER:-kids-deals-postgres}"

echo "[backup] Iniciando dump de ${POSTGRES_DB}..."
docker exec "${CONTAINER}" pg_dump -U "${POSTGRES_USER}" "${POSTGRES_DB}" \
  | gzip > "${BACKUP_DIR}/${FILENAME}"

echo "[backup] Salvo em ${BACKUP_DIR}/${FILENAME}"

# Retém apenas os últimos 14 backups
ls -1t "${BACKUP_DIR}"/kids_deals_*.sql.gz 2>/dev/null | tail -n +15 | xargs -r rm --
echo "[backup] Limpeza de backups antigos concluída."
