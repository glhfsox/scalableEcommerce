# Scalable eCommerce Platform

A full-stack eCommerce platform built with a microservices architecture.

## Architecture

- **Frontend**: React with Redux Toolkit
- **Backend**: Node.js microservices
- **Database**: MongoDB
- **API Gateway**: Express.js

## Services

- **API Gateway**: Entry point for all client requests
- **User Service**: Authentication and user management
- **Product Service**: Product catalog and management
- **Cart Service**: Shopping cart management
- **Order Service**: Order processing
- **Payment Service**: Payment processing
- **Notification Service**: Email and SMS notifications

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/glhfsox/scalableEcommerce.git
   cd scalableEcommerce
   ```

2. Install dependencies for each service:
   ```
   # For frontend
   cd frontend
   npm install

   # For API Gateway
   cd ../api-gateway
   npm install

   # For each microservice
   cd ../services/user-service
   npm install
   # Repeat for other services
   ```

3. Set up environment variables:
   Create `.env` files in each service directory with the appropriate values.

4. Start the services:
   ```
   # Start frontend
   cd frontend
   npm start

   # Start API Gateway
   cd ../api-gateway
   npm start

   # Start each microservice
   cd ../services/user-service
   npm start
   # Repeat for other services
   ```

## Deployment

### Frontend
The frontend is deployed on Vercel.

### Backend
The backend services are deployed on Render.

## License

MIT 