#!/bin/bash

# ============================================
# LogLens Production Readiness Verification
# ============================================
# Run this script before deploying to production
# ============================================

set -e  # Exit on error

echo "🔍 LogLens Production Readiness Check"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to print success
success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function to print error
error() {
    echo -e "${RED}✗${NC} $1"
    ((ERRORS++))
}

# Function to print warning
warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

echo "1. Checking Environment Configuration..."
echo "----------------------------------------"

# Check if .env.local exists
if [ -f "frontend/.env.local" ]; then
    success ".env.local exists"
    
    # Check for required variables
    if grep -q "WORKOS_CLIENT_ID=" frontend/.env.local; then
        success "WORKOS_CLIENT_ID is set"
    else
        error "WORKOS_CLIENT_ID is missing"
    fi
    
    if grep -q "WORKOS_API_KEY=" frontend/.env.local; then
        success "WORKOS_API_KEY is set"
    else
        error "WORKOS_API_KEY is missing"
    fi
    
    if grep -q "WORKOS_REDIRECT_URI=" frontend/.env.local; then
        success "WORKOS_REDIRECT_URI is set"
    else
        error "WORKOS_REDIRECT_URI is missing"
    fi
    
    if grep -q "WORKOS_COOKIE_PASSWORD=" frontend/.env.local; then
        success "WORKOS_COOKIE_PASSWORD is set"
    else
        error "WORKOS_COOKIE_PASSWORD is missing"
    fi
else
    error ".env.local not found - copy from .env.example"
fi

echo ""
echo "2. Checking Git Configuration..."
echo "----------------------------------------"

# Check if .env files are gitignored
if git check-ignore -q frontend/.env.local 2>/dev/null; then
    success ".env.local is gitignored"
else
    warning ".env.local might not be gitignored"
fi

# Check if .env.local is committed
if git ls-files --error-unmatch frontend/.env.local 2>/dev/null; then
    error ".env.local is committed to Git! Remove it immediately!"
else
    success ".env.local is not committed to Git"
fi

echo ""
echo "3. Checking Dependencies..."
echo "----------------------------------------"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    success "Dependencies installed"
else
    error "Dependencies not installed - run 'npm install'"
fi

# Check for security vulnerabilities
echo "   Running npm audit..."
if npm audit --audit-level=high 2>&1 | grep -q "found 0 vulnerabilities"; then
    success "No high-severity vulnerabilities found"
else
    warning "Security vulnerabilities detected - run 'npm audit' for details"
fi

echo ""
echo "4. Checking TypeScript..."
echo "----------------------------------------"

cd frontend

# Run TypeScript compiler
if npm run type-check > /dev/null 2>&1; then
    success "TypeScript compilation passed"
else
    error "TypeScript errors found - run 'npm run type-check'"
fi

echo ""
echo "5. Checking Linting..."
echo "----------------------------------------"

# Run ESLint
if npm run lint > /dev/null 2>&1; then
    success "ESLint passed"
else
    warning "ESLint warnings/errors found - run 'npm run lint'"
fi

echo ""
echo "6. Testing Production Build..."
echo "----------------------------------------"

# Test build
if npm run build > /dev/null 2>&1; then
    success "Production build succeeded"
else
    error "Production build failed - run 'npm run build' for details"
fi

cd ..

echo ""
echo "7. Checking Documentation..."
echo "----------------------------------------"

# Check for required documentation files
if [ -f "README.md" ]; then
    success "README.md exists"
else
    error "README.md is missing"
fi

if [ -f "SECURITY.md" ]; then
    success "SECURITY.md exists"
else
    warning "SECURITY.md is missing"
fi

if [ -f "DEPLOYMENT_CHECKLIST.md" ]; then
    success "DEPLOYMENT_CHECKLIST.md exists"
else
    warning "DEPLOYMENT_CHECKLIST.md is missing"
fi

if [ -f "ARCHITECTURE.md" ]; then
    success "ARCHITECTURE.md exists"
else
    warning "ARCHITECTURE.md is missing"
fi

if [ -f ".env.example" ]; then
    success ".env.example exists"
else
    error ".env.example is missing"
fi

echo ""
echo "8. Checking Configuration Files..."
echo "----------------------------------------"

# Check next.config.mjs
if [ -f "frontend/next.config.mjs" ]; then
    success "next.config.mjs exists"
    
    # Check if security headers are configured
    if grep -q "Strict-Transport-Security" frontend/next.config.mjs; then
        success "Security headers configured"
    else
        warning "Security headers not configured"
    fi
else
    error "next.config.mjs is missing"
fi

# Check .gitignore
if [ -f ".gitignore" ]; then
    success ".gitignore exists"
    
    # Check if .env files are ignored
    if grep -q ".env" .gitignore; then
        success ".env files are in .gitignore"
    else
        error ".env files not in .gitignore"
    fi
else
    error ".gitignore is missing"
fi

echo ""
echo "======================================"
echo "📊 Summary"
echo "======================================"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "🚀 Your application is ready for production deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Review DEPLOYMENT_CHECKLIST.md"
    echo "2. Set up environment variables in your deployment platform"
    echo "3. Deploy to Vercel, Netlify, or your preferred platform"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
    echo ""
    echo "Your application can be deployed, but please review the warnings above."
    exit 0
else
    echo -e "${RED}✗ $ERRORS error(s) found${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
    fi
    echo ""
    echo "Please fix the errors above before deploying to production."
    exit 1
fi
