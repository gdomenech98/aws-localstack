# API Service

A TypeScript Express API with support for development (hot reload) and production builds.

## Features

- **TypeScript** - Fully typed API service
- **Express.js** - Lightweight web framework
- **Hot Reload** - Automatic restart on file changes during development
- **Multi-stage Docker** - Optimized images for dev and production
- **ESLint** - Code quality linting

## Project Structure

```
api/
├── src/
│   └── index.ts          # Main application entry point
├── dockerfile            # Multi-stage Dockerfile
├── docker-compose.yml    # Docker Compose configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## Local Development

### Prerequisites

- Node.js 20+ or Docker

### Development (with hot reload)

Using Node.js directly:
```bash
npm install
npm run dev
```

Using Docker:
```bash
docker-compose up api-dev
```

The API will be available at `http://localhost:3000`

### Available Endpoints

- `GET /health` - Health check endpoint
- `GET /api/users` - Get list of users
- `POST /api/users` - Create a new user

### Building the Project

Build TypeScript to JavaScript:
```bash
npm run build
```

### Production Build

Using Docker:
```bash
docker build -t api:prod --target production .
docker run -p 3000:3000 api:prod
```

Using Docker Compose:
```bash
docker-compose up api-prod
```

## NPM Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server
- `npm run dev` - Start development server with hot reload
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types without emitting

## Docker Stages

### Builder
Compiles TypeScript code to JavaScript.

### Development
Includes all dev dependencies for hot reload with `ts-node-dev`.

### Production
Optimized for production - only includes production dependencies and compiled code.

## Environment Variables

- `NODE_ENV` - Set to `development` or `production`
- `PORT` - Server port (default: 3000)

## API Endpoints

### Health Check
```bash
curl http://localhost:3000/health
```

### Get Users
```bash
curl http://localhost:3000/api/users
```

### Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'
```

## Troubleshooting

### Docker build fails with npm errors
- Clear node_modules: `rm -rf node_modules package-lock.json`
- Rebuild: `docker build --no-cache -t api:dev --target development .`

### Port already in use
- Change the port in docker-compose.yml or use: `docker run -p 3002:3000 api:dev`

### Hot reload not working
- Ensure the volume mount is correct in docker-compose.yml
- Check that file system events are enabled on your host machine
