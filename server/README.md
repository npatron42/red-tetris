# Red Tetris Server

## Prisma Commands

### Setup

```bash
# Install dependencies (includes Prisma)
npm install
```

### Database URL

Make sure you have your `DATABASE_URL` environment variable set in your `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/database_name"
```

### Generate Prisma Client

After modifying `schema.prisma` or when setting up for the first time, generate the Prisma client:

```bash
npx prisma generate
```

### Pull Database Schema (Introspection)

To pull the current database schema and update `schema.prisma`:

```bash
npx prisma db pull
```

### Push Schema to Database

To push your Prisma schema to the database (creates/updates tables without migrations):

```bash
npx prisma db push
```

### Migrations

Create a new migration:

```bash
npx prisma migrate dev --name <migration_name>
```

Apply pending migrations in production:

```bash
npx prisma migrate deploy
```

Reset the database (drops all data and re-applies migrations):

```bash
npx prisma migrate reset
```

### Prisma Studio

Open Prisma Studio to view and edit data in your database:

```bash
npx prisma studio
```

### Validate Schema

Validate your Prisma schema file:

```bash
npx prisma validate
```

### Format Schema

Format your Prisma schema file:

```bash
npx prisma format
```

## Models

The database includes the following application models:

- **User** - Game users with stats (wins, losses, scores)
- **Room** - Game rooms with leader and opponent
- **Match** - Multiplayer match history
- **SoloGame** - Solo game sessions with scores and stats

## DAO Layer

Data Access Objects are located in `src/dao/`:

- `userDao.js` - User CRUD operations
- `roomDao.js` - Room CRUD operations
- `matchDao.js` - Match CRUD operations
- `gameDao.js` - Solo game CRUD operations

All DAO methods include error handling with try/catch blocks.
