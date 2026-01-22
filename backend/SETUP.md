# Backend Setup Guide

## Quick Setup (Windows PowerShell)

### Option 1: Use Setup Script (Recommended)

```powershell
cd backend
.\setup-env.ps1
```

The script will:
- Ask for your PostgreSQL credentials
- Generate secure JWT secrets
- Create the `.env` file automatically

### Option 2: Manual Setup

1. **Copy the example file:**
   ```powershell
   cd backend
   Copy-Item .env.example .env
   ```

2. **Edit `.env` file** and update:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `JWT_SECRET` - Generate a random 32-character string
   - `JWT_REFRESH_SECRET` - Generate another random 32-character string

3. **Generate JWT secrets** (PowerShell):
   ```powershell
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```
   Run this twice to get two different secrets.

## Database Setup

### 1. Install PostgreSQL
If not installed, download from: https://www.postgresql.org/download/windows/

### 2. Create Database

**Using psql:**
```powershell
psql -U postgres
CREATE DATABASE seds_db;
\q
```

**Or using createdb:**
```powershell
createdb seds_db
```

### 3. Update DATABASE_URL

In your `.env` file, set:
```
DATABASE_URL="postgresql://username:password@localhost:5432/seds_db?schema=public"
```

Replace:
- `username` - Your PostgreSQL username (usually `postgres`)
- `password` - Your PostgreSQL password
- `seds_db` - Your database name

## Run Migrations

```powershell
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Start Server

```powershell
npm run dev
```

Server will run on `http://localhost:3000`

## Troubleshooting

### "Environment variable not found: DATABASE_URL"

- Make sure `.env` file exists in `backend/` folder
- Check that `DATABASE_URL` is set correctly
- Restart your terminal/IDE after creating `.env`

### "Database connection failed"

- Check PostgreSQL is running: `pg_isready` or check Services
- Verify username/password in `DATABASE_URL`
- Make sure database exists: `psql -U postgres -l`

### "Cannot find path .env.example"

The `.env.example` file should now exist. If not:
```powershell
Copy-Item env.example.txt .env.example
```

## Test Connection

```powershell
# Test database connection
psql -U postgres -d seds_db -c "SELECT version();"

# Test backend health
curl http://localhost:3000/health
```

