---
sidebar_position: 6
title: Deployment
---

# Deployment Guide

## Overview

This guide covers deploying the AMT Backend to AWS using ECS (Elastic Container Service) with proper configuration management through SSM Parameter Store.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured
- Docker installed locally
- Node.js and npm installed

## Environment Configuration

### Development
- Local development setup
- Uses `.env` file for configuration
- Direct database connections

### Staging
- Pre-production testing environment
- AWS ECS deployment
- SSM Parameter Store for secrets

### Production
- Live production environment
- AWS ECS with auto-scaling
- Full monitoring and alerting

## AWS Infrastructure

### Required AWS Services

1. **ECS (Elastic Container Service)**
   - Container orchestration
   - Service auto-scaling
   - Load balancing

2. **RDS MySQL**
   - Managed database service
   - Multi-AZ deployment for production
   - Automated backups

3. **ElastiCache Redis**
   - Session management
   - Queue processing with Bull
   - Caching layer

4. **S3 Buckets**
   - File uploads
   - Static assets
   - Backup storage

5. **SSM Parameter Store**
   - Secure configuration management
   - API keys and secrets
   - Environment-specific settings

## Docker Configuration

### Dockerfile

```dockerfile
FROM node:14-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 8080

# Start application
CMD ["npm", "start"]
```

### Building Docker Image

```bash
# Build image
docker build -t amt-backend:latest .

# Tag for ECR
docker tag amt-backend:latest [aws-account].dkr.ecr.[region].amazonaws.com/amt-backend:latest

# Push to ECR
docker push [aws-account].dkr.ecr.[region].amazonaws.com/amt-backend:latest
```

## ECS Task Definition

```json
{
  "family": "amt-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "containerDefinitions": [
    {
      "name": "amt-backend",
      "image": "[aws-account].dkr.ecr.[region].amazonaws.com/amt-backend:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PLATFORM_TARGET_ENVIRONMENT",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DB_HOST",
          "valueFrom": "arn:aws:ssm:[region]:[account]:parameter/amt/prod/DB_HOST"
        },
        {
          "name": "DB_PASSWORD",
          "valueFrom": "arn:aws:ssm:[region]:[account]:parameter/amt/prod/DB_PASSWORD"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/amt-backend",
          "awslogs-region": "[region]",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

## SSM Parameter Configuration

### Setting Parameters

```bash
# Database configuration
aws ssm put-parameter --name "/amt/prod/DB_HOST" --value "database.region.rds.amazonaws.com" --type "String"
aws ssm put-parameter --name "/amt/prod/DB_USER" --value "admin" --type "String"
aws ssm put-parameter --name "/amt/prod/DB_PASSWORD" --value "password" --type "SecureString"

# Redis configuration
aws ssm put-parameter --name "/amt/prod/REDIS_HOST" --value "redis.cache.amazonaws.com" --type "String"
aws ssm put-parameter --name "/amt/prod/REDIS_PORT" --value "6379" --type "String"

# API Keys
aws ssm put-parameter --name "/amt/prod/SGMAIL_APIKEY" --value "SG.xxxxx" --type "SecureString"
aws ssm put-parameter --name "/amt/prod/SENTRY_DSN" --value "https://xxx@sentry.io/xxx" --type "SecureString"
```

### Retrieving Parameters

```bash
# Get all parameters for environment
aws ssm get-parameters-by-path --path "/amt/prod" --recursive --with-decryption
```

## Deployment Process

### 1. Update Task Definition

```bash
# Register new task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### 2. Update ECS Service

```bash
# Update service with new task definition
aws ecs update-service \
  --cluster amt-cluster \
  --service amt-backend-service \
  --task-definition amt-backend:latest \
  --force-new-deployment
```

### 3. Monitor Deployment

```bash
# Check service status
aws ecs describe-services \
  --cluster amt-cluster \
  --services amt-backend-service

# View logs
aws logs tail /ecs/amt-backend --follow
```

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Login to ECR
        run: |
          aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REGISTRY
      
      - name: Build and push Docker image
        run: |
          docker build -t amt-backend .
          docker tag amt-backend:latest $ECR_REGISTRY/amt-backend:latest
          docker push $ECR_REGISTRY/amt-backend:latest
      
      - name: Update ECS service
        run: |
          aws ecs update-service --cluster amt-cluster --service amt-backend-service --force-new-deployment
```

## Health Checks

### Application Health Endpoint

```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: checkDatabaseHealth(),
    redis: checkRedisHealth()
  });
});
```

### ECS Health Check Configuration

```json
"healthCheck": {
  "command": ["CMD-SHELL", "curl -f http://localhost:8080/health || exit 1"],
  "interval": 30,
  "timeout": 5,
  "retries": 3,
  "startPeriod": 60
}
```

## Monitoring

### CloudWatch Metrics

- CPU utilization
- Memory utilization
- Request count
- Error rate
- Response time

### CloudWatch Alarms

```bash
# High CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name amt-backend-cpu-high \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

### Application Monitoring

- **Sentry**: Error tracking and performance monitoring
- **CloudWatch Logs**: Application logs
- **X-Ray**: Distributed tracing (optional)

## Scaling

### Auto-scaling Configuration

```json
{
  "targetTrackingScalingPolicies": [
    {
      "targetValue": 75.0,
      "predefinedMetricType": "ECSServiceAverageCPUUtilization",
      "scaleInCooldown": 300,
      "scaleOutCooldown": 60
    }
  ],
  "minCapacity": 2,
  "maxCapacity": 10
}
```

## Backup and Recovery

### Database Backups

- Automated daily backups
- 7-day retention for staging
- 30-day retention for production
- Point-in-time recovery enabled

### Disaster Recovery

1. **Multi-AZ Deployment**: Database and Redis in multiple availability zones
2. **Regular Snapshots**: EBS volumes and RDS snapshots
3. **Cross-region Backups**: Critical data replicated to another region
4. **Recovery Time Objective (RTO)**: 4 hours
5. **Recovery Point Objective (RPO)**: 1 hour

## Security Best Practices

1. **Use IAM Roles**: Never use access keys in production
2. **Encrypt Secrets**: Use SSM SecureString for sensitive data
3. **Network Security**: Use VPC with private subnets
4. **SSL/TLS**: Enforce HTTPS for all endpoints
5. **Regular Updates**: Keep dependencies and base images updated
6. **Audit Logging**: Enable CloudTrail for API calls
7. **Security Groups**: Restrict access to necessary ports only

## Rollback Procedure

In case of deployment issues:

```bash
# Get previous task definition
aws ecs describe-task-definition --task-definition amt-backend

# Update service to previous version
aws ecs update-service \
  --cluster amt-cluster \
  --service amt-backend-service \
  --task-definition amt-backend:previous-version

# Monitor rollback
aws ecs wait services-stable \
  --cluster amt-cluster \
  --services amt-backend-service
```

## Troubleshooting

### Common Issues

1. **Container fails to start**
   - Check CloudWatch logs
   - Verify environment variables
   - Check database connectivity

2. **High memory usage**
   - Review Node.js heap settings
   - Check for memory leaks
   - Increase task memory allocation

3. **Database connection errors**
   - Verify security group rules
   - Check RDS status
   - Validate credentials in SSM

4. **Redis connection issues**
   - Check ElastiCache status
   - Verify security groups
   - Review connection pool settings