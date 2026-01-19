## 💾 Creating a Directus Snapshot

Easily take a snapshot of your database schema with Directus. Follow these steps:

1. **Access the backoffice container:**
   ```bash
   docker exec -u 0 -it backoffice sh
   ```

2. **Create a schema snapshot (replace `[date]` with today’s date, e.g., `20260119`):**
   ```bash
   npx directus schema snapshot ./data/snapshots/[date]
   ```

---

