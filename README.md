# PackMoveGO API Backend

A comprehensive backend API for PackMoveGO moving services, built with Node.js, TypeScript, and Express.

## 🚀 Latest Deployment Update

**Commit**: `8bd38c0` - Fixed TypeScript compilation errors for Render deployment

## Features

- **Real-time Communication**: Socket.IO integration for live updates
- **User Tracking**: Comprehensive user session and interaction tracking
- **Authentication**: JWT-based authentication with OAuth support
- **Load Balancing**: Advanced load balancing and scaling capabilities
- **Security**: Rate limiting, CORS, and security middleware
- **Database**: MongoDB with Mongoose ODM
- **Payment Processing**: Stripe integration
- **Email Services**: Nodemailer integration
- **SSH Access**: Secure SSH server for remote management

## Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp config/.env.example config/.env
```

## API Endpoints

- `/api/health` - Health check
- `/api/auth/*` - Authentication endpoints
- `/api/v0/*` - Content API endpoints
- `/api/services/*` - Service management
- `/api/bookings/*` - Booking management
- `/api/payments/*` - Payment processing

## Deployment

The API is configured for deployment on Render with automatic builds and deployments.

## License

MIT License
