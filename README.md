MYDUKA

A Digital Inventory & Sales Management Platform for Small and Medium Enterprises

Executive Summary

MYDUKA is a web-based e-commerce and inventory management platform designed for small to medium-sized businesses (SMEs). The system digitizes inventory operations, enables controlled access through role-based permissions, and provides real-time business insights using automated reports and visual analytics. By replacing manual record keeping with a centralized digital solution, MYDUKA improves accuracy, accountability, and decision-making while reducing operational inefficiencies.

Project Overview

Many small and medium-sized businesses still rely on manual methods such as notebooks, spreadsheets, or verbal reporting to manage inventory and sales. These approaches are inefficient, error-prone, and do not support real-time visibility into business performance.

MYDUKA provides a digital alternative that streamlines inventory workflows, tracks supplier payments, enforces accountability through role-based access control, and generates actionable business insights through real-time reports and visual analytics. The system is designed to be scalable, secure, and easy to use across multiple stores.

Problem Statement

Manual inventory and sales record keeping presents several challenges:

Time-consuming data entry and reconciliation

High likelihood of human errors

Lack of real-time reporting and analytics

These challenges often lead to:

Poor and delayed business decisions

Stock losses due to inaccurate records

Delayed procurement and supplier payments

Reduced accountability among staff

Proposed Solution

MYDUKA addresses these challenges by providing a centralized, automated platform that offers:

Digital inventory management across multiple stores

Role-based dashboards for controlled access and accountability

Automated reports (weekly, monthly, yearly)

Supplier payment tracking and status monitoring

Visual analytics using charts and graphs for quick insights

Project Objectives

The primary objectives of MYDUKA are to:

Digitize inventory and sales management for SMEs

Reduce inventory errors and stock losses

Improve accountability through role-based access control

Provide real-time business performance insights

Support informed decision-making using automated reports and analytics

User Roles & Permissions
1. Merchant (Superuser)

Responsibilities:

Initialize admin registration via tokenized email links

Activate, deactivate, or delete store admin accounts

Access & Views:

Store-by-store performance reports

Paid vs unpaid products per store

Individual product performance analytics

Graphical dashboards showing overall business performance

2. Store Admin

Responsibilities:

Register and manage data entry clerks

Approve or decline stock supply requests

Update supplier payment status

Access & Views:

Clerk performance reports

Paid vs unpaid supplier products

Ability to deactivate or delete clerks

3. Data Entry Clerk

Responsibilities:

Record received items

Update items in stock

Record spoilt or expired items

Enter buying and selling prices

Update payment status

Request additional stock from the store admin

Core Features

JWT-based authentication (Access & Refresh tokens)

Role-Based Access Control (RBAC)

Token-based email registration

Inventory CRUD operations

Supply request and approval workflow

Supplier payment tracking

Automated reports (weekly, monthly, yearly)

Visual analytics (bar, line, optional pie charts)

Pagination on all listing endpoints

CI/CD pipeline using GitHub Actions

Automated frontend and backend testing

Non-Functional Requirements

Security: JWT authentication, encrypted passwords, RBAC enforcement

Performance: Fast API response times and optimized database queries

Scalability: Support for multiple stores and growing data volumes

Availability: Reliable deployment with minimal downtime

Maintainability: Clean architecture, automated testing, and CI/CD pipelines

System Architecture Overview

Frontend: React application communicates with the backend via REST APIs

Backend: FastAPI handles authentication, business logic, and reporting

Database: PostgreSQL stores inventory, user, and transaction data

Authentication Flow: JWT access tokens with refresh token rotation

Reporting: Aggregated queries generate reports and analytics in real time

Technology Stack
Backend (API)
Purpose	Technology
Framework	FastAPI
Language	Python
Authentication	JWT
Database	PostgreSQL
ORM	SQLAlchemy
Migrations	Alembic
Email Service	SMTP / SendGrid
Testing	Pytest
API Documentation	Swagger (Auto-generated)

Why FastAPI?

High performance

Automatic API documentation

Async support

Production-ready architecture

Frontend
Purpose	Technology
Framework	React (Vite)
State Management	Redux Toolkit
Routing	React Router
Styling	Tailwind CSS
Charts	Recharts
Forms	React Hook Form
API Handling	Axios with JWT Interceptors
Testing	Jest & React Testing Library

Why Redux Toolkit?

Cleaner and scalable state management

Excellent debugging tools

Ideal for complex dashboards and analytics

DevOps & Workflow

Gitflow branching strategy

GitHub Actions for CI/CD

Automated Processes:

Code linting

Unit and integration tests

Build and deployment checks

Deployment Targets:

Frontend → Vercel

Backend → Render or Railway

Future Enhancements

Mobile application support

POS system integration

Multi-currency and tax support

Advanced analytics and forecasting

Role-based notifications and alerts

Conclusion

MYDUKA provides a comprehensive, secure, and scalable solution for inventory and sales management tailored to the needs of small and medium-sized businesses. By digitizing manual workflows and delivering real-time insights through analytics and reports, the system empowers business owners to make informed decisions, reduce losses, and improve operational efficiency.