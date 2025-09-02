---
sidebar_position: 1
title: Introduction
---

# AMT Backend Documentation

## Overview

AMT (Account Management Tool) Backend is a comprehensive TypeScript-based API server designed for managing customer accounts, payments, installations, and related business operations for SunCulture. The system handles various aspects of customer lifecycle management including KYC, payments processing, commissions, inventory management, and integration with multiple external services.

## Key Features

- **Customer Account Management**: Complete lifecycle management from registration to account closure
- **Payment Processing**: Multi-gateway payment processing with reconciliation
- **Product Catalog**: Comprehensive product and inventory management
- **Installation Tracking**: Schedule and monitor product installations
- **Commission System**: Automated commission calculation and disbursement
- **Financial Integration**: Seamless integration with NetSuite, Salesforce, and Xero

## Quick Links

- [Architecture Overview](./architecture)
- [Getting Started](./getting-started)
- [API Reference](./api-reference)
- [Database Schema](./database)
- [Deployment Guide](./deployment)

## Technology Stack

- **Runtime**: Node.js (>=14.0.0)
- **Language**: TypeScript 5.0.4
- **Framework**: Express.js with routing-controllers
- **Database**: MySQL with Sequelize ORM
- **Caching**: Redis
- **Message Queue**: Bull and Kafka
- **Process Manager**: PM2

## Support

For questions and support, please contact the development team or refer to the internal documentation portal.