# API Integration Mapping

This document maps all backend endpoints consumed by the Rest Nest frontend application. It outlines the HTTP methods, endpoints, frontend hooks/services, and their primary purpose.

## Authentication

| Method | Endpoint              | Frontend Component/Service                        | Purpose                                         |
| :----- | :-------------------- | :------------------------------------------------ | :---------------------------------------------- |
| `POST` | `/auth/login`         | `app/(auth)/_sevices/auth.service.ts`              | Authenticate users and retrieve tokens          |
| `POST` | `/auth/register`      | `app/(auth)/_sevices/auth.service.ts`              | Register a new user                             |
| `POST` | `/auth/google`        | `app/(auth)/_sevices/auth.service.ts`              | Authenticate via Google OAuth (ID token)        |
| `GET`  | `/auth/me`            | `app/(auth)/_sevices/auth.service.ts`              | Fetch the currently authenticated user's data   |
| `POST` | `/auth/refresh-token` | `proxy.ts`, `services/getNewAccesssToken.ts`, `services/getValidAccessToken.ts` | Obtain a new access token using a refresh token |

## Profile

| Method  | Endpoint        | Frontend Component/Service   | Purpose                                  |
| :------ | :-------------- | :--------------------------- | :--------------------------------------- |
| `PATCH` | `/auth/profile` | `services/profile.service.ts` | Update authenticated user's profile info |

## Public Data (Properties & Categories)

| Method | Endpoint                          | Frontend Component/Service          | Purpose                                          |
| :----- | :-------------------------------- | :---------------------------------- | :----------------------------------------------- |
| `GET`  | `/category`                       | `services/getCategoriesService.ts`, `services/property.service.ts` | Fetch property categories                        |
| `GET`  | `/amenities`                      | `services/property.service.ts`      | Fetch property amenities for filters             |
| `GET`  | `/properties?limit=4...`          | `services/getFeaturedProperties.ts` | Fetch featured properties for the home page      |
| `GET`  | `/properties`                     | `services/property.service.ts`, `hooks/useProperties.ts` | Fetch all properties (with filtering/pagination) |
| `GET`  | `/properties/:id`                 | `services/property.service.ts`, `hooks/useProperty.ts` | Fetch details of a specific property             |
| `GET`  | `/properties/popular-locations`   | `app/(public)/_actions/home.ts`     | Fetch popular property locations for the home page |

## Tenant Endpoints

| Method  | Endpoint                             | Frontend Component/Service             | Purpose                                       |
| :------ | :----------------------------------- | :------------------------------------- | :-------------------------------------------- |
| `GET`   | `/tenant/stats`                      | `services/tenant.service.ts`, `hooks/useTenantStats.ts` | Get statistical data for the tenant dashboard |
| `POST`  | `/rentals`                           | `app/(public)/_actions/rentals.ts`     | Create a new rental request                   |
| `GET`   | `/rentals`                           | `services/tenant.service.ts`, `hooks/useTenantRentals.ts` | Fetch all rentals requested by the tenant     |
| `PATCH` | `/rentals/tenant/requests/:rentalId` | `services/tenant.service.ts`, `hooks/useTenantRentals.ts` | Cancel a rental request                       |
| `GET`   | `/reviews/my-reviews`                | `services/review.service.ts`, `hooks/useReviews.ts` | Fetch reviews created by the tenant           |
| `POST`  | `/reviews/:rentalId`                 | `services/review.service.ts`, `hooks/useReviews.ts` | Submit a review for a rental                  |
| `PATCH` | `/reviews/:reviewId`                 | `services/review.service.ts`, `hooks/useReviews.ts` | Update an existing review                     |
| `POST`  | `/payments/create`                   | `services/payment.service.ts`, `hooks/usePayment.ts` | Create a new payment session (Stripe)         |
| `GET`   | `/payments`                          | `services/payment.service.ts`, `hooks/usePayment.ts` | Fetch payment history for the user            |
| `GET`   | `/payments/session/:sessionId`       | `app/api/payments/success/route.ts`    | Verify a payment session success              |

## Landlord Endpoints

| Method   | Endpoint                               | Frontend Component/Service                  | Purpose                                                 |
| :------- | :------------------------------------- | :------------------------------------------ | :------------------------------------------------------ |
| `GET`    | `/landlord/stats`                      | `services/landlord.service.ts`, `hooks/useLandlordStats.ts` | Get statistical data for the landlord dashboard         |
| `POST`   | `/landlord/properties`                 | `services/property.service.ts`              | Add a new property                                      |
| `PATCH`  | `/landlord/properties/:propertyId`     | `services/property.service.ts`              | Update an existing property                             |
| `DELETE` | `/landlord/properties/:propertyId`     | `services/property.service.ts`              | Delete a property                                       |
| `GET`    | `/rentals/landlord`                    | `services/rental.service.ts`, `hooks/useLandlordRentals.tsx` | Fetch all rental requests for the landlord's properties |
| `PATCH`  | `/rentals/landlord/requests/:rentalId` | `services/rental.service.ts`, `hooks/useLandlordRentals.tsx` | Update rental request status (Approve/Reject)           |

## Shared / Rental Details

| Method | Endpoint            | Frontend Component/Service    | Purpose                                              |
| :----- | :------------------ | :---------------------------- | :--------------------------------------------------- |
| `POST` | `/rentals/:rentalId` | `services/rental.service.ts` | Fetch detailed info for a specific rental (by tenant) |

## Admin Endpoints

| Method  | Endpoint                  | Frontend Component/Service                    | Purpose                                      |
| :------ | :------------------------ | :-------------------------------------------- | :------------------------------------------- |
| `GET`   | `/admin/stats`            | `services/admin.service.ts`, `hooks/useAdminStats.ts` | Get statistical data for the admin dashboard |
| `GET`   | `/admin/rentals`          | `services/admin.service.ts`, `hooks/useAdminRentals.ts` | Fetch all system rentals                     |
| `GET`   | `/admin/properties`       | `services/admin.service.ts`, `hooks/useAdminProperties.ts` | Fetch all system properties                  |
| `GET`   | `/admin/properties/:id`   | `services/property.service.ts`                | Fetch a specific property (admin view)       |
| `GET`   | `/admin/users`            | `services/admin.service.ts`, `hooks/use-admin-users.ts` | Fetch all users in the system                |
| `PATCH` | `/admin/users/:userId`    | `services/admin.service.ts`, `hooks/use-admin-users.ts` | Update user status (e.g., Ban/Unban)         |

## Image Upload (Cloudinary — Client-Side Direct Upload)

| Method | Endpoint                  | Frontend Component/Service         | Purpose                                               |
| :----- | :------------------------ | :--------------------------------- | :---------------------------------------------------- |
| N/A    | Server Action (signature) | `services/uploadAction.ts`         | Generate a signed Cloudinary upload signature (server) |
| `POST` | Cloudinary Upload API     | `hooks/useCloudinaryUpload.ts`     | Upload images directly to Cloudinary from the client   |
