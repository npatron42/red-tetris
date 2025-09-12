postgres_is_ready() {
    PGPASSWORD="$PGPASSWORD" psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -p "$POSTGRES_PORT" -c '\q' > /dev/null 2>&1
}

echo "Waiting for postgres..."
until postgres_is_ready; do
    echo "PostgreSQL not ready..."
    sleep 5
done

echo "PostgreSQL is ready"


npx prisma migrate dev --name ini

npm run dev