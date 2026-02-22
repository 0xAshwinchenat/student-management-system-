#!/bin/bash

# Student Management System API - Setup Script for macOS/Linux

echo ""
echo "======================================"
echo "Student Management API - Setup"
echo "======================================"
echo ""

# Check Node.js installation
echo "[1/5] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js not found!"
    echo ""
    echo "Please install Node.js LTS from: https://nodejs.org/"
    echo "Or use Homebrew: brew install node"
    echo ""
    echo "After installation, restart your terminal and run this script again."
    exit 1
fi

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
echo "✓ Node.js found: $NODE_VERSION"
echo "✓ npm found: $NPM_VERSION"

# Check if .env exists
echo ""
echo "[2/5] Checking environment configuration..."
if [ -f .env ]; then
    echo "✓ .env file exists"
else
    echo "✗ .env file not found!"
    echo ""
    echo "Creating .env from template..."
    
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✓ Created .env file"
        echo ""
        echo "⚠ IMPORTANT: Update .env with your MongoDB connection string:"
        echo "  Edit: .env"
        echo "  Set MONGODB_URI to your MongoDB Atlas connection string"
        echo ""
    else
        echo "✗ .env.example not found!"
        exit 1
    fi
fi

# Check if node_modules exists
echo ""
echo "[3/5] Checking dependencies..."
if [ -d node_modules ]; then
    echo "✓ Dependencies already installed"
else
    echo "Installing dependencies (this may take a minute)..."
    npm install
    echo "✓ Dependencies installed"
fi

# Build the project
echo ""
echo "[4/5] Building TypeScript..."
npm run build
if [ $? -ne 0 ]; then
    echo "✗ Build failed!"
    exit 1
fi
echo "✓ Build successful"

# Summary
echo ""
echo "[5/5] Setup Complete!"
echo ""
echo "======================================"
echo "✓ Ready to Start Development Server"
echo "======================================"
echo ""
echo "Run development server:"
echo "  npm run dev"
echo ""
echo "Or run production build:"
echo "  npm start"
echo ""
echo "Test the API:"
echo "  curl http://localhost:3000/health"
echo ""
