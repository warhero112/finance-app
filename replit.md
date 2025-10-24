# FinTrack - Personal Finance Application

## Overview

FinTrack is a fully functional personal finance application that helps users track expenses, manage savings goals, and receive AI-powered financial insights. The application features a mobile-first design with a clean, intuitive interface inspired by fintech leaders like Mint and YNAB.

**Core Features (All Implemented):**
- ✅ Transaction tracking (income and expenses) with full CRUD operations
- ✅ Savings goal management with visual progress tracking and funding
- ✅ AI-powered financial advisor using Anthropic's Claude with contextual insights
- ✅ Real-time financial insights and analytics with dynamic currency formatting
- ✅ Multi-currency support (USD, EUR, GBP, JPY, CAD, LKR) with live formatting
- ✅ Multi-language support (EN, ES, FR, DE, IT, JA, SI)
- ✅ Responsive mobile-first design with bottom navigation
- ✅ Comprehensive data persistence with in-memory storage

## Current Status

**Application Status:** ✅ Fully Functional and Production-Ready for Demo

All core features have been implemented and tested:
- Complete CRUD operations for transactions and goals
- Real-time AI financial advisor with Anthropic Claude integration
- Dynamic multi-currency formatting throughout the entire application
- Settings persistence with immediate UI updates
- End-to-end tested with Playwright automation

**Recent Updates:**

**October 23, 2025 - Authentication System Implemented:**
- ✅ **Email/Password Authentication**: Full authentication system with secure login and registration
- ✅ **Passport.js Integration**: LocalStrategy with scrypt password hashing and per-user salts
- ✅ **Session Management**: Express-session with in-memory store (memorystore)
- ✅ **Protected Routes**: All financial data endpoints require authentication
- ✅ **User Isolation**: Each user's data is completely isolated (transactions, goals, AI messages)
- ✅ **Beautiful Auth UI**: Two-column login/registration page with gradient hero section
- ✅ **Logout Functionality**: Sign out button in Settings with automatic redirect
- ✅ Installed passport, passport-local, express-session, and memorystore packages

**October 23, 2025 - Major Feature Enhancements:**
- ✅ **UI Improvements**: Centered quick-add button in bottom navigation for better UX
- ✅ **Smart Number Formatting**: Added compact number display (100k, 5.5m, etc.) for calendar view
- ✅ **AI Model Upgrade**: Replaced Anthropic Claude with Hugging Face Deepseek-R1 for financial advisor
- ✅ **OCR Integration**: Added bill/receipt scanning with OCR.space API + AI parsing
- ✅ **Calendar Enhancement**: Transaction details expand on date selection (similar to AI Advisor)
- ✅ Installed @huggingface/inference and ocr-space-api-wrapper packages
- ✅ New API endpoint: /api/ocr/scan-bill for extracting transaction data from images

**October 23, 2025 - Replit Environment Setup Completed:**
- ✅ Imported from GitHub and configured for Replit
- ✅ Installed Node.js 20 and all npm dependencies (507 packages)
- ✅ Created .gitignore file for Node.js project
- ✅ Fixed drizzle.config.ts to work without mandatory database
- ✅ Configured development workflow on port 5000
- ✅ Verified frontend and backend integration working correctly
- ✅ Configured deployment settings (autoscale with build/start scripts)
- ✅ App running successfully with in-memory storage

**Previous Completion (October 16, 2025):**
- Backend storage layer with comprehensive interface
- RESTful API routes for all resources
- Frontend integration with React Query for state management
- Multi-currency support with dynamic insights
- AI chat with financial context and graceful fallbacks

## User Preferences

Preferred communication style: Simple, everyday language.

## Authentication System

**Security Model:**
- Username/password authentication using Passport.js LocalStrategy
- Passwords hashed with Node.js scrypt algorithm (64-byte hash with 16-byte salt)
- Session-based authentication with express-session
- Secure password comparison using timingSafeEqual to prevent timing attacks
- SESSION_SECRET environment variable for session encryption

**Authentication Flow:**
1. User registers → Password hashed → User created → Automatic login
2. User logs in → Credentials verified → Session created → Redirect to app
3. User logs out → Session destroyed → Redirect to login page
4. Unauthenticated access → Automatic redirect to /auth page

**Protected Resources:**
- All transaction, goal, and AI message endpoints require authentication
- Each user's data is completely isolated by userId
- API returns 401 Unauthorized for unauthenticated requests

**User Interface:**
- `/auth` - Beautiful two-column login/registration page
- Login form with username and password
- Registration form with username, password, name, and email
- Toggle between login and registration
- Settings page includes "Sign Out" button

**Storage:**
- In-memory session store (memorystore) for development
- User credentials stored with hashed passwords in MemStorage
- Production ready for PostgreSQL session store (connect-pg-simple)

## System Architecture

### Frontend Architecture

**Framework & Build Tools:**
- React 18 with TypeScript for type safety and component-based architecture
- Vite as the build tool for fast development and optimized production builds
- Wouter for lightweight client-side routing

**UI Component Strategy:**
- Shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for managing component variants
- Inter font family for optimal readability across devices

**State Management:**
- TanStack React Query (v5) for server state management, caching, and data synchronization
- Custom query client with disabled refetching to minimize unnecessary API calls
- Local component state for UI interactions

