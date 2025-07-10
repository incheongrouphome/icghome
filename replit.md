# Replit.md

## Overview

This is a Korean organization website for the Korea Child and Youth Group Home Association Incheon Branch. It's a full-stack web application built with React, Express, and PostgreSQL, featuring a modern UI with shadcn/ui components and authentication via Replit Auth. The site serves as a community platform for child welfare professionals, with both public information and member-restricted areas.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client-side (React) and server-side (Express) code:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **UI Library**: shadcn/ui components based on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite with custom configuration

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL sessions with connect-pg-simple

## Key Components

### Database Schema
- **Users Table**: Stores user profiles with role-based permissions (visitor, member, admin)
- **Board Categories**: Different forum categories with access controls
- **Posts and Comments**: Content management with author relationships
- **Sessions**: Authentication session storage

### Authentication System
- Uses Replit Auth for user authentication
- Role-based access control (visitor, member, admin)
- Approval workflow for member access
- Session management with PostgreSQL backend

### UI Components
- Comprehensive shadcn/ui component library
- Responsive design with mobile-first approach
- Korean language support with Noto Sans KR font
- Custom color scheme with CSS variables

### Page Structure
- **Landing Page**: Public homepage with hero slider and service cards
- **About**: Organization information and group home introduction
- **Business**: Service offerings and programs
- **Members**: Protected area for approved members
- **Announcements**: Public and job posting boards
- **Donation**: Fundraising and contact information

## Data Flow

1. **Authentication Flow**: Replit Auth → Express middleware → Database user lookup → Session creation
2. **Content Flow**: React components → TanStack Query → Express API routes → Drizzle ORM → PostgreSQL
3. **Authorization**: Role-based middleware checks user permissions before serving protected content

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **wouter**: Client-side routing
- **passport**: Authentication middleware

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management

### Development Tools
- **vite**: Build tool and dev server
- **typescript**: Type safety
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

The application is configured for Replit deployment with:
- Development server using tsx for hot reloading
- Production build process with Vite for frontend and esbuild for backend
- Environment-based configuration for database connections
- Static file serving through Express in production
- Replit-specific plugins for development experience

### Build Process
1. Frontend: Vite builds React app to `dist/public`
2. Backend: esbuild bundles Express server to `dist/index.js`
3. Database: Drizzle migrations applied via `db:push` script

### Environment Requirements
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPLIT_DOMAINS`: Allowed domains for authentication
- `ISSUER_URL`: OIDC issuer URL (defaults to Replit)