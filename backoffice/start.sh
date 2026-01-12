#!/bin/sh

postgres_is_ready() {
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_DATABASE" -p "$DB_PORT" -c '\q' > /dev/null 2>&1
}

echo "Waiting for postgres..."
until postgres_is_ready; do
    echo "PostgreSQL not ready..."
    sleep 5
done

echo "PostgreSQL is ready"

echo "Bootstrapping Directus..."
npx directus bootstrap

echo "Applying Directus schema snapshot..."
npx directus schema apply --yes ./data/snapshots/2025123001.yml

echo "Starting Directus..."
npx directus start
