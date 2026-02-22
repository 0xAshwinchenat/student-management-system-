@echo off
REM Student Management System API - Setup Script for Windows CMD

color 0A
cls

echo.
echo =====================================
echo Student Management API - Setup
echo =====================================
echo.

REM Check Node.js installation
echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo X Node.js not found!
    echo.
    echo Please install Node.js LTS from: https://nodejs.org/
    echo.
    echo After installation, restart Command Prompt and run this script again.
    echo.
    pause
    exit /b 1
)

echo OK Node.js is installed

REM Check if .env exists
echo.
echo [2/4] Checking environment configuration...
if exist .env (
    echo OK .env file exists
) else (
    echo X .env file not found!
    echo.
    echo Creating .env from template...
    if exist .env.example (
        copy .env.example .env
        echo OK .env created
        echo.
        echo IMPORTANT: Update .env with your MongoDB Atlas connection string
        echo Edit: .env
        echo.
    ) else (
        echo X .env.example not found!
        pause
        exit /b 1
    )
)

REM Install dependencies
echo.
echo [3/4] Installing dependencies...
if exist node_modules (
    echo OK Dependencies already installed
) else (
    echo Installing npm packages (this may take a minute)...
    call npm install
    if errorlevel 1 (
        echo X npm install failed!
        pause
        exit /b 1
    )
    echo OK Dependencies installed
)

REM Build project
echo.
echo [4/4] Building project...
call npm run build
if errorlevel 1 (
    echo X Build failed!
    pause
    exit /b 1
)
echo OK Build successful

REM Summary
echo.
echo =====================================
echo Setup Complete - Ready to Run!
echo =====================================
echo.
echo Run development server:
echo   npm run dev
echo.
echo Or production build:
echo   npm start
echo.
echo Test the API:
echo   curl http://localhost:3000/health
echo.
pause