**Design System:**
- Custom color palette with semantic color tokens (primary, secondary, success, warning, destructive)
- Light and dark mode support via CSS variables
- Consistent spacing primitives (2, 4, 6, 8 units) from Tailwind
- Card-based layouts with subtle shadows and hover effects
- Mobile-first responsive design with bottom navigation

### Backend Architecture

**Server Framework:**
- Express.js for HTTP server and API routing
- Node.js ESM modules for modern JavaScript features
- TypeScript for type safety across the entire stack

**API Design:**
- RESTful API endpoints organized by resource (users, transactions, goals, AI messages)
- Centralized error handling middleware
- Request/response logging for debugging and monitoring
- Demo user mode with hardcoded user ID for prototype/testing

**Data Layer:**
- In-memory storage implementation (MemStorage) with pre-seeded demo user
- Interface-based storage abstraction (IStorage) for easy database migration
- Drizzle ORM schema definitions ready for PostgreSQL migration
- UUID-based primary keys for all entities
- Demo user ID: "demo-user-001" (pre-initialized in storage)

**Database Schema (Prepared for PostgreSQL):**
- `users`: User profile with currency and language preferences
- `transactions`: Financial transactions with amount, category, type, and date
- `goals`: Savings goals with target, current progress, and customizable colors
- `ai_messages`: Conversation history for AI advisor feature

**Data Modeling Decisions:**
- Amounts stored as text strings to avoid JavaScript floating-point precision issues
- Dates stored in ISO format (YYYY-MM-DD) for consistency
- Soft category system with predefined categories (Food, Transportation, Shopping, Bills, Salary)
- Color customization for goals using hex color codes

### AI Integration

**AI Provider:**
- Hugging Face Deepseek-R1-Distill-Qwen-32B for conversational financial advice
- Optional integration (requires HUGGING_FACE_API_KEY environment variable)
- Graceful degradation when API key is not configured
- Previously used Anthropic Claude (upgraded October 23, 2025)

**AI Features:**
- Contextual financial advice based on user transaction history
- Spending pattern analysis
- Budget optimization suggestions
- Goal adjustment recommendations
- Natural language conversation interface
- **NEW**: OCR-powered bill scanning with AI text extraction and parsing

**Implementation Approach:**
- Message history stored per user for context retention
- Role-based messages (user/assistant) for conversation threading
- Quick suggestion prompts to guide user interactions
- OCR.space API for text extraction from bill/receipt images
- Deepseek AI for parsing extracted text into structured transaction data

### Development Workflow

**Build Process:**
- Development: tsx for TypeScript execution with hot reload via Vite
- Production: Vite for frontend bundle, esbuild for backend bundle
- Single-command database schema push with Drizzle Kit

**Code Organization:**
- `/client`: Frontend React application
- `/server`: Backend Express application
- `/shared`: Shared TypeScript types and Zod schemas
- Component examples in `/client/src/components/examples` for development/testing

**Type Safety:**
- Zod schemas for runtime validation and TypeScript type inference
- Drizzle-Zod integration for database schema validation
- Shared types between frontend and backend via `/shared` directory

**Developer Experience:**
- Path aliases (@, @shared, @assets) for clean imports
- Replit-specific plugins for development banner and error overlay
- ESLint and TypeScript strict mode for code quality

## External Dependencies

### Third-Party Services

**AI Services:**
- Hugging Face Inference API (@huggingface/inference) - Deepseek-R1 for financial advisory
- Requires HUGGING_FACE_API_KEY environment variable
- OCR.space API - Text extraction from bills/receipts
- Optional: OCR_SPACE_API_KEY environment variable (free tier available with 'helloworld' key)

### Database & ORM

**Database (Configured, Not Yet Active):**
- PostgreSQL via Neon Database (@neondatabase/serverless)
- Requires DATABASE_URL environment variable
- Connection pooling and serverless-optimized driver

**ORM & Migrations:**
- Drizzle ORM (drizzle-orm) for type-safe database queries
- Drizzle Kit (drizzle-kit) for schema migrations
- Drizzle-Zod for schema validation

### UI Component Libraries

**Core UI Components:**
- Radix UI primitives for 20+ accessible component primitives (accordion, dialog, dropdown, popover, etc.)
- Recharts for data visualization (pie charts, analytics)
- React Hook Form (@hookform/resolvers) for form state management
- date-fns for date manipulation and formatting
- cmdk for command palette interface

**Styling:**
- Tailwind CSS for utility-first styling
- PostCSS with Autoprefixer for CSS processing
- clsx and tailwind-merge for conditional class composition

### Development Tools

**Replit Integration:**
- @replit/vite-plugin-runtime-error-modal for error overlay
- @replit/vite-plugin-cartographer for code mapping
- @replit/vite-plugin-dev-banner for development indicators

### Session Management

**Session Store:**
- connect-pg-simple for PostgreSQL-backed session storage
- Prepared for authentication implementation

### Notes

- The application is currently using in-memory storage for development
- PostgreSQL database is configured but not actively used (Drizzle schema is defined)
- AI features are optional and gracefully degrade without API key
- The design system follows fintech-inspired aesthetics with emphasis on trust, clarity, and visual hierarchy
- All monetary values use string representation to avoid floating-point errors