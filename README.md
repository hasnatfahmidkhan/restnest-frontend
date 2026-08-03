# Rest Nest - Frontend

## Overview
**Rest Nest** is a comprehensive real estate and property rental platform designed to connect landlords and tenants seamlessly. The platform offers a rich, intuitive user interface for browsing properties, requesting rentals, managing payments, and providing reviews. It features secure, role-based access control with distinct dashboards for **Tenants**, **Landlords**, and **Administrators**.

## Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **State Management:** Zustand (Global State), React Query (Server State/Data Fetching)
- **Forms & Validation:** React Hook Form, Zod
- **Animations:** Framer Motion, Lenis (Smooth Scrolling)
- **Authentication:** JWT (JSON Web Tokens) with Secure HTTP-Only Cookies via Next.js Middleware

## Key Features

### For Tenants
- **Property Browsing:** Browse and search through available properties with advanced filtering and pagination.
- **Rental Requests:** Request to rent properties and track the status of applications.
- **Payments:** Secure payment processing for rentals using Stripe integration.
- **Reviews:** Leave and manage reviews for past rentals.
- **Dashboard:** A dedicated tenant dashboard to manage active rentals, view payment history, and track application stats.

### For Landlords
- **Property Management:** Add, edit, delete, and manage property listings (with image uploads).
- **Rental Approvals:** Review and approve or reject rental requests from tenants.
- **Dashboard:** Landlord-specific analytics and statistics for properties and rentals.

### For Administrators
- **Platform Management:** Oversee all users, properties, and rentals across the platform.
- **User Moderation:** Manage user statuses (e.g., ban/unban users) and resolve platform issues.
- **Dashboard:** Global statistics and holistic system overview.

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
   *Ensure you provide the correct `NEXT_PUBLIC_API_URL` pointing to your running Rest Nest backend.*

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## API Integration
The frontend seamlessly integrates with a NestJS backend. All HTTP requests are managed using `fetch` coupled with React Query (`@tanstack/react-query`) for caching and state synchronization. 

For a detailed breakdown of all mapped backend endpoints, please refer to the [API_INTEGRATION.md](./API_INTEGRATION.md) document.

## Project Structure
- `app/`: Next.js App Router structure (Pages, Layouts, API Routes).
- `components/`: Reusable UI components (including shadcn/ui components).
- `hooks/`: Custom React hooks, heavily utilizing React Query for API interactions.
- `services/`: API utility functions and standalone service layer logic.
- `store/`: Zustand global state slices.
- `lib/`: Utility functions, configuration, and helpers (e.g., JWT decoding).
- `providers/`: Application context providers (e.g., Theme, React Query, Lenis).
- `routes/`: Centralized route definitions used by the Next.js middleware for public, protected, and role-specific routing control.

## Available Scripts

- `pnpm dev`: Starts the development server.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Runs ESLint to check for code quality and errors.

## Contributing
Contributions are welcome! Please follow the established code style (ESLint + Prettier standards) and ensure all type checks and linting pass before submitting a pull request.
