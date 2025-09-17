# School Payments — Backend

This repository contains the **School Payments** backend (NestJS + MongoDB) implemented for the internship assessment. The service provides order creation, payment integration, webhook processing, transaction querying, JWT auth, and admin endpoints.

---

## What’s included

* NestJS REST API
* MongoDB (Atlas) schemas: **Order**, **OrderStatus**, **WebhookLog**, **User**
* JWT authentication (users persisted in MongoDB, passwords hashed with bcrypt)
* Payment create-collect integration (POST `/create-payment`) — persists a local Order and maps provider `collect_request_id` to it
* Webhook endpoint (POST `/webhook`) — logs raw payloads and upserts `OrderStatus`, updates `Order`
* Transaction listing with aggregation, pagination, sorting & filtering (GET `/transactions`)
* Admin endpoint to list webhook logs (GET `/admin/webhook-logs`)
* Basic validation (class-validator DTOs), logging, and indexes

---

## Quick start (local)

1. **Clone repo**

```bash
git clone <your-repo-url>
cd backend
```

2. **Install**

```bash
npm install
```

3. **Environment**

Create a `.env` file (or copy `.env.example`) and set the variables below (examples included):

```
MONGODB_URI=mongodb+srv://<user>:<pwd>@cluster0.nsabbc1.mongodb.net/school-payments?retryWrites=true&w=majority
APP_PORT=3000
NODE_ENV=development
JWT_SECRET=supersecretkey123
JWT_EXPIRES_IN=3600s
PAYMENT_API_KEY=<provider-api-key>
PAYMENT_PG_KEY=<pg-secret>
PAYMENT_BASE_URL=https://dev-vanilla.edviron.com/erp
PAYMENT_CALLBACK_URL=http://localhost:3000/payment/callback
```

4. **Run dev server**

```bash
npm run start:dev
```

Server will run at `http://localhost:3000`.

---

## API Endpoints (summary & examples)

> All endpoints that require auth expect a header: `Authorization: Bearer <JWT>`

### Auth

* `POST /auth/register` — create user

  * Body: `{ "username": "newuser", "password": "newpass" }`
* `POST /auth/login` — returns `{ access_token }`

  * Body: `{ "username": "newuser", "password": "newpass" }`

PowerShell login example (returns JWT):

```powershell
curl -X POST "http://localhost:3000/auth/login" `
  -H "Content-Type: application/json" `
  -d '{ "username": "newuser", "password": "newpass" }'
```

---

### Orders

* `POST /orders` — create a local order (protected)

  * Body example:

  ```json
  {
    "school_id":"65b0e6293e9f76a9694d84b4",
    "student_info": { "name":"John Doe", "id":"STU001", "email":"j@x.com" },
    "gateway_name":"TestGateway",
    "custom_order_id":"ORDER123"
  }
  ```

* `GET /orders` — list orders (protected)

* `GET /orders/:id` — get order by `_id` (protected)

* `POST /orders/:id/pay` — mark order paid (internal/testing)

PowerShell create order:

```powershell
curl -X POST "http://localhost:3000/orders" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer <JWT>" `
  -d '{ "school_id": "65b0...", "student_info": { "name":"A","id":"STU" } }'
```

---

### Payment integration

* `POST /create-payment` — calls provider `create-collect-request` and persists a local Order. Returns provider response + local order mapping.

  * Body: `school_id` (string), `amount` (string), `callback_url` (optional), `student_info` (optional)

Example (PowerShell):

```powershell
curl -X POST "http://localhost:3000/create-payment" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer <JWT>" `
  -d '{ "school_id":"65b0e6293e9f76a9694d84b4", "amount":"100", "callback_url":"http://localhost:3000/payment/callback" }'
```

Notes:

* `sign` JWT for provider is generated server-side using `PAYMENT_PG_KEY` and provider-specific payload.
* The server updates the created Order with `custom_order_id = <provider_collect_request_id>` when provider returns it. That enables webhook mapping.

---

### Webhook

* `POST /webhook` — receives provider callbacks, logs payload, upserts `OrderStatus`, updates `Order`

PowerShell test (use an actual Order \_id as collect\_id or provider collect id):

```powershell
curl -X POST "http://localhost:3000/webhook" `
  -H "Content-Type: application/json" `
  -d '{
    "status":200,
    "order_info": {
      "order_id":"<collect_id_or_custom_order_id>/TXN-001",
      "order_amount":100,
      "transaction_amount":100,
      "gateway":"PhonePe",
      "bank_reference":"BNKREF",
      "status":"success",
      "payment_mode":"upi",
      "payemnt_details":"success@ybl",
      "payment_time":"2025-04-23T08:14:21.945+00:00"
    }
  }'
```

---

### Transactions (aggregation)

* `GET /transactions` — aggregated list (combines OrderStatus + Order)

  * Query params: `page`, `limit`, `status`, `schoolId`, `sort`, `order`
  * Example: `?page=1&limit=20&sort=payment_time&order=desc`

* `GET /transactions/school/:schoolId` — transactions for a school

* `GET /transaction-status/:custom_order_id` — check transaction status by `custom_order_id`

PowerShell examples:

```powershell
curl -X GET "http://localhost:3000/transactions?page=1&limit=10&sort=payment_time&order=desc" `
  -H "Authorization: Bearer <JWT>"
```

---

### Admin: Webhook logs

* `GET /admin/webhook-logs` — paginated list of webhook logs (protected)

  * Query params: `page`, `limit`, `processed` (true/false)

Example:

```powershell
curl -X GET "http://localhost:3000/admin/webhook-logs?page=1&limit=20&processed=false" `
  -H "Authorization: Bearer <JWT>"
```

---

## Database indexes (important)

* `orders`: indexes on `school_id`, `custom_order_id` (unique sparse), `transaction_id`
* `order_statuses`: indexes on `collect_id`, `transaction_id`, `payment_time`
* `webhooklogs`: index on `{ processed: 1, createdAt: -1 }`

Mongoose schemas create these indexes at app start. If you changed schema fields, ensure you rebuild indexes in Atlas if necessary.

---

## Deployment notes

* Use environment variables on the host (do not commit `.env`).
* For quick hosting you can use Render / Heroku (backend) and Vercel / Netlify (frontend).
* Ensure MongoDB Atlas allows the host IP (or use VPC peering). Add production `JWT_SECRET` and secure payment keys.

---

## Postman collection

* You can create a Postman collection by importing cURL commands or use the exported `postman_collection.json` (if you add one). Include examples for: register, login, create-order, create-payment, webhook (simulation), transactions, admin logs.

---

## What's left (checklist)

* [ ] Final provider integration tests (use provider sandbox)
* [ ] README polishing (this file)
* [ ] Postman collection JSON file (optional but recommended)
* [ ] Frontend (React + Vite + Tailwind) scaffold & implementation
* [ ] Deployment to cloud + CI settings

---

## Current completion estimate

* **Backend:** \~95–97% (small remaining polish, docs, deployment)
* **Frontend:** 0% (not started)
* **Overall:** \~70–75%

---

If you want I can now **scaffold the frontend** (Vite + React + Tailwind) and create the Transactions dashboard pages (paginated table + filters). Say `yes` and I’ll generate the scaffold and key components next.
