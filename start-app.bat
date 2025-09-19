@echo off
echo Starting SaaS Application...
echo.

REM Start backend
echo Starting Backend API...
start "Backend API" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 3 /nobreak >nul

REM Start frontend
echo Starting Frontend...
start "Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Application is starting...
echo Backend API: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul
