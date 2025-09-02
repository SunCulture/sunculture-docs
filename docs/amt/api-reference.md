---
sidebar_position: 4
title: API Reference
---

# API Reference

## Overview

The AMT Backend API follows RESTful principles and uses JSON for request and response bodies.

## Base URL

```
Development: http://localhost:8080/api
Staging: https://amt-test.sunculture.io/api
Production: https://amt-api.sunculture.io/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <token>
```

## Common Response Format

### Success Response

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  }
}
```

## Core Endpoints

### Authentication

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Google OAuth
```http
GET /auth/google
```

### Accounts

#### List Accounts
```http
GET /accounts?page=1&limit=20&status=active
```

Query Parameters:
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status
- `customerId` (number): Filter by customer

#### Create Account
```http
POST /accounts
Content-Type: application/json

{
  "customerId": 123,
  "productId": 456,
  "payplanId": 789,
  "activationDate": "2024-01-01"
}
```

#### Get Account Details
```http
GET /accounts/:id
```

#### Update Account
```http
PUT /accounts/:id
Content-Type: application/json

{
  "status": "suspended",
  "reason": "Payment default"
}
```

### Customers

#### List Customers
```http
GET /customers?search=john&page=1&limit=20
```

#### Create Customer
```http
POST /customers
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+254712345678",
  "nationalId": "12345678"
}
```

#### Update KYC
```http
PUT /customers/:id/kyc
Content-Type: application/json

{
  "verificationType": "national_id",
  "verificationStatus": "verified",
  "documents": []
}
```

### Payments

#### Create Payment
```http
POST /payments
Content-Type: application/json

{
  "accountId": 123,
  "amount": 5000,
  "paymentMethodId": 1,
  "transactionRef": "MPK123456",
  "paymentDate": "2024-01-01"
}
```

#### Get Payment
```http
GET /payments/:id
```

#### List Account Payments
```http
GET /accounts/:accountId/payments
```

#### Reconcile Payments
```http
POST /payments/reconcile
Content-Type: application/json

{
  "paymentIds": [1, 2, 3],
  "reconciliationDate": "2024-01-01"
}
```

### Products

#### List Products
```http
GET /products?category=solar&active=true
```

#### Get Product Details
```http
GET /products/:id
```

#### Product Configurations
```http
GET /products/:id/configurations
```

### Invoices

#### Generate Invoice
```http
POST /invoices
Content-Type: application/json

{
  "accountId": 123,
  "items": [
    {
      "description": "Solar Panel",
      "quantity": 1,
      "unitPrice": 50000
    }
  ]
}
```

#### Get Invoice
```http
GET /invoices/:id
```

#### Download Invoice PDF
```http
GET /invoices/:id/pdf
```

### Commissions

#### Calculate Commission
```http
POST /commissions/calculate
Content-Type: application/json

{
  "employeeId": 123,
  "period": "2024-01",
  "salesData": []
}
```

#### List Commission Payments
```http
GET /commissions/payments?employeeId=123&period=2024-01
```

### Reports

#### Account Summary
```http
GET /reports/accounts/summary?startDate=2024-01-01&endDate=2024-01-31
```

#### Payment Report
```http
GET /reports/payments?startDate=2024-01-01&endDate=2024-01-31&format=csv
```

## Webhooks

### Payment Notification
```http
POST /webhooks/payments/mpesa
Content-Type: application/json

{
  "TransactionType": "Pay Bill",
  "TransID": "MPK123456",
  "TransTime": "20240101120000",
  "TransAmount": "5000",
  "BusinessShortCode": "123456",
  "BillRefNumber": "ACC001",
  "MSISDN": "254712345678"
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- Authentication endpoints: 5 requests per minute
- General endpoints: 100 requests per minute
- Bulk operations: 10 requests per minute

## Error Codes

| Code | Description |
|------|-------------|
| `AUTH_FAILED` | Authentication failed |
| `UNAUTHORIZED` | Missing or invalid token |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Request validation failed |
| `DUPLICATE_ENTRY` | Resource already exists |
| `INTERNAL_ERROR` | Server error |

## Pagination

List endpoints support pagination:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Filtering and Sorting

Most list endpoints support filtering and sorting:

```http
GET /accounts?status=active&sort=createdAt:desc&filter[amount][gte]=1000
```

## API Versioning

The API uses URL versioning. Current version: v1

Future versions will be accessible at:
```
/api/v2/accounts
```

## OpenAPI/Swagger

Full API documentation is available via Swagger UI:

```
http://localhost:8080/api-docs
```

You can also download the OpenAPI specification:

```
http://localhost:8080/api-docs/openapi.json
```