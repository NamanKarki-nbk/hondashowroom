# Honda Showroom Management System

A comprehensive Next.js 15 application for managing a Honda dealership, including POS checkout, inventory management, CRM, service scheduling, and accounts/daybook.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18.17.0 or newer)
- **npm** (comes with Node.js) or **yarn** / **pnpm**
- **Git**

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd honda-showroom
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or yarn install / pnpm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   # Database connection (PostgreSQL/Neon)
   DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"

   # Authentication (NextAuth)
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-super-secret-key-for-nextauth"

   # Email Configuration (for sending emails like Insurance requests)
   GMAIL_USER="your-email@gmail.com"
   GMAIL_APP_PASSWORD="your-gmail-app-password"
   ```

4. **Initialize the Database:**
   Generate the Prisma client and push the schema to your database.
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

6. **Access the Application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Built With
- [Next.js 15](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/) (via Neon)
- [NextAuth.js](https://next-auth.js.org/)
- [Lucide Icons](https://lucide.dev/)

## Features
- **Dashboard & Analytics:** Key metrics, charts, and recent activity.
- **POS Checkout:** Full retail/finance/exchange billing with automated receipt generation.
- **Inventory:** Vehicle stock management, transfer logs, purchase invoices, and orders.
- **CRM:** Lead tracking, customer profiles, test rides, and document OCR verification.
- **Service Center:** Booking management, AMC plans, spare parts, and service reminders.
- **Accounts:** Day book (daily cash ledger), due collection, VAT billing, and insurance tracking.
- **Printables:** Professional Undertaking, PDI Checksheet, Cash Receipt, and Invoices.
