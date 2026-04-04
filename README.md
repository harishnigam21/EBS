# 📅 Event Booking System API

A production-ready backend built with **TypeScript**, **Express**, **Prisma**, and **MySQL**. This system handles event creation, secure bookings, and attendance tracking with a focus on data integrity, security, and scalability.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (v18+)
- **Language:** TypeScript
- **Database:** MySQL
- **ORM:** Prisma
- **Documentation:** Swagger UI (OpenAPI 3.0)
- **Validation:** Zod
- **Security:** JWT (JSON Web Tokens) & Role-Based Access Control

---

## 🚀 Getting Started (The Easy Way: Docker)

The fastest way to run this project and the database together is using Docker Compose.

1.  **Ensure Docker is installed** on your machine.
2.  **Run the following command** in the project root:
    ```bash
    docker-compose up --build
    ```
3.  The API will be available at
    local : 'http://localhost:3000'
    live : 'https://api-ebc.vercel.app'
4.  The interactive documentation will be at
    local : 'http://localhost:3000/api-docs'
    live: 'https://api-ebc.vercel.app/api-docs'

---

## 💻 Local Development Setup (Manual)

If you prefer to run it outside of Docker:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Environment Variables:** Create a `.env` file in the root:
    ```env
    DATABASE_URL="mysql://root:password@localhost:3306/ebs_db"
    ACCESS_TOKEN_KEY="secret_key"
    PORT=3000
    ```
3.  **Database Migration:**
    ```bash
    npx prisma migrate dev --name init
    ```
4.  **Start Server:**
    ```bash
    npm run dev
    ```

---

## 🔐 Key Implementation Details

### **1. Handling Race Conditions**

Used **Prisma Transactions (`$transaction`)** in the `markAttendance` and `bookTicket` logic. This ensures that:

- Checking ticket availability and decrementing the count happens atomically.
- Double check-ins are impossible, even if two requests hit the server at the same millisecond.
- Data consistency is maintained across the `Booking` and `EventAttendance` tables.

### **2. Role-Based Access Control (RBAC)**

Implemented a custom middleware to distinguish between `USER` and `ADMIN` roles stored in the JWT payload.

- **Users:** Can view events, book tickets, and see their own history.
- **Admins:** Can create events and access administrative oversight endpoints accept booking ticket for users.

### **3. API Documentation**

Fully documented using **Swagger**.

- Visit `/api-docs` to test the endpoints.
- Use the **Authorize** button to paste your JWT token (obtained from `/api/auth/login`) to access protected routes.

---

## 📂 Project Structure

```text
src/
├── controllers/    # Request logic (Auth, Booking, Event)
├── middlewares/    # Auth, Admin check, and Zod validation
├── routes/         # API Route definitions (Admin & User sections)
├── validations/    # Zod schemas for strict input safety
├── prisma/         # Database schema and migrations
└── app.ts          # Server configuration & middleware mounting
```
