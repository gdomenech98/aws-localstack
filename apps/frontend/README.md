# Frontend Application

A Next.js frontend application that displays API health status and is configured to work with the backend API service.

## Features

- **Next.js 14** - React framework with server and client components
- **TypeScript** - Fully typed application
- **Hot Reload** - Development mode with instant updates
- **Environment Configuration** - Easy API URL and port configuration
- **API Integration** - Fetches and displays health status from API
- **Responsive Design** - Mobile-friendly UI
- **Multi-stage Docker** - Optimized images for dev and production

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout component
│   │   ├── page.tsx             # Home page component
│   │   ├── page.module.css      # Page styles
│   │   └── globals.css          # Global styles
│   └── lib/
│       └── api.ts               # API client utility
├── public/                       # Static files
├── dockerfile                    # Multi-stage Dockerfile
├── docker-compose.yml           # Docker Compose configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── next.config.js              # Next.js configuration
├── .env.local                  # Environment variables
└── README.md                   # This file
```

## Environment Variables

Configure these environment variables in `.env.local` or via Docker:

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000` | The backend API server URL |
| `NEXT_PUBLIC_FRONTEND_PORT` | `3001` | The frontend application port |

## Quick Start

### Prerequisites

- Node.js 20+ (or Docker)

### Local Development

Using Node.js directly:

```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:3001`

### Development with Docker

```bash
docker-compose up frontend-dev
```

### Production Build

Using Node.js:

```bash
npm install
npm run build
npm start
```

Using Docker:

```bash
docker build -t frontend:prod --target production .
docker run -p 3001:3001 -e NEXT_PUBLIC_API_URL=http://api:3000 frontend:prod
```

## NPM Scripts

- `npm run dev` - Start development server with hot reload (port 3001)
- `npm run build` - Build the production-ready Next.js application
- `npm start` - Start the production server (port 3001)
- `npm run lint` - Run ESLint for code quality
- `npm run type-check` - Check TypeScript types without building

## Docker

### Multi-stage Builds

The Dockerfile has three stages:

1. **builder** - Compiles the Next.js application
2. **development** - Includes all dependencies with hot reload
3. **production** - Optimized image with only production dependencies

### Build Development Image

```bash
docker build -t frontend:dev --target development .
```

### Build Production Image

```bash
docker build -t frontend:prod --target production .
```

## API Integration

The application fetches the health status from the backend API every 10 seconds.

### API Endpoint Used

- `GET /health` - Retrieves the API health status

### Example API Response

```json
{
  "status": "healthy",
  "timestamp": "2024-12-15T10:30:45.123Z"
}
```

## Pages

### Home Page (`/`)

Displays:
- API health status with auto-refresh every 10 seconds
- Configuration details (API URL and frontend port)
- Instructions for environment variable setup

## Configuration Examples

### Local Development

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_FRONTEND_PORT=3001
```

### Docker Network

```bash
# Docker Compose environment
NEXT_PUBLIC_API_URL=http://api:3000
NEXT_PUBLIC_FRONTEND_PORT=3001
```

### Production

```bash
# Production environment
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_FRONTEND_PORT=3001
```

## Docker Compose

Run both frontend (dev) and API services:

```bash
docker-compose up
```

Services:
- `frontend-dev` - Frontend in development mode (port 3001)
- `frontend-prod` - Frontend in production mode (port 3002)
- `api-dev` - Backend API in development mode (port 3000)

## Troubleshooting

### Hot reload not working

- Ensure volumes are correctly mounted in docker-compose.yml
- Restart the container: `docker-compose restart frontend-dev`

### API connection error

- Check that API_URL environment variable matches the API server location
- Verify the API service is running and accessible
- Check browser console for CORS or network errors

### Port already in use

- Change the port in docker-compose.yml or use: `docker run -p 3003:3001 frontend:dev`

### Build fails

- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Rebuild without cache: `docker build --no-cache -t frontend:dev --target development .`

## Performance

- **Optimized Bundle** - Code splitting and lazy loading
- **Image Optimization** - Automatic image optimization
- **CSS Optimization** - CSS modules for scoped styling
- **Type Safety** - Full TypeScript support prevents runtime errors

## Security

- **Environment Variables** - Sensitive values stored securely
- **Type Safety** - TypeScript prevents many security issues
- **CORS Handling** - Proper handling of cross-origin requests
- **XSS Protection** - React's built-in XSS protection

## License

MIT
