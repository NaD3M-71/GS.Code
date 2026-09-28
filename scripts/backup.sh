#!/usr/bin/env bash
# Backup diario de la base y de las imágenes. Guarda los últimos 14 días.
# Uso (desde la carpeta del proyecto en el VPS): ./scripts/backup.sh
set -euo pipefail

cd "$(dirname "$0")/.."
source .env

DESTINO="backups"
FECHA=$(date +%Y-%m-%d_%H%M)
mkdir -p "$DESTINO"

# Base de datos
docker compose exec -T db mysqldump -uroot -p"$BD_ROOT_PASS" \
  --single-transaction --routines "$BD_NOMBRE" | gzip > "$DESTINO/db_$FECHA.sql.gz"

# Imágenes subidas
docker run --rm -v gscode_uploads:/datos:ro -v "$PWD/$DESTINO":/backup alpine \
  tar czf "/backup/uploads_$FECHA.tar.gz" -C /datos .

# Borrar backups de más de 14 días
find "$DESTINO" -type f -mtime +14 -delete

echo "Backup OK: $FECHA"
