# Quick Setup - Fix Your Current Error

You're getting errors because the `.env` file is missing. Here's how to fix it:

## Step 1: Create .env File

Since you're already in the `backend` directory, run:

```powershell
Copy-Item .env.example .env
```

## Step 2: Edit .env File

Open `.env` in your editor and update these lines:

### Database URL
Find this line:
```
DATABASE_URL="postgresql://user:password@localhost:5432/seds_db?schema=public"
```

Replace with your actual PostgreSQL credentials:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/seds_db?schema=public"
```

**Replace:**
- `YOUR_PASSWORD` - Your PostgreSQL password
- `postgres` - Your PostgreSQL username (if different)
- `seds_db` - Your database name (if different)

### Generate JWT Secrets

Generate two random secrets. In PowerShell, run this twice:

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

Copy the output and replace:
- `JWT_SECRET="your-super-secret-jwt-key-change-in-production"`
- `JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"`

## Step 3: Create Database

Make sure PostgreSQL is running, then create the database:

```powershell
# Option 1: Using psql
psql -U postgres
CREATE DATABASE seds_db;
\q

# Option 2: Using createdb (if available)
createdb seds_db
```

## Step 4: Run Migrations

Now run:

```powershell
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Step 5: Start Server

```powershell
npm run dev
```

## Quick Test

Open a new terminal and test:

```powershell
curl http://localhost:3000/health
```

Should return: `{"status":"ok",...}`

---

## Alternative: Use Setup Script

For easier setup, use the interactive script:

```powershell
.\setup-env.ps1
```

This will ask you questions and create the `.env` file automatically!

