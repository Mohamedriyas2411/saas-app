@echo off
echo Setting up SaaS Application Database...
echo.

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: PostgreSQL is not installed or not in PATH
    echo Please install PostgreSQL from: https://www.postgresql.org/download/windows/
    echo Then add it to your PATH environment variable
    pause
    exit /b 1
)

echo Creating database and running schema...
psql -U postgres -c "CREATE DATABASE saas_db;" 2>nul
psql -U postgres -d saas_db -f database/schema.sql
psql -U postgres -d saas_db -f database/seed.sql

echo.
echo Database setup complete!
echo Test accounts created:
echo - admin@example.com (password: password123)
echo - user@example.com (password: password123)
echo.
pause
