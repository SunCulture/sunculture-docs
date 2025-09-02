---
sidebar_position: 2
title: Architecture
---

# Architecture Overview

The AMT Backend follows a modular, feature-based architecture with clear separation of concerns.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Load Balancer                        │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                      Express Application                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                     Middlewares                      │   │
│  │  (Auth, CORS, Helmet, Compression, Error Handling)  │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  Routing Controllers                 │   │
│  │              (Feature-based Controllers)             │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Business Logic                     │   │
│  │              (Services & Event Handlers)             │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Data Access Layer                 │   │
│  │              (Sequelize Models & Repositories)       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│    MySQL      │      │     Redis     │      │    Kafka      │
└───────────────┘      └───────────────┘      └───────────────┘
```

## Project Structure

```
amt-backend/
├── server/
│   ├── index.ts                 # Application entry point
│   ├── configs/                 # Configuration files
│   ├── databases/              # Database configuration
│   ├── features/               # Feature modules (53 modules)
│   │   ├── accounts/          # Account management
│   │   ├── auth/              # Authentication
│   │   ├── payments/          # Payment processing
│   │   ├── customers/         # Customer management
│   │   ├── invoices/          # Invoice management
│   │   ├── products/          # Product catalog
│   │   └── [other features]/
│   ├── models/                 # Sequelize models (80+ models)
│   ├── migrations/             # Database migrations
│   ├── middlewares/            # Express middlewares
│   ├── services/               # Shared services
│   └── utils/                  # Utility functions
├── public/                     # Static files and uploads
└── dist/                       # Compiled JavaScript
```

## Core Components

### Feature Modules

Each feature module contains:
- **Controllers**: HTTP endpoint handlers
- **Services**: Business logic implementation
- **Models**: Database models
- **DTOs**: Request/response validation
- **Interfaces**: TypeScript type definitions
- **Events**: Feature-specific events

### Background Processing

#### Bull Queue Processor
- Asynchronous job processing
- Redis-backed queue management
- Job retry mechanisms
- Performance monitoring

#### Kafka Integration
- Event streaming
- Inter-service communication
- Payment and customer event handling
- Real-time data synchronization

### Scheduled Jobs (Cron)
- NetSuite payment synchronization
- SMS notifications (Kenya, Uganda, CIV)
- Sales order status refresh
- Beyonic payment processing

## Design Patterns

### Repository Pattern
All database operations go through repository classes that encapsulate data access logic.

### Service Layer Pattern
Business logic is separated from controllers and placed in service classes.

### Event-Driven Architecture
Loosely coupled components communicate through events using EventEmitter and Kafka.

### Dependency Injection
Using TypeScript decorators for dependency management in controllers and services.

## Security Architecture

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Google OAuth integration
- API key authentication for external services

### Data Protection
- Input validation and sanitization
- SQL injection prevention via Sequelize ORM
- XSS protection with Helmet.js
- Rate limiting with express-rate-limit

## Performance Optimization

### Database Optimization
- Connection pooling (min: 5, max: 100)
- Indexed columns for frequent queries
- Lazy loading for associations
- Query optimization with Sequelize

### Caching Strategy
- Redis for session management
- Cache frequently accessed data
- Bull queue for background processing
- Kafka for event streaming

### Application Performance
- Compression middleware
- Async/await for non-blocking operations
- PM2 for process management
- Horizontal scaling with ECS