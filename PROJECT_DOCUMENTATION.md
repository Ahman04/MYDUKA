# MyDuka – Inventory & Reporting System
## Project Documentation

### 1. Project Overview
MyDuka is a web-based inventory management system designed to help merchants and store admins efficiently track stock, manage procurement payments, and generate insightful reports. The system supports role-based access control and provides real-time data visualization for informed decision-making.

### 2. Problem Statement
Many small and medium-sized businesses still rely on manual record keeping, which is:
- Time-consuming
- Error-prone
- Lacks real-time reporting

This leads to poor decision-making, stock losses, and delayed procurement processes.

### 3. Solution
MyDuka provides:
- Centralized inventory tracking
- Role-based dashboards
- Automated reports (weekly, monthly, yearly)
- Payment tracking for suppliers
- Visual analytics using charts and graphs

### 4. User Roles & Permissions
#### Merchant (Superuser)
- Initialize admin registration via tokenized email links
- Activate, deactivate, or delete admin accounts
- View:
  - Store-by-store performance reports
  - Paid vs unpaid products per store
  - Individual product performance
  - Visualized reports using graphs

#### Store Admin
- Register and manage data entry clerks
- Approve or decline supply requests
- Update payment status (paid / unpaid)
- View:
  - Clerk performance reports
  - Paid vs unpaid supplier products
- Deactivate or delete clerks

#### Data Entry Clerk
- Record:
  - Items received
  - Items in stock
  - Spoilt items (expired, broken, etc.)
  - Buying & selling price
  - Payment status
- Request additional stock supply from admin

### 5. Core Features
- JWT Authentication
- Role-based access control
- Token-based email registration
- Inventory CRUD operations
- Supply request workflow
- Payment tracking
- Graphical reports (bar & line charts)
- Pagination on all listing endpoints
- CI/CD with GitHub Actions
- Automated testing (frontend & backend)

## Recommended Technology Stack (Chosen for You)
### Backend (API)
| Purpose | Technology |
| --- | --- |
| Framework | FastAPI |
| Language | Python |
| Authentication | JWT (Access & Refresh Tokens) |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Migrations | Alembic |
| Email Service | SMTP / SendGrid |
| Testing | Pytest |
| API Docs | Swagger (built-in) |

**Why FastAPI?**
- Faster than Flask
- Automatic API documentation
- Async support
- Production-ready

### Frontend
| Purpose | Technology |
| --- | --- |
| Framework | React (Vite) |
| State Management | Redux Toolkit |
| Routing | React Router |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Forms | React Hook Form |
| Auth Handling | JWT + Axios Interceptors |
| Testing | Jest + React Testing Library |

**Why Redux Toolkit?**
- Cleaner than Context for large apps
- Better debugging
- Scales well with complex dashboards

### DevOps & Workflow
- Gitflow workflow
- GitHub Actions for CI/CD
- Automated:
  - Tests
  - Linting
  - Build checks
- Deployment:
  - Frontend → Vercel
  - Backend → Render / Railway

## Project Repository Structure (Single Repo – Required)
```
myduka/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── dependencies.py
│   │   │
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── store.py
│   │   │   ├── product.py
│   │   │   ├── inventory.py
│   │   │   └── supply_request.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   ├── inventory.py
│   │   │   └── reports.py
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── products.py
│   │   │   ├── inventory.py
│   │   │   ├── reports.py
│   │   │   └── supply_requests.py
│   │   │
│   │   ├── services/
│   │   │   ├── email_service.py
│   │   │   └── report_service.py
│   │   │
│   │   ├── tests/
│   │   │   ├── test_auth.py
│   │   │   ├── test_inventory.py
│   │   │   └── test_reports.py
│   │
│   ├── alembic/
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── store.js
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── inventory/
│   │   │   ├── reports/
│   │   │   └── users/
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── AdminPanel.jsx
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Charts.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── tests/
│   │   │   └── auth.test.js
│   │   │
│   │   └── main.jsx
│   │
│   ├── tailwind.config.js
│   ├── package.json
│   └── README.md
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── README.md
└── PROJECT_TRACKER.md
```

