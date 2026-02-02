#!/bin/sh

postgres_is_ready() {
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_DATABASE" -p "$DB_PORT" -c '\q' > /dev/null 2>&1
}

echo "DB_PASSWORD: $DB_PASSWORD"
echo "DB_HOST: $DB_HOST"
echo "DB_USER: $DB_USER"
echo "DB_DATABASE: $DB_DATABASE"
echo "DB_PORT: $DB_PORT"

echo "Waiting for postgres..."
until postgres_is_ready; do
    echo "PostgreSQL not ready..."
    sleep 5
done

echo "PostgreSQL is ready"

echo "Bootstrapping Directus..."
npx directus bootstrap

echo "Applying Directus schema snapshot..."

#TODO: find a way to apply the correct snapshot in a dynamic way FABIO PALUMBOBOBOBOBOBO
npx directus schema apply --yes ./data/snapshots/2026020200.yml

echo "Starting Directus..."
npx directus start
