# Product Price Aggregator

A NestJS application that aggregates product pricing data from multiple providers in real-time, providing a unified API for accessing and monitoring price changes.

## Project Overview

This service aggregates pricing and availability data for digital products (e.g., e-books, software licenses, digital courses) from multiple simulated third-party providers. It features:

- Real-time data aggregation from multiple providers
- Price history tracking
- REST API with filtering and pagination
- Real-time updates via Server-Sent Events (SSE)
- API key authentication
- Swagger API documentation

## Tech Stack

- NestJS (TypeScript)
- PostgreSQL with Prisma ORM
- Docker for containerization
- Jest for testing

## Setup Instructions

### Prerequisites

- Node.js >= 14
- Docker and Docker Compose
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MohammaedAlani/product-aggregator.git
cd product-aggregator
```

2. Environment Setup:
```bash
cp .env.example .env
```

Update `.env` with your configurations:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/product_aggregator?schema=public"
API_KEY="your-secret-key"
AGGREGATOR_INTERVAL_MS=5000
STALE_THRESHOLD_MS=300000
```

### Development Setup

1. Start the development environment:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

This will:
- Start the application in development mode
- Enable hot-reload
- Mount local files for real-time changes
- Start PostgreSQL database
- Generate Prisma client

### Production Setup

1. Build and start production services:
```bash
docker-compose up --build -d
```

This will:
- Build optimized production image
- Start the application in production mode
- Start PostgreSQL database
- Configure for production environment

## API Documentation

Access Swagger documentation at: `http://localhost:3000/api`

### Key Endpoints

- `GET /products` - List all products with filtering
  - Query Parameters:
    - name: Filter by product name
    - minPrice: Minimum price filter
    - maxPrice: Maximum price filter
    - availability: Filter by availability
    - provider: Filter by provider
    - page: Page number
    - limit: Items per page

- `GET /products/:id` - Get product details with price history

- `GET /products/changes` - Get recent price changes
  - Query Parameters:
    - timeframe: Time window in milliseconds

### Authentication

Include API key in request headers:
```bash
curl -H "X-API-Key: your-api-key" http://localhost:3000/products
```

## Real-time Updates

Access the real-time price updates visualization at:
`http://localhost:3000/index.html`

## Testing

```bash
# Run in development container
docker-compose -f docker-compose.dev.yml exec api npm run test

# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Development

### Making Changes

1. Code changes in your local environment will automatically reflect in the container
2. The application will automatically restart when files change
3. Database changes require running migrations:
```bash
# Run in development container
docker-compose -f docker-compose.dev.yml exec api npx prisma migrate dev
```

### Debugging

1. Logs can be viewed with:
```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Just API
docker-compose -f docker-compose.dev.yml logs -f api
```

2. Access database:
```bash
docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -d product_aggregator
```

## Docker Commands

### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# Restart specific service
docker-compose -f docker-compose.dev.yml restart api

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Production
```bash
# Start production environment
docker-compose up -d --build

# Stop production environment
docker-compose down

# View logs
docker-compose logs -f
```

## Design Decisions and Trade-offs

### Architecture Decisions

1. Data Aggregation Strategy
   - Polling vs Webhooks: Chose polling for simplicity and reliability
   - Configurable intervals for different needs
   - Concurrent provider fetching for performance

2. Data Storage
   - PostgreSQL for reliable ACID compliance
   - Price history tracking using separate table
   - Optimized indexes for query performance

3. Real-time Updates
   - SSE over WebSockets for simplicity and uni-directional nature
   - No need for bi-directional communication

### Development Decisions

1. Docker Setup
   - Separate development and production configurations
   - Volume mounting for development
   - Hot reload enabled for faster development
   - Preserved node_modules in container

2. Testing Strategy
   - Unit tests for core logic
   - Integration tests for API endpoints
   - End-to-end tests for critical flows

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[MIT](LICENSE)