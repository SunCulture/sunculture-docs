---
sidebar_position: 3
title: Getting Started
---

# Getting Started

This guide will help you set up and run the AMT Backend application locally.

## Prerequisites

- Node.js (>=14.0.0)
- MySQL 5.7 or higher
- Redis server
- npm or yarn package manager
- Git

## Installation

### 1. Clone the Repository

```bash
git clone [repository-url]
cd amt-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Application
NODE_ENV=development
PORT=8080
API_PREFIX=/api

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=amt_development
DB_PORT=3306

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
APP_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# AWS (optional for local dev)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret

# Kafka
KAFKA_BROKERS=localhost:9092

# API Keys (as needed)
SGMAIL_APIKEY=your-sendgrid-key
SENTRY_DSN=your-sentry-dsn
```

### 4. Database Setup

Run database migrations:

```bash
npm run migrate
```

Seed initial data (if available):

```bash
npm run seed
```

## Running the Application

### Development Mode

```bash
npm run dev
```

This starts the application with nodemon for automatic reloading on file changes.

### Production Mode

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Using PM2

For production deployment with PM2:

```bash
npm run startProd
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Code Quality

### Linting

Check code style:

```bash
npm run lint
```

Fix linting issues:

```bash
npm run lint:fix
```

### Type Checking

Verify TypeScript types:

```bash
npx tsc --noEmit
```

## API Documentation

Once the application is running, access the Swagger documentation at:

```
http://localhost:8080/api-docs
```

## Common Development Tasks

### Creating a New Feature Module

1. Create a new directory under `server/features/`
2. Add the following structure:
   ```
   feature-name/
   ├── controllers/
   ├── services/
   ├── models/
   ├── dto/
   ├── interfaces/
   └── events/
   ```

### Adding a New Model

1. Create model file in `server/models/`
2. Register it in `server/databases/index.ts`
3. Create a migration if needed

### Creating a Migration

```bash
npx sequelize-cli migration:generate --name migration-name
```

## Debugging

### Using VS Code

Add this configuration to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug TypeScript",
      "program": "${workspaceFolder}/server/index.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

### Logging

The application uses Winston for logging. Logs are stored in:
- Development: Console output
- Production: `logs/` directory

## Troubleshooting

### Database Connection Issues

1. Verify MySQL is running
2. Check database credentials in `.env`
3. Ensure database exists

### Redis Connection Issues

1. Verify Redis server is running
2. Check Redis configuration
3. Test connection: `redis-cli ping`

### Port Already in Use

Change the port in `.env` or kill the process:

```bash
lsof -i :8080
kill -9 [PID]
```

## Next Steps

- Review the [Architecture Documentation](./architecture)
- Explore the [API Reference](./api-reference)
- Learn about [Database Schema](./database)
- Read the [Deployment Guide](./deployment)