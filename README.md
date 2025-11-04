# FiSendApi

FiSendApi is a small TypeScript/Node.js microservice for sending notifications (email and SMS) and for managing service configurations and API keys. The project uses Express for the HTTP API, Prisma for the database layer (SQLite by default), and a simple controller/service structure to separate concerns.

This service is designed to be integrated into other systems to provide centralized notification capabilities. It helps you set up notification services that your applications can call. You can create a notification service and generate an API key for it; any external service or application can then interact with FiSendApi using that API key to send email or SMS notifications according to the configured service credentials and settings.

## Key features

- Send and manage Email and SMS services
- Support for service configuration (credentials/metadata)
- API-key based middleware for service authentication
- JWT-based auth endpoints
- Prisma ORM for schema, migrations and seeding (SQLite by default)
- Docker and docker-compose support for easy local deployment

## Tech stack

- Node.js + TypeScript
- Express
- Prisma (SQLite datasource by default)
- Nodemailer (email) and any SMS provider integrations (via service configs)
- Docker / docker-compose for containerized runtime

## Repository layout (important files)

- `src/` — TypeScript source
	- `controllers/` — HTTP controllers (auth, email, sms, service, service_config)
	- `Services/` — Business logic for each area
	- `middlewares/` — `apikey.ts`, `authenticate.ts`
	- `Routers/` — route wiring for endpoints
	- `index.ts` — app entry
- `prisma/` — Prisma schema and seed script (`schema.prisma`, `seed.ts`)
- `Dockerfile`, `docker-compose.yaml` — containerized runtime
- `configure.sh` — convenience script referenced by earlier README (keeps environment/bootstrap steps)
- `package.json` — scripts and dependencies

## Quick start — prerequisites

- Node.js (>= 18 recommended) and npm installed
- Docker & docker-compose (optional, for containerized run)

## Running locally (development)

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file at the project root. Minimal environment variables used by the project include:

```
DATABASE_URL="file:./dev.db"
PORT=3000
JWT_SECRET=your_jwt_secret_here
```

3. Run Prisma migrations (if you plan to change schema) and seed the database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

4. Start in development (uses `ts-node`/nodemon)

```bash
npm run dev
```

or start directly with `ts-node` (production start script in `package.json` is `start`):

```bash
npm run start
```

Notes:
- The project uses `prisma.seed` configured in `package.json` which calls `ts-node prisma/seed.ts`.
- The default datasource in `prisma/schema.prisma` is `sqlite` and reads `DATABASE_URL` from `.env`.

## Running with Docker

You can run the app using the provided `Dockerfile` and `docker-compose.yaml`. Example (from project root):

```bash
docker-compose up --build
```

This will build the container and run the service. Ensure environment variables used by the container are set in your compose file or an `.env` the compose references.

## API overview

The project exposes a set of REST endpoints organized by routers in `src/Routers/`.

Main routes (high level):

- `POST /auth` — authentication endpoints (login/register depending on controller)
- `POST /email` — send email (see `email.controller.ts`)
- `POST /sms` — send SMS (see `sms.controller.ts`)
- `POST /service` — manage services (create API keys, toggle active state)
- `POST /service-config` — add/update credentials for services

Each route is handled by a controller in `src/controllers/` and delegates to the matching service in `src/Services/`.

Authentication & security:
- API keys can be used to protect service endpoints via `middlewares/apikey.ts`.
- JWT auth is used for user-level authentication via `authenticate.ts`.

Examples

Send an email (JSON body example):

```json
{
	"to": "user@example.com",
	"subject": "Hello",
	"body": "Test message",
	"serviceApiKey": "service-api-key-here"
}
```

Adjust the exact request body to match the controller's expected payload (check `src/controllers/email.controller.ts`).

## Database and Prisma

- Schema: `prisma/schema.prisma` (uses SQLite by default)
- Seed: `prisma/seed.ts` (configured in `package.json` as the seed command)

If you switch to another provider (Postgres, MySQL), update `prisma/schema.prisma` datasource and the `DATABASE_URL` accordingly.

## Scripts (from `package.json`)

- `npm run dev` — development with `nodemon` (reloads on change)
- `npm run start` — run with `ts-node src/index.ts`
- `npm run build` — compile TypeScript with `tsc`
- `npm run lint` / `npm run format` — linting and formatting helpers

## Tests

This repository currently doesn't include an automated test suite. Recommended next steps:

- Add unit tests for services (Jest or Vitest)
- Add integration tests for controllers (supertest)

## Development notes & recommended improvements

- Add OpenAPI/Swagger docs to document routes and request/response shapes.
- Add tests (unit + integration) and CI pipeline.
- Extend service drivers (for SMS) by adding an adapter pattern for different providers.
- Add role-based access if multiple user roles are required.

## Contributing

Feel free to open issues or PRs. Follow the existing coding style and run `npm run lint` / `npm run format` before submitting.

## License

This project uses the ISC license (see `package.json`).

---

If you'd like, I can also:

- add a `docs/` folder with endpoint examples and a Swagger spec,
- add a `Makefile` or improved `configure.sh` to automate env setup and Prisma commands,
- create example `.env.example` with recommended variables.

Run `./configure.sh` if you'd like the repository's provided setup script to make initial configuration and db setup.