## Testing Strategy
### Backend
- Unit tests for auth, inventory, reports
- Pagination tests on listing endpoints

### Frontend
- Component rendering tests
- Auth flow tests
- Dashboard data rendering tests

## Reporting & Visualization
- Line graphs → stock movement over time
- Bar graphs → product performance
- Filters:
  - Store
  - Product
  - Date range
- Pie charts (optional)

# MyDuka Project – File & Folder Explanation

## Root Level
- **myduka/** – Main project folder containing both frontend and backend.
- **README.md** – Overall project overview, setup instructions, and features.
- **PROJECT_TRACKER.md** – Tracks tasks, progress, and team responsibilities.

## Backend (backend/)
- **backend/** – Backend API built using FastAPI.

### Backend Core
- **main.py** – Entry point of the backend application; starts the FastAPI server.
- **core/config.py** – Stores environment variables and application settings.
- **core/security.py** – Handles JWT authentication and password hashing.
- **core/dependencies.py** – Shared dependencies like authentication checks and database sessions.

### Database Models (models/)
- **models/user.py** – Defines user roles (merchant, admin, clerk) and authentication data.
- **models/store.py** – Represents stores owned by a merchant.
- **models/product.py** – Defines product details and pricing.
- **models/inventory.py** – Tracks stock levels, spoilt items, and payments.
- **models/supply_request.py** – Handles product supply requests from clerks.

### Data Schemas (schemas/)
- **schemas/user.py** – Defines request and response formats for user data.
- **schemas/product.py** – Defines product input and output validation.
- **schemas/inventory.py** – Defines inventory-related data structures.
- **schemas/reports.py** – Defines report data formats for analytics.

### API Routes (routes/)
- **routes/auth.py** – Handles login, registration, and token authentication.
- **routes/users.py** – Manages admin and clerk user operations.
- **routes/products.py** – Handles product creation and management.
- **routes/inventory.py** – Manages stock entries and updates.
- **routes/reports.py** – Provides report and analytics endpoints.
- **routes/supply_requests.py** – Handles supply request approvals and rejections.

### Business Logic (services/)
- **services/email_service.py** – Sends email invitations and notifications.
- **services/report_service.py** – Generates report calculations and summaries.

### Tests (tests/)
- **tests/test_auth.py** – Tests authentication and authorization logic.
- **tests/test_inventory.py** – Tests inventory and stock management features.
- **tests/test_reports.py** – Tests report generation and analytics logic.

### Backend Support Files
- **alembic/** – Handles database migrations and schema changes.
- **requirements.txt** – Lists backend dependencies.
- **README.md** – Backend setup and API documentation.

## Frontend (frontend/)
- **frontend/** – Frontend React application for user interaction.

### State Management
- **src/app/store.js** – Configures Redux store for global state management.

### Feature Modules (features/)
- **features/auth/** – Handles authentication state and logic.
- **features/inventory/** – Manages inventory UI and state.
- **features/reports/** – Handles report data and charts.
- **features/users/** – Manages admins and clerks UI.

### Pages (pages/)
- **pages/Login.jsx** – User login screen.
- **pages/Dashboard.jsx** – Main dashboard after login.
- **pages/Reports.jsx** – Displays graphical reports.
- **pages/AdminPanel.jsx** – Admin and merchant management panel.

### Reusable Components (components/)
- **components/Navbar.jsx** – Top navigation bar.
- **components/Sidebar.jsx** – Side menu for dashboard navigation.
- **components/Charts.jsx** – Reusable chart components.

### Frontend Services
- **services/api.js** – Handles API requests and JWT token handling.

### Frontend Tests
- **tests/auth.test.js** – Tests authentication flows in the UI.

### Frontend Entry & Config
- **main.jsx** – Entry point for the React application.
- **tailwind.config.js** – Tailwind CSS configuration.
- **package.json** – Frontend dependencies and scripts.
- **README.md** – Frontend setup and usage guide.

## CI/CD
- **.github/workflows/ci.yml** – GitHub Actions workflow for testing and deployment.
