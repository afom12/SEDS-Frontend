# SEDS Backend Environment Setup Script
# This script helps you create the .env file

Write-Host "=== SEDS Backend Environment Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if .env already exists
if (Test-Path .env) {
    Write-Host "⚠️  .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Setup cancelled." -ForegroundColor Yellow
        exit
    }
}

Write-Host "Please provide the following information:" -ForegroundColor Green
Write-Host ""

# Database configuration
Write-Host "📊 Database Configuration" -ForegroundColor Cyan
$dbUser = Read-Host "PostgreSQL Username (default: postgres)"
if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = "postgres" }

$dbPassword = Read-Host "PostgreSQL Password" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))

$dbName = Read-Host "Database Name (default: seds_db)"
if ([string]::IsNullOrWhiteSpace($dbName)) { $dbName = "seds_db" }

$dbHost = Read-Host "Database Host (default: localhost)"
if ([string]::IsNullOrWhiteSpace($dbHost)) { $dbHost = "localhost" }

$dbPort = Read-Host "Database Port (default: 5432)"
if ([string]::IsNullOrWhiteSpace($dbPort)) { $dbPort = "5432" }

# Generate JWT secrets
Write-Host ""
Write-Host "🔐 Generating JWT Secrets..." -ForegroundColor Cyan
$jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
$jwtRefreshSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Create .env file content
$envContent = @"
# Database
DATABASE_URL="postgresql://$dbUser`:$dbPasswordPlain@$dbHost`:$dbPort/$dbName?schema=public"

# JWT Secrets
JWT_SECRET="$jwtSecret"
JWT_REFRESH_SECRET="$jwtRefreshSecret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx

# Payment Gateways (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Chapa (Test Mode)
CHAPA_SECRET_KEY=CHASECK_TEST_your_chapa_secret_key
CHAPA_PUBLIC_KEY=CHAPUBK_TEST_your_chapa_public_key

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
"@

# Write .env file
$envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline

Write-Host ""
Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure PostgreSQL is running" -ForegroundColor White
Write-Host "2. Create the database: createdb $dbName" -ForegroundColor White
Write-Host "3. Run migrations: npm run db:migrate" -ForegroundColor White
Write-Host "4. Seed database: npm run db:seed" -ForegroundColor White
Write-Host "5. Start server: npm run dev" -ForegroundColor White
Write-Host ""

