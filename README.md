# TechDesk - Field Technician Management Platform

Enterprise SaaS platform for managing field technicians, tasks, clients, and service operations.

## 🎯 Overview

**TechDesk** is a comprehensive web application designed for:
- **Maintenance Companies** - Manage technician teams and service requests
- **Telecommunications** - Dispatch and track field operations
- **IT Support** - Assign and monitor technical tasks
- **General Services** - Coordinate service delivery

## 🏗️ Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + Vite + Tailwind | Modern, responsive UI |
| **Backend** | Node.js + Express 5 | Scalable REST API |
| **Database** | PostgreSQL + Prisma ORM | Reliable data persistence |
| **Authentication** | JWT + Refresh Tokens | Secure user sessions |
| **State** | Zustand | Lightweight state management |

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repo>
cd Seminario_01

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Update DATABASE_URL in backend/.env (use local PostgreSQL or Supabase)

# Run migrations
cd backend && npm run prisma:migrate

# Start servers
# Terminal 1: npm run dev (backend)
# Terminal 2: cd frontend && npm run dev

# Access at http://localhost:5173
# Login: admin@techdesk.com / Admin@12345
```

📖 See [SETUP.md](./SETUP.md) for detailed instructions.

## 👥 Roles & Permissions

### Admin
- Manage users (CRUD)
- Create and assign tasks
- Create dynamic forms
- Generate and analyze reports
- View company statistics

### Technician  
- View assigned tasks
- Create tasks, which are assigned automatically to the technician
- Edit, delete, and update the status of assigned tasks
- Submit forms and evidence
- Generate field reports
- Track work history

### Client
- Create service requests
- View request status
- Download generated reports
- Access service history

### Route protection
- All application routes require an authenticated session.
- The `/users` and `/clients` administration modules are restricted to the `ADMIN` role in both the frontend and backend.
- Users without access to a restricted frontend route are redirected to their dashboard.
- Each role has its own dashboard: administrator, technician, or client.

## Recent updates

- Role-based frontend route protection for administration modules.
- Client users are shown the client dashboard instead of the administrator dashboard.
- Login no longer displays or preloads demonstration administrator credentials.
- Technicians can create, edit, delete, and update the status of their assigned tasks.
- Login displays live totals for users, tasks, and clients, refreshed every 15 seconds.

## 📋 Features (Current Phase)

- ✅ User Authentication (JWT)
- ✅ Login/Logout with Token Refresh
- ✅ Role-based Dashboard
- ✅ Dark Mode by Default
- ⏳ User Management (Coming)
- ⏳ Task Management (Coming)
- ⏳ Dynamic Forms (Coming)
- ⏳ Report Generation (Coming)

## 📁 Project Structure

```
├── backend/              Node.js API Server
│   ├── src/
│   │   ├── config/       Configuration files
│   │   ├── middleware/   Auth, validation, error handling
│   │   ├── routes/       API routes
│   │   ├── controllers/  Request handlers
│   │   ├── services/     Business logic
│   │   └── utils/        Helpers (JWT, password hashing)
│   ├── prisma/           Database schema & migrations
│   └── .env              Environment variables
│
├── frontend/             React SPA
│   ├── src/
│   │   ├── pages/        Full pages
│   │   ├── components/   Reusable components
│   │   ├── store/        Zustand state stores
│   │   ├── services/     API client services
│   │   ├── hooks/        Custom React hooks
│   │   ├── utils/        Utilities & constants
│   │   └── styles/       Global CSS
│   └── .env              Environment variables
│
└── SETUP.md              Installation guide
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/auth/login       Login with email & password
POST   /api/v1/auth/refresh     Refresh expired token
POST   /api/v1/auth/logout      Logout user
GET    /api/v1/auth/me          Get current user profile
```

### Upcoming (Phases 2-4)
- `/api/v1/users/*` - User management
- `/api/v1/tasks/*` - Task CRUD & assignment
- `/api/v1/forms/*` - Dynamic form builder
- `/api/v1/reports/*` - Report generation
- `/api/v1/clients/*` - Client management
- `/api/v1/dashboard/*` - Analytics & KPIs

## 🛠️ Tech Stack Details

### Backend
- **Framework**: Express.js 5 (latest)
- **ORM**: Prisma (type-safe queries)
- **Authentication**: JWT with refresh token rotation
- **Validation**: express-validator & zod
- **Security**: Helmet, CORS, bcrypt password hashing

### Frontend
- **Library**: React 19 with hooks
- **Build Tool**: Vite (fast dev server, optimized builds)
- **Styling**: Tailwind CSS + custom dark mode
- **Routing**: React Router v6
- **State**: Zustand + persist middleware
- **HTTP**: Axios with JWT interceptors
- **Icons**: Lucide React

### Database
- **Engine**: PostgreSQL 15+ (ACID compliant)
- **Type Safety**: Prisma generates TypeScript types
- **Migrations**: Automatic with version control
- **Features**: JSONB for flexible schemas, UUID primary keys

## 📊 Development Phases

### Phase 1: Foundations ✅ (Current)
- Project structure & tooling
- JWT authentication  
- Login page & dashboard
- Role-based rendering

### Phase 2: Core Operations (Next)
- CRUD for tasks, clients, users
- Dynamic form builder
- Task assignment & status tracking
- Search & filtering

### Phase 3: Analytics & Reports
- PDF report generation
- Photo evidence upload
- Dashboard with KPIs
- Activity logging

### Phase 4: Production Ready
- Unit & E2E tests
- Performance optimizations
- Mobile-responsive polish
- Production deployment (Vercel + Railway)

## 🔐 Security Features

- ✅ JWT tokens (15m expiry) with refresh tokens (7d)
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ CORS validation
- ✅ Input validation & sanitization
- ✅ Helmet.js security headers
- ✅ Environment variable isolation
- ⏳ Rate limiting (coming)
- ⏳ Audit logs (coming)

## 📈 Scalability Considerations

- Multi-tenant architecture (company isolation)
- Database indexing on frequently queried fields
- Paginated API responses (max 100 items/page)
- Zustand with localStorage for client state
- Code splitting with Vite & React.lazy
- Service worker support (PWA ready)

## 🚀 Deployment

### Frontend (Vercel)
```bash
vercel deploy --prod
```

### Backend (Railway.app)
```bash
# Connect GitHub repo, Railway auto-deploys on push
```

### Database (Supabase)
- Managed PostgreSQL with automatic backups
- Built-in authentication (future phases)
- Real-time subscriptions support

## 📝 Environment Variables

See `.env.example` files in backend/ and frontend/ directories.

**Backend essentials:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Signing key (min 32 chars)
- `CORS_ORIGIN` - Frontend URL

**Frontend essentials:**
- `VITE_API_URL` - Backend API endpoint

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't connect to database | Check DATABASE_URL and PostgreSQL is running |
| CORS errors | Ensure CORS_ORIGIN includes your frontend URL |
| Token expired | Frontend auto-refreshes, check refresh token |
| Port already in use | Kill process or change PORT in .env |

## 📚 Documentation

- [Setup Guide](./SETUP.md) - Installation & configuration
- [API Documentation](./backend/README.md) - Endpoint details
- [Frontend Guide](./frontend/README.md) - Component structure

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/task-management`
2. Follow existing code structure from Phase 1
3. Test locally before committing
4. Submit PR with clear description

## 📄 License

MIT - See LICENSE file

## 👨‍💼 Project Lead

Designed and architected as an enterprise SaaS solution for field service management.

---

**Status**: Alpha (Phase 1 Complete) | **Next**: Phase 2 - Core Operations
