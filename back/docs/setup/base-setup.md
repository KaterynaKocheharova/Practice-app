# Backend Setup

## Requirements

- Node.js installed.
- npm installed.
- Docker available if using the local PostgreSQL container.

## Install

```bash
npm install
```

## Environment

Create `.env` with:

```env
DATABASE_URL=postgres://myuser:mypassword@localhost:5432/mydb
PORT=3005
NODE_ENV=development
```

`DATABASE_URL` must match `docker-compose.yml` if using the local database.

Full environment instructions live in `docs/setup/env.md`.

## Start Database

```bash
docker compose up -d
```

This starts PostgreSQL, Redis and MinIO (local object storage, see [storage.md](../infrastructure/storage.md)). To start only some of them, name the services, e.g. `docker compose up -d db minio`.

## Migrations

Generate migrations after schema changes:

```bash
npm run db:generate
```

Run pending migrations:

```bash
npm run db:migrate
```

For local development only:

```bash
npm run db:push
```

## Run Backend

Development:

```bash
npm run start:dev
```

One-time start:

```bash
npm run start
```

Default port is `3005` unless `PORT` is set.

## Validation

Build:

```bash
npm run build
```
