# NextJS E-Commerce

A complete, production-ready E-commerce web application built from scratch with Next.js 16+, TypeScript, Tailwind CSS, Prisma, and MySQL.

## 1. Prerequisites

- Node.js (v18 or newer recommended)
- MySQL Server (v8 or newer recommended)
- pnpm

## 2. Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd new_project
   ```

2. Install dependencies (Requires **pnpm**, as npm has I/O issues in this environment):
   ```bash
   pnpm install
   ```

## 3. Database Configuration

You need to create a MySQL database for the application.

1. Create a database in MySQL (e.g., `ecommerce_db`).
2. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and configure your `DATABASE_URL`. The format is:
   ```env
   DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME"
   ```
   *Example for local development:* `DATABASE_URL="mysql://root:@localhost:3306/ecommerce_db"`

4. Set your `JWT_SECRET` in `.env` to a secure random string.

## 4. Prisma Setup & Migration

Generate the Prisma Client and sync your database schema:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to the database
npm run db:push

# (Optional) Seed the database with dummy data and admin user
npm run db:seed
```

### Default Admin Credentials (from Seed)
- **Email:** admin@example.com
- **Password:** admin123

*Note: Change these immediately in a production environment.*

## 5. Development Server

Start the Next.js development server:

```bash
npm run dev
```
Access the application at `http://localhost:3000`. 
Supported locales: `/en` for English (LTR) and `/ar` for Arabic (RTL).

## 6. Hostinger Deployment Instructions

This project is built specifically to be compatible with standard Node.js hosting such as Hostinger.

1. **Create MySQL Database on Hostinger:**
   - Go to your Hostinger hPanel -> Databases -> Management.
   - Create a new MySQL database. Note the Database Name, Username, Password, and Host (usually `localhost` or `127.0.0.1` if hosted on the same server).

2. **Configure Environment Variables:**
   - In Hostinger Node.js environment settings (or via a `.env` file in the root directory), set:
     - `DATABASE_URL="mysql://username:password@localhost:3306/database_name"`
     - `JWT_SECRET="your-secure-secret"`

3. **Build the Application:**
   - If building locally before uploading:
     ```bash
     npm run build
     ```
   - If building on Hostinger via SSH:
     ```bash
     npm install
     npm run db:generate
     npm run build
     ```

4. **Database Migration on Hostinger:**
   - Connect via SSH and run:
     ```bash
     npx prisma migrate deploy
     ```
   - Or run `npx prisma db push` if you aren't using migration history.

5. **Running the App:**
   - Set the entry file to `node_modules/next/dist/bin/next` or use a custom `server.js`.
   - Alternatively, start it via package scripts: `npm start`.

## 7. Image Storage
Currently, the image storage system uses the local filesystem (`public/images/`). For larger production deployments on Hostinger, you may periodically backup the `public/images/` directory or switch to a dedicated storage provider (e.g., Cloudinary, S3) by modifying the upload API.

## 8. Backup Procedure
- **Database:** Use `mysqldump` to periodically export your MySQL database.
- **Files:** Backup the `public/images/` folder and your `.env` configuration file.
