#!/bin/bash

# Deployment Verification Script
# Run this before deploying to ensure everything is ready

echo "🚀 Starting Deployment Verification..."
echo ""

# Check Node version
echo "📦 Checking Node.js version..."
node --version
echo ""

# Check pnpm
echo "📦 Checking pnpm..."
pnpm --version
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
pnpm install
echo ""

# Run linter
echo "🔍 Running linter..."
npm run lint
LINT_STATUS=$?
echo ""

# Build the project
echo "🏗️  Building for production..."
npm run build
BUILD_STATUS=$?
echo ""

# Check results
if [ $LINT_STATUS -eq 0 ] && [ $BUILD_STATUS -eq 0 ]; then
    echo "✅ All checks passed! Ready for deployment."
    echo ""
    echo "📝 Next steps:"
    echo "1. git add ."
    echo "2. git commit -m 'Ready for production deployment'"
    echo "3. git push origin main"
    echo "4. Deploy on Vercel or your hosting platform"
else
    echo "❌ Some checks failed. Please fix the issues above."
    exit 1
fi
