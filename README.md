# 📝 SaaS Notes - Multi-Tenant Notes Platform

> A production-ready, multi-tenant SaaS notes application with role-based access control and subscription management

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-Latest-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

## 🏗️ Multi-Tenancy Architecture

This application uses a **shared schema with tenant ID** approach for multi-tenancy, ensuring strict data isolation between tenants while maintaining cost-effectiveness and scalability.

- **Two Tenants**: Acme and Globex
- **Strict Isolation**: Each tenant's data is completely separated
- **Efficient**: Single database with tenant-scoped queries

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** for secure login
- **Role-based access control**:
  - **Admin**: Can invite users and upgrade subscriptions
  - **Member**: Can only manage notes (CRUD operations)

### 📊 Subscription Management
- **Free Plan**: Limited to 3 notes maximum
- **Pro Plan**: Unlimited notes
- **Upgrade Flow**: Admin can upgrade via dummy payment page

### 📝 Notes Management
- Full CRUD operations (Create, Read, Update, Delete)
- Tenant-scoped - users only see their tenant's notes
- Real-time plan limit enforcement

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, CSS
- **Backend**: Next.js API Routes, Prisma ORM, JWT Authentication
- **Database**: PostgreSQL hosted on Supabase with tenant isolation
- **Deployment**: Vercel

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
git clone https://github.com/yashsri2802/saas-notes.git
cd saas-notes
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
```

Update your `.env.local` with database URL and JWT secret.

### 3. Database Setup
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Start Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 👥 Test Accounts

| Email | Password | Role | Tenant |
|-------|----------|------|---------|
| `admin@acme.test` | `password` | Admin | Acme |
| `user@acme.test` | `password` | Member | Acme |
| `admin@globex.test` | `password` | Admin | Globex |
| `user@globex.test` | `password` | Member | Globex |

## 🔌 API Endpoints

- **Health Check**: `GET /api/health`
- **Login**: `POST /api/auth/login`
- **Notes CRUD**: 
  - `POST /api/notes` - Create note
  - `GET /api/notes` - List notes (tenant-scoped)
  - `GET /api/notes/:id` - Get note
  - `PUT /api/notes/:id` - Update note
  - `DELETE /api/notes/:id` - Delete note
- **Upgrade**: `POST /api/tenants/:slug/upgrade` (Admin only)

## 🎯 How It Works

### Multi-Tenancy
Every user belongs to either Acme or Globex tenant. All data is automatically scoped to their tenant - no cross-tenant access possible.

### Subscription Limits
- **Free users** can create maximum 3 notes
- When limit reached, "Upgrade to Pro" button appears
- **Admin clicks upgrade** → redirected to dummy payment page
- **After clicking "Pay and Upgrade"** → unlimited notes immediately available

### Role Permissions
- **Members** can only manage their notes
- **Admins** can manage notes + invite users + upgrade tenant

## 🚀 Deployment

Deployed on Vercel with CORS enabled for automated testing and external access.

**Production URLs:**
- Frontend: `https://saas-notes-lac.vercel.app/`
- Base URL: `https://saas-notes-lac.vercel.app/api/health`

## 📋 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:generate  # Generate Prisma client
npm run db:push      # Push database changes
npm run db:seed      # Seed test data
```

---

<div align="center">
  <p>🏢 Multi-Tenant • 🔐 JWT Auth • 💳 Subscription Plans</p>
  <p>Built by <a href="https://github.com/yashsri2802">yashsri2802</a></p>
</div>
