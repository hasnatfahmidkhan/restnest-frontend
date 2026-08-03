# API Integration Mapping

This document maps all backend endpoints consumed by the Rest Nest frontend application. It outlines the HTTP methods, endpoints, frontend hooks/services, and their primary purpose.

## Authentication

| Method | Endpoint              | Frontend Component/Service                   | Purpose                                         |
| :----- | :-------------------- | :------------------------------------------- | :---------------------------------------------- |
| `POST` | `/auth/login`         | `app/(auth)/_services/auth.service.ts`       | Authenticate users and retrieve tokens          |
| `POST` | `/auth/register`      | `app/(auth)/_services/auth.service.ts`       | Register a new user                             |
| `POST` | `/auth/logout`        | `app/(auth)/_services/auth.service.ts`       | Log the user out                                |
| `POST` | `/auth/refresh-token` | `proxy.ts`, `services/getNewAccesssToken.ts` | Obtain a new access token using a refresh token |

## Public Data (Properties & Categories)

| Method | Endpoint                 | Frontend Component/Service          | Purpose                                          |
| :----- | :----------------------- | :---------------------------------- | :----------------------------------------------- |
| `GET`  | `/category`              | `services/getCategoriesService.ts`  | Fetch property categories                        |
| `GET`  | `/properties?limit=4...` | `services/getFeaturedProperties.ts` | Fetch featured properties for the home page      |
| `GET`  | `/properties`            | `hooks/useProperties.ts`            | Fetch all properties (with filtering/pagination) |
| `GET`  | `/properties/:id`        | `hooks/useProperty.ts`              | Fetch details of a specific property             |

## Tenant Endpoints

| Method   | Endpoint                             | Frontend Component/Service          | Purpose                                       |
| :------- | :----------------------------------- | :---------------------------------- | :-------------------------------------------- |
| `GET`    | `/tenant/stats`                      | `hooks/useTenantStats.ts`           | Get statistical data for the tenant dashboard |
| `POST`   | `/rentals`                           | `app/(public)/_actions/rentals.ts`  | Create a new rental request                   |
| `GET`    | `/rentals`                           | `hooks/useTenantRentals.ts`         | Fetch all rentals requested by the tenant     |
| `PATCH`  | `/rentals/tenant/requests/:rentalId` | `hooks/useTenantRentals.ts`         | Cancel a rental request                       |
| `GET`    | `/reviews/:rentalId`                 | `hooks/useReviews.ts`               | Fetch reviews for a specific rental           |
| `GET`    | `/reviews/my-reviews`                | `hooks/useReviews.ts`               | Fetch reviews created by the tenant           |
| `POST`   | `/reviews/:rentalId`                 | `hooks/useReviews.ts`               | Submit a review for a rental                  |
| `DELETE` | `/reviews/:reviewId`                 | `hooks/useReviews.ts`               | Delete a review                               |
| `POST`   | `/payments/create`                   | `hooks/usePayment.ts`               | Create a new payment session (Stripe)         |
| `GET`    | `/payments`                          | `hooks/usePayment.ts`               | Fetch payment history for the user            |
| `GET`    | `/payments/session/:sessionId`       | `app/api/payments/success/route.ts` | Verify a payment session success              |

## Landlord Endpoints

| Method   | Endpoint                               | Frontend Component/Service                   | Purpose                                                 |
| :------- | :------------------------------------- | :------------------------------------------- | :------------------------------------------------------ |
| `GET`    | `/landlord/stats`                      | `hooks/useLandlordStats.ts`                  | Get statistical data for the landlord dashboard         |
| `POST`   | `/landlord/properties`                 | `app/dashboard/_actions/property.actions.ts` | Add a new property                                      |
| `PATCH`  | `/landlord/properties/:propertyId`     | `app/dashboard/_actions/property.actions.ts` | Update an existing property                             |
| `DELETE` | `/landlord/properties/:propertyId`     | `app/dashboard/_actions/property.actions.ts` | Delete a property                                       |
| `GET`    | `/rentals/landlord/requests`           | `hooks/useLandlordRentals.tsx`               | Fetch all rental requests for the landlord's properties |
| `PATCH`  | `/rentals/landlord/requests/:rentalId` | `hooks/useLandlordRentals.tsx`               | Update rental request status (Approve/Reject)           |

## Admin Endpoints

| Method  | Endpoint               | Frontend Component/Service    | Purpose                                      |
| :------ | :--------------------- | :---------------------------- | :------------------------------------------- |
| `GET`   | `/admin/stats`         | `hooks/useAdminStats.ts`      | Get statistical data for the admin dashboard |
| `GET`   | `/admin/rentals`       | `hooks/useAdminRentals.ts`    | Fetch all system rentals                     |
| `GET`   | `/admin/properties`    | `hooks/useAdminProperties.ts` | Fetch all system properties                  |
| `GET`   | `/admin/users`         | `hooks/use-admin-users.ts`    | Fetch all users in the system                |
| `PATCH` | `/admin/users/:userId` | `hooks/use-admin-users.ts`    | Update user status (e.g., Ban/Unban)         |
