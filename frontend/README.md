  MyDuka – Inventory & Reporting System

MyDuka is a web-based inventory management and reporting system designed to help merchants and store administrators efficiently manage stock, track procurement payments, and generate actionable business insights through real-time reports and visual analytics.

The system is built for small to medium-sized businesses seeking a reliable, digital alternative to manual record keeping.

PROJECT OVERVIEW

Manual inventory management is still widely used by many businesses, leading to inefficiencies and costly errors. MyDuka digitizes inventory workflows, enforces accountability through role-based access, and provides clear insights to support informed decision-making.

 PROBLEM STATEMENT

Many businesses rely on manual record keeping, which is:

Time-consuming

Error-prone

Lacking real-time reporting

These challenges often result in:

Poor business decisions

Stock losses

Delayed procurement and payments

SOLUTION

MyDuka addresses these challenges by offering:

Centralized inventory management

Role-based dashboards

Automated reports (weekly, monthly, yearly)

Supplier payment tracking

Visual analytics using charts and graphs

 User Roles & Permissions
 Merchant (Superuser)

Initialize admin registration via tokenized email links

Activate, deactivate, or delete admin accounts

View:

Store-by-store performance reports

Paid vs unpaid products per store

Individual product performance

Graphical analytics dashboards

 Store Admin

Register and manage data entry clerks

Approve or decline supply requests

Update supplier payment status

View:

Clerk performance reports

Paid vs unpaid supplier products

Deactivate or delete clerks

  Data Entry Clerk

Record:

Items received

Items in stock

Spoilt items (expired or damaged)

Buying and selling prices

Payment status

Request additional stock supply from store admin

 Core Features

JWT authentication (Access & Refresh tokens)

Role-based access control (RBAC)

Token-based email registration

Inventory CRUD operations

Supply request workflow

Supplier payment tracking

Graphical reports (bar, line, and optional pie charts)

Pagination on all listing endpoints

CI/CD pipeline with GitHub Actions

Automated frontend and backend testing

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
API Docs	Swagger (Auto-generated)

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

Suitable for complex dashboards

DevOps & Workflow

Gitflow branching strategy

GitHub Actions for CI/CD

Automated:

Tests

Linting

Build checks

Deployment:

Frontend → Vercel

front end vercel
gi

<!-- Backend → Render / Railway -->