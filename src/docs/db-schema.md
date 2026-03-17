# Database Schema

This document describes the database schema used in the project.

We use **Supabase**, which is built on **PostgreSQL**, as our core database engine.
Supabase is used for two primary purposes:

- **Database**
- **Authentication**

Because authentication is handled by Supabase, some tables (like `auth.users`) are managed internally and extended via application-level tables.

---

## Authentication Model

### `auth.users`

This table is managed by Supabase and stores **authentication-related data only**.

> Application-specific user data is **not** stored here.

| Column             | Type       | Purpose                      |
| ------------------ | ---------- | ---------------------------- |
| id                 | uuid       | Primary key                  |
| email              | text       | User email                   |
| phone              | text       | Phone number                 |
| encrypted_password | text       | Hashed password              |
| email_confirmed_at | timestampz | Email verification timestamp |
| phone_confirmed_at | timestampz | Phone verification timestamp |
| last_sign_in_at    | timestampz | Last login time              |
| created_at         | timestampz | Account creation time        |
| updated_at         | timestampz | Last update time             |

---

## User Profile

### `profiles`

Stores application-specific user information.

A **trigger** is created so that whenever a new user is inserted into `auth.users`, a corresponding row is automatically created in `profiles`.

| Column      | Type       | Description          | Constraints                                |
| ----------- | ---------- | -------------------- | ------------------------------------------ |
| id          | uuid       | Supabase user ID     | PK, FK → auth.users.id                     |
| name        | text       | Student name         | NOT NULL                                   |
| email       | text       | Login email          | NOT NULL, UNIQUE                           |
| room_number | text       | Hostel room number   | NOT NULL, restricted to valid hostel rooms |
| roll_number | text       | Student roll number  | Optional                                   |
| created_at  | timestampz | Record creation time | DEFAULT now()                              |

---

## Products & Inventory

### `products`

Stores all inventory data.

| Column     | Type       | Description          | Constraints            |
| ---------- | ---------- | -------------------- | ---------------------- |
| id         | uuid       | Product ID           | PK                     |
| image_url  | text       | Product image URL    | NOT NULL               |
| name       | text       | Product name         | NOT NULL               |
| price      | numeric    | Product price        | NOT NULL               |
| stock      | int        | Available quantity   | NOT NULL, non-negative |
| created_at | timestampz | Record creation time | DEFAULT now()          |

---

## Cart System

### `cart`

Each user can have **only one active cart**.

| Column     | Type       | Constraints                |
| ---------- | ---------- | -------------------------- |
| id         | uuid       | PK                         |
| user_id    | uuid       | FK → profiles.id, NOT NULL |
| created_at | timestampz | DEFAULT now()              |

---

### `cart_items`

Stores products added to a user’s cart.

| Column        | Type    | Constraints                |
| ------------- | ------- | -------------------------- |
| id            | uuid    | PK                         |
| cart_id       | uuid    | FK → cart.id, NOT NULL     |
| product_id    | uuid    | FK → products.id, NOT NULL |
| quantity      | int     | NOT NULL, non-negative     |
| price_at_time | numeric | NOT NULL, non-negative     |

---

## Orders

### Enums

- **payment_method_enum:** `COD`, `UPI`
- **status_enum:** `pending`, `paid`, `on_the_way`, `delivered`, `failed`

---

### `orders`

Represents a placed order.

| Column         | Type       | Constraints                                |
| -------------- | ---------- | ------------------------------------------ |
| id             | uuid       | PK                                         |
| user_id        | uuid       | FK → profiles.id, NOT NULL                 |
| total_amount   | numeric    | NOT NULL, non-negative                     |
| room_number    | text       | NOT NULL, restricted to valid hostel rooms |
| payment_method | enum       | NOT NULL                                   |
| status         | enum       | NOT NULL                                   |
| created_at     | timestampz | DEFAULT now()                              |

---

### `order_items`

Stores individual items within an order.

| Column      | Type    | Constraints                |
| ----------- | ------- | -------------------------- |
| id          | uuid    | PK                         |
| order_id    | uuid    | FK → orders.id, NOT NULL   |
| product_id  | uuid    | FK → products.id, NOT NULL |
| quantity    | int     | NOT NULL, positive         |
| price       | numeric | NOT NULL, non-negative     |
| total_price | numeric | NOT NULL, non-negative     |

---

## Payments

### Enums

- **payment_method_enum:** `COD`, `UPI`
- **payment_status_enum:** `pending`, `success`, `failed`

---

### `payments`

Tracks payment details for an order.

| Column         | Type       | Constraints              |
| -------------- | ---------- | ------------------------ |
| id             | uuid       | PK                       |
| order_id       | uuid       | FK → orders.id, NOT NULL |
| payment_method | enum       | NOT NULL                 |
| payment_status | enum       | NOT NULL                 |
| transaction_id | text       | NOT NULL                 |
| created_at     | timestampz | DEFAULT now()            |

---

## Delivery Verification

### `delivery_otps`

Used to verify order delivery via OTP.

| Column      | Type    | Constraints              |
| ----------- | ------- | ------------------------ |
| id          | uuid    | PK                       |
| order_id    | uuid    | FK → orders.id, NOT NULL |
| otp_code    | text    | NOT NULL                 |
| is_verified | boolean | DEFAULT false            |

---

## OTP Verification

### Enums

- **purpose_enum:** `signup`, `forgot_password`

---

### `otp_verifications`

Used for email-based OTP flows.

| Column      | Type    | Constraints   |
| ----------- | ------- | ------------- |
| id          | uuid    | PK            |
| email       | text    | NOT NULL      |
| otp_code    | text    | NOT NULL      |
| purpose     | enum    | NOT NULL      |
| is_verified | boolean | DEFAULT false |

---

## Indexing Strategy

Indexes will be added **incrementally and intentionally** based on:

- Query patterns
- Performance bottlenecks
- Real usage data

No premature optimization.

---

## Guiding Principles

- Authentication data stays in `auth.users`
- Application data lives in application-managed tables
- Constraints enforce correctness at the database level
- Business logic does **not** rely on client-side validation alone
