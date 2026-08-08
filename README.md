# Rest Nest - Frontend

## Overview
**Rest Nest** is a comprehensive real estate and property rental platform designed to connect landlords and tenants seamlessly. The platform offers a rich, intuitive user interface for browsing properties, requesting rentals, managing payments, and providing reviews. It features secure, role-based access control with distinct dashboards for **Tenants**, **Landlords**, and **Administrators**.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui, Radix UI Primitives
- **State Management:** Zustand (Global State), React Query / `@tanstack/react-query` (Server State & Data Fetching)
- **Forms & Validation:** React Hook Form, Zod
- **Animations:** Framer Motion, Lenis (Smooth Scrolling)
- **Charts & Analytics:** Recharts
- **Authentication:** JWT (JSON Web Tokens) with Secure HTTP-Only Cookies via Next.js Middleware, Google OAuth (`@react-oauth/google`)
- **Image Uploads:** Cloudinary (Signed Client-Side Uploads)
- **Notifications:** Sonner (Toast Notifications)

## Key Features

### For Tenants
- **Property Browsing:** Browse and search through available properties with advanced filtering (category, amenities, price range, location) and pagination.
- **Rental Requests:** Request to rent properties and track the status of applications.
- **Payments:** Secure payment processing for rentals using Stripe integration.
- **Reviews:** Leave, update, and manage reviews for past rentals.
- **Profile Management:** Update personal information, phone number, bio, and profile photo.
- **Dashboard:** A dedicated tenant dashboard to manage active rentals, view payment history, and track application stats.

### For Landlords
- **Property Management:** Add, edit, delete, and manage property listings with Cloudinary image uploads and amenity selection.
- **Rental Approvals:** Review and approve or reject rental requests from tenants, with detailed rental information.
- **Profile Management:** Update personal information and profile photo.
- **Dashboard:** Landlord-specific analytics and statistics for properties and rentals.

### For Administrators
- **Platform Management:** Oversee all users, properties, and rentals across the platform with search and filtering.
- **User Moderation:** Manage user statuses (e.g., ban/unban users) and resolve platform issues.
- **Profile Management:** Update personal information and profile photo.
- **Dashboard:** Global statistics and holistic system overview with charts.

### Public Pages
- **Home Page:** Featured properties, popular locations, and a call-to-action for new users.
- **About:** Platform information and mission.
- **Contact:** Contact form for user inquiries.
- **How It Works:** Step-by-step guide to using the platform.
- **Help Center:** FAQs and support resources.
- **Privacy Policy & Terms:** Legal and privacy information.

## Getting Started

### Prerequisites
Make sure you have Node.js (v18.17+) and a package manager (`npm`, `yarn`, `pnpm`, or `bun`) installed.

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rest-nest-frontend
   ```

2. Install dependencies (using pnpm is recommended as per the lockfile):
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

   | Variable                            | Description                                                  |
   | :---------------------------------- | :----------------------------------------------------------- |
   | `NEXT_PUBLIC_API_URL`               | Public-facing backend API URL (used in client & server)      |
   | `BACKEND_API_URL`                   | Internal backend API URL (server-side only, for services)    |
   | `JWT_ACCESS_SECRET`                 | Secret for verifying JWT access tokens in middleware         |
   | `JWT_REFRESH_SECRET`                | Secret for verifying JWT refresh tokens in middleware        |
   | `JWT_ACCESS_EXPIRES_IN`             | Access token expiry duration                                 |
   | `JWT_REFRESH_EXPIRES_IN`            | Refresh token expiry duration                                |
   | `BCRYPT_SALT_ROUNDS`                | Salt rounds for bcrypt hashing                               |
   | `NODE_ENV`                          | Environment (`development` or `production`)                  |
   | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for image uploads                      |
   | `CLOUDINARY_API_KEY`                | Cloudinary API key (server-side only)                        |
   | `CLOUDINARY_API_SECRET`             | Cloudinary API secret (server-side only)                     |

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## API Integration
The frontend seamlessly integrates with a NestJS backend. All HTTP requests are managed through a dedicated **service layer** (`services/`) using `fetch`, with React Query (`@tanstack/react-query`) in custom hooks (`hooks/`) for caching, optimistic updates, and state synchronization. Server Actions (`"use server"`) are used for secure server-side operations like token management and form submissions.

For a detailed breakdown of all mapped backend endpoints, please refer to the [API_INTEGRATION.md](./API_INTEGRATION.md) document.

## Project Structure
- `app/`: Next.js App Router structure (Pages, Layouts, API Routes, Server Actions).
  - `(auth)/`: Authentication pages (Login, Register) and related services/schemas.
  - `(public)/`: Public-facing pages (Home, Properties, Contact, About, etc.) and actions.
  - `dashboard/`: Role-based dashboards (Tenant, Landlord, Admin) with nested pages.
  - `api/`: Next.js API routes (e.g., payment verification).
- `components/`: Reusable UI components (including shadcn/ui components).
- `hooks/`: Custom React hooks, heavily utilizing React Query for API interactions.
- `services/`: Server-side service layer — API utility functions, Cloudinary upload signing, and token management.
- `schemas/`: Zod validation schemas for forms and data.
- `store/`: Zustand global state slices (auth, theme).
- `lib/`: Utility functions, configuration, and helpers (e.g., JWT decoding).
- `providers/`: Application context providers (Theme, React Query, Lenis, Auth).
- `routes/`: Centralized route definitions used by the Next.js middleware for public, protected, and role-specific routing control.
- `proxy.ts`: Next.js middleware handling authentication, token refresh, and role-based access control (RBAC).

## Available Scripts

- `pnpm dev`: Starts the development server.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Runs ESLint to check for code quality and errors.

## Contributing
Contributions are welcome! Please follow the established code style (ESLint + Prettier standards) and ensure all type checks and linting pass before submitting a pull request.
