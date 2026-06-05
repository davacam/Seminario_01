# TechDesk Backend - API Server

Node.js + Express + Prisma REST API for field technician management.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or Supabase)

### Setup

```bash
npm install

# Configure .env (copy from .env.example)
cp .env.example .env

# Update DATABASE_URL with your PostgreSQL connection

# Run migrations
npm run prisma:migrate

# Start development server
npm run dev
```

Server runs on `http://localhost:3000`

## 📁 Project Structure

```
src/
├── config/           Configuration & initialization
│   ├── env.js        Environment variable validation
│   └── database.js   Prisma client setup
│
├── middleware/       Express middleware
│   ├── auth.js       JWT verification
│   ├── authorize.js  Role-based access control
│   └── errorHandler.js Global error handling
│
├── routes/           API route definitions
│   └── auth.js       Authentication endpoints
│
├── controllers/      Request handlers
│   └── authController.js Auth handlers & validation
│
├── services/         Business logic layer
│   └── authService.js Authentication logic
│
├── utils/            Utility functions
│   ├── jwt.js        JWT creation & verification
│   ├── password.js   Password hashing & validation
│   └── validators.js Input validation
│
├── constants/        Constants & enums
│   ├── roles.js      User role definitions
│   └── permissions.js Permission mappings
│
├── app.js            Express app setup
└── server.js         Entry point

prisma/
├── schema.prisma     Database schema & relations
└── migrations/       Migration history
```

## 🔐 Authentication Flow

1. **Login** (`POST /api/v1/auth/login`)
   - Email + password → Verify credentials
   - Generate JWT access token (15m expiry)
   - Generate refresh token (7d, stored in DB)
   - Return both tokens to client

2. **Protected Requests**
   - Client includes: `Authorization: Bearer <access_token>`
   - Middleware verifies JWT signature & expiry
   - Request proceeds with `req.user` populated

3. **Token Refresh** (`POST /api/v1/auth/refresh`)
   - Client sends expired access token + refresh token
   - Server validates refresh token
   - Generate new access token
   - Continue seamlessly (frontend auto-handles)

4. **Logout** (`POST /api/v1/auth/logout`)
   - Client deletes tokens from localStorage
   - Future: Token blacklist in Redis for extra security

## 📡 API Endpoints

### Phase 1 (Current)

#### Authentication
- `POST /api/v1/auth/login` - User login
  - Body: `{ email, password }`
  - Returns: `{ accessToken, refreshToken, user }`

- `POST /api/v1/auth/refresh` - Refresh token
  - Body: `{ refreshToken }`
  - Returns: `{ accessToken, user }`

- `POST /api/v1/auth/logout` - User logout
  - Returns: `{ message: "Logged out successfully" }`

- `GET /api/v1/auth/me` - Current user profile
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ user }`

### Phase 2 (Upcoming)
- `GET /api/v1/users` - List users
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Phase 3-4
- Task management endpoints
- Form & report endpoints
- Client management endpoints
- Dashboard analytics endpoints

## 🔧 Configuration

### Environment Variables (.env)

```env
# Server
NODE_ENV=development          # development, production
PORT=3000                     # Server port

# Database
DATABASE_URL=postgresql://... # PostgreSQL connection string

# JWT
JWT_SECRET=...               # Signing key (min 32 chars)
JWT_REFRESH_SECRET=...       # Refresh token signing key
JWT_EXPIRE_IN=15m            # Access token expiry
JWT_REFRESH_EXPIRE_IN=7d     # Refresh token expiry

# CORS
CORS_ORIGIN=http://localhost:5173  # Frontend URL

# Logging
LOG_LEVEL=debug              # debug, info, warn, error
```

## 🗄️ Database

### Schema Highlights
- **Multi-tenant**: `companies` table for data isolation
- **Users**: email unique per company, soft deletes via status
- **Tasks**: with relationships to clients, assignments, evidence
- **Forms**: dynamic JSON schema for field definitions
- **Audit**: all actions logged for compliance

### Key Tables
- `companies` - Tenant data
- `users` - System users with roles
- `clients` - Service clients
- `tasks` - Work assignments
- `forms` - Form templates
- `form_responses` - Completed forms
- `reports` - Generated documents
- `evidence` - Task photos/attachments
- `audit_logs` - Action tracking

### Running Migrations
```bash
# View pending migrations
npm run prisma:migrate

# Apply migrations
npm run prisma:migrate

# Open Prisma Studio (visual database browser)
npm run prisma:studio
```

## 🛡️ Security

- **Password Hashing**: bcrypt with salt rounds 10
- **JWT**: HS256 algorithm, payload verification
- **CORS**: Restricted to frontend domain
- **Helmet**: Security headers (X-Frame-Options, etc)
- **Input Validation**: express-validator on all endpoints
- **Rate Limiting**: Coming in Phase 2

## 📊 Development

### Available Scripts
```bash
npm run dev              # Start with nodemon
npm start               # Start production server
npm run prisma:generate # Generate Prisma Client
npm run prisma:migrate  # Run migrations
npm run prisma:studio   # Visual database UI
npm run lint            # ESLint (with auto-fix)
npm run test            # Jest unit tests
```

### Debugging
```bash
# Enable detailed logs
DEBUG=* npm run dev

# Debug specific module
DEBUG=app npm run dev
```

### Hot Reload
Nodemon watches `src/` and auto-restarts on changes.

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Deploy to Railway.app
1. Connect GitHub repository
2. Railway auto-detects Node.js
3. Set environment variables in Railway dashboard
4. Auto-deploys on push to `main`

### Database
Use Supabase PostgreSQL (Manage → Connections → Copy URI)

## 🧪 Testing

```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test -- --coverage  # With coverage report
```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [OWASP API Security](https://owasp.org/www-project-api-security/)

## 🤝 Contributing

Follow the established patterns from Phase 1:
- Services handle business logic
- Controllers handle requests/responses
- Middleware for cross-cutting concerns
- Centralized error handling

---

**Current Phase**: 1 - Authentication Foundation  
**Next Phase**: User Management & CRUD Operations
