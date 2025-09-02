---
sidebar_position: 5
title: Database Schema
---

# Database Schema

## Overview

The AMT Backend uses MySQL with Sequelize ORM. The database contains 80+ tables organized into logical domains.

## Core Tables

### Customers Table
```sql
customers {
  id: INTEGER PRIMARY KEY
  firstName: VARCHAR(255)
  lastName: VARCHAR(255)
  email: VARCHAR(255) UNIQUE
  phone: VARCHAR(50)
  nationalId: VARCHAR(50)
  dateOfBirth: DATE
  gender: ENUM('male', 'female', 'other')
  kycStatus: ENUM('pending', 'verified', 'rejected')
  createdAt: DATETIME
  updatedAt: DATETIME
}
```

### Accounts Table
```sql
accounts {
  id: INTEGER PRIMARY KEY
  customerId: INTEGER FOREIGN KEY
  accountNumber: VARCHAR(50) UNIQUE
  productId: INTEGER FOREIGN KEY
  payplanId: INTEGER FOREIGN KEY
  status: ENUM('pending', 'active', 'suspended', 'closed')
  activationDate: DATE
  expiryDate: DATE
  balance: DECIMAL(10,2)
  createdAt: DATETIME
  updatedAt: DATETIME
}
```

### Payments Table
```sql
payments {
  id: INTEGER PRIMARY KEY
  accountId: INTEGER FOREIGN KEY
  amount: DECIMAL(10,2)
  paymentTypeId: INTEGER FOREIGN KEY
  transactionRef: VARCHAR(100)
  paymentDate: DATETIME
  status: ENUM('pending', 'completed', 'failed', 'reversed')
  paymentMethod: VARCHAR(50)
  createdBy: INTEGER
  createdAt: DATETIME
  updatedAt: DATETIME
}
```

### Products Table
```sql
products {
  id: INTEGER PRIMARY KEY
  name: VARCHAR(255)
  code: VARCHAR(50) UNIQUE
  description: TEXT
  category: VARCHAR(100)
  price: DECIMAL(10,2)
  isActive: BOOLEAN
  productTypeId: INTEGER FOREIGN KEY
  warrantyPeriod: INTEGER
  createdAt: DATETIME
  updatedAt: DATETIME
}
```

### Payplans Table
```sql
payplans {
  id: INTEGER PRIMARY KEY
  name: VARCHAR(255)
  code: VARCHAR(50)
  description: TEXT
  duration: INTEGER
  interestRate: DECIMAL(5,2)
  downPayment: DECIMAL(10,2)
  installmentAmount: DECIMAL(10,2)
  isActive: BOOLEAN
  createdAt: DATETIME
  updatedAt: DATETIME
}
```

## Relationship Tables

### Account Devices
```sql
accountDevices {
  id: INTEGER PRIMARY KEY
  accountId: INTEGER FOREIGN KEY
  deviceSerial: VARCHAR(100)
  deviceType: VARCHAR(50)
  status: ENUM('active', 'inactive', 'faulty')
  installationDate: DATE
  warrantyExpiry: DATE
}
```

### Installment Schedules
```sql
installmentSchedules {
  id: INTEGER PRIMARY KEY
  accountId: INTEGER FOREIGN KEY
  dueDate: DATE
  amount: DECIMAL(10,2)
  status: ENUM('pending', 'paid', 'overdue')
  paidAmount: DECIMAL(10,2)
  paidDate: DATE
}
```

### Commission Payments
```sql
commissionPayments {
  id: INTEGER PRIMARY KEY
  employeeId: INTEGER FOREIGN KEY
  amount: DECIMAL(10,2)
  period: VARCHAR(7)
  status: ENUM('pending', 'approved', 'paid')
  approvedBy: INTEGER
  paidDate: DATE
}
```

## Supporting Tables

### Employees
```sql
employees {
  id: INTEGER PRIMARY KEY
  employeeCode: VARCHAR(50) UNIQUE
  firstName: VARCHAR(255)
  lastName: VARCHAR(255)
  email: VARCHAR(255)
  phone: VARCHAR(50)
  departmentId: INTEGER FOREIGN KEY
  roleId: INTEGER FOREIGN KEY
  supervisorId: INTEGER FOREIGN KEY
  isActive: BOOLEAN
}
```

### Departments
```sql
departments {
  id: INTEGER PRIMARY KEY
  name: VARCHAR(255)
  code: VARCHAR(50)
  description: TEXT
  managerId: INTEGER
}
```

### Roles
```sql
roles {
  id: INTEGER PRIMARY KEY
  name: VARCHAR(255)
  description: TEXT
  permissions: JSON
}
```

## Audit Tables

### System Logs
```sql
systemLogs {
  id: INTEGER PRIMARY KEY
  userId: INTEGER
  action: VARCHAR(255)
  entity: VARCHAR(100)
  entityId: INTEGER
  oldValues: JSON
  newValues: JSON
  ipAddress: VARCHAR(45)
  userAgent: TEXT
  createdAt: DATETIME
}
```

