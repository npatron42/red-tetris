#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOSTING_ENV="$ROOT_DIR/hosting/.env"
SERVER_ENV="$ROOT_DIR/server/.env"
BACKOFFICE_ENV="$ROOT_DIR/backoffice/.env"

gen_uuid() {
    if command -v uuidgen >/dev/null 2>&1; then
        uuidgen | tr '[:upper:]' '[:lower:]'
    elif [ -r /proc/sys/kernel/random/uuid ]; then
        cat /proc/sys/kernel/random/uuid
    else
        python3 -c 'import uuid; print(uuid.uuid4())'
    fi
}

POSTGRES_DB="red-tetris"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="$(gen_uuid)"
POSTGRES_HOST="db"
POSTGRES_PORT="5432"

DIRECTUS_KEY="$(gen_uuid)"
DIRECTUS_SECRET="$(gen_uuid)"
DIRECTUS_ADMIN_EMAIL="admin@gmail.com"
DIRECTUS_ADMIN_PASSWORD="$(gen_uuid)"

JWT_SECRET="$(gen_uuid)"

write_env() {
    local path="$1"
    local content="$2"
    mkdir -p "$(dirname "$path")"
    if [ -f "$path" ]; then
        cp "$path" "$path.bak"
        echo "Backed up existing $path -> $path.bak"
    fi
    printf '%s\n' "$content" > "$path"
    chmod 600 "$path"
    echo "Wrote $path"
}

write_env "$HOSTING_ENV" "POSTGRES_DB=$POSTGRES_DB
POSTGRES_USER=$POSTGRES_USER
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
POSTGRES_HOST=$POSTGRES_HOST
POSTGRES_PORT=$POSTGRES_PORT"

write_env "$SERVER_ENV" "DATABASE_URL=postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB
JWT_SECRET=$JWT_SECRET
PORT=4000"

write_env "$BACKOFFICE_ENV" "KEY=$DIRECTUS_KEY
SECRET=$DIRECTUS_SECRET

DB_CLIENT=pg
DB_HOST=$POSTGRES_HOST
DB_PORT=$POSTGRES_PORT
DB_DATABASE=$POSTGRES_DB
DB_USER=$POSTGRES_USER
DB_PASSWORD=$POSTGRES_PASSWORD

ADMIN_EMAIL=$DIRECTUS_ADMIN_EMAIL
ADMIN_PASSWORD=$DIRECTUS_ADMIN_PASSWORD

PUBLIC_URL=http://localhost:8055"

echo ""
echo "==============================================="
echo "Directus admin credentials:"
echo "  email:    $DIRECTUS_ADMIN_EMAIL"
echo "  password: $DIRECTUS_ADMIN_PASSWORD"
echo "==============================================="