### Account Status Histories
```sql
accountStatusHistories {
  id: INTEGER PRIMARY KEY
  accountId: INTEGER FOREIGN KEY
  previousStatus: VARCHAR(50)
  newStatus: VARCHAR(50)
  reason: TEXT
  changedBy: INTEGER
  changedAt: DATETIME
}
```

## Financial Tables

### Invoices
```sql
AccountInvoices {
  id: INTEGER PRIMARY KEY
  accountId: INTEGER FOREIGN KEY
  invoiceNumber: VARCHAR(50) UNIQUE
  amount: DECIMAL(10,2)
  tax: DECIMAL(10,2)
  totalAmount: DECIMAL(10,2)
  dueDate: DATE
  status: ENUM('draft', 'sent', 'paid', 'overdue')
  createdAt: DATETIME
}
```

### Refunds
```sql
refunds {
  id: INTEGER PRIMARY KEY
  paymentId: INTEGER FOREIGN KEY
  amount: DECIMAL(10,2)
  reason: TEXT
  status: ENUM('pending', 'approved', 'completed', 'rejected')
  approvedBy: INTEGER
  refundDate: DATE
}
```

### Write-offs
```sql
writeoffs {
  id: INTEGER PRIMARY KEY
  accountId: INTEGER FOREIGN KEY
  amount: DECIMAL(10,2)
  reason: TEXT
  approvedBy: INTEGER
  writeoffDate: DATE
}
```

## Integration Tables

### Netsuite Sync
```sql
netsuiteSync {
  id: INTEGER PRIMARY KEY
  entityType: VARCHAR(50)
  entityId: INTEGER
  netsuiteId: VARCHAR(100)
  lastSyncDate: DATETIME
  syncStatus: ENUM('pending', 'success', 'failed')
  errorMessage: TEXT
}
```

### Salesforce Mapping
```sql
salesforceMapping {
  id: INTEGER PRIMARY KEY
  localEntity: VARCHAR(50)
  localId: INTEGER
  salesforceId: VARCHAR(100)
  salesforceObject: VARCHAR(50)
  lastSync: DATETIME
}
```

## Location Tables

### Countries
```sql
countries {
  id: INTEGER PRIMARY KEY
  name: VARCHAR(255)
  code: VARCHAR(3)
  currency: VARCHAR(3)
  phoneCode: VARCHAR(10)
  isActive: BOOLEAN
}
```

### Company Regions
```sql
companyRegions {
  id: INTEGER PRIMARY KEY
  name: VARCHAR(255)
  countryId: INTEGER FOREIGN KEY
  code: VARCHAR(50)
  managerId: INTEGER
}
```

### Warehouses
```sql
warehouses {
  id: INTEGER PRIMARY KEY
  name: VARCHAR(255)
  code: VARCHAR(50)
  regionId: INTEGER FOREIGN KEY
  address: TEXT
  capacity: INTEGER
  isActive: BOOLEAN
}
```

## Database Relationships

### One-to-Many
- Customer → Accounts
- Account → Payments
- Account → Installment Schedules
- Employee → Commissions
- Department → Employees

### Many-to-Many
- Products ↔ Payplans (through ProductPayplanPricing)
- Employees ↔ Regions (through EmployeeRegions)
- Roles ↔ Permissions (through RolePermissions)

### Self-Referencing
- Employees → Supervisors (employees.supervisorId → employees.id)
- Referrals → Referrers (customers.referredBy → customers.id)

## Indexes

Key indexes for performance:

```sql
-- Frequently queried columns
CREATE INDEX idx_accounts_customer ON accounts(customerId);
CREATE INDEX idx_payments_account ON payments(accountId);
CREATE INDEX idx_payments_date ON payments(paymentDate);
CREATE INDEX idx_accounts_status ON accounts(status);

-- Search optimization
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_national_id ON customers(nationalId);

-- Reporting indexes
CREATE INDEX idx_payments_created ON payments(createdAt);
CREATE INDEX idx_accounts_activation ON accounts(activationDate);
```

## Migrations

Database changes are managed through Sequelize migrations:

```bash
# Create a new migration
npx sequelize-cli migration:generate --name add-column-to-table

# Run pending migrations
npx sequelize-cli db:migrate

# Rollback last migration
npx sequelize-cli db:migrate:undo

# Check migration status
npx sequelize-cli db:migrate:status
```

## Best Practices

1. **Always use migrations** for schema changes
2. **Add indexes** for frequently queried columns
3. **Use transactions** for multi-table operations
4. **Implement soft deletes** where appropriate
5. **Maintain audit trails** for sensitive data
6. **Regular backups** and point-in-time recovery
7. **Monitor slow queries** and optimize as needed