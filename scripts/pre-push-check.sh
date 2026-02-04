#!/bin/bash
# scripts/pre-push-check.sh

echo "🔒 Running pre-push security checks..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track if any checks fail
CHECKS_FAILED=0

echo ""
echo "📝 Step 1: Checking for .env files..."
if git ls-files | grep -E '\.env$|\.env\..*' | grep -v '.env.example'; then
    echo -e "${RED}❌ ERROR: .env files found in git!${NC}"
    echo "   Run: git rm --cached .env"
    CHECKS_FAILED=1
else
    echo -e "${GREEN}✅ No .env files in git${NC}"
fi

echo "🔑 Step 2: Scanning for potential secrets..."
# Check for common secret patterns (API keys, AWS, Slack, etc.)
if git diff --cached | grep -E -i '(api[_-]?key|secret[_-]?key|password|private[_-]?key|access[_-]?token|auth[_-]?token|aws[_-]?secret|slack[_-]?token|stripe[_-]?key).*=.*["\047][A-Za-z0-9+/=]{16,}["\047]'; then
    echo -e "${RED}❌ ERROR: Potential secrets found in staged files!${NC}"
    echo "   Review your changes and move secrets to .env"
    CHECKS_FAILED=1
else
    echo -e "${GREEN}✅ No obvious secrets detected${NC}"
fi

echo ""
echo "📦 Step 3: Checking for sensitive files..."
SENSITIVE_PATTERNS=(
    "secrets.json"
    "credentials.json"
    "*.pem"
    "*.key"
    "*.cert"
    "firebase-adminsdk-*.json"
    "gcloud-key.json"
)

for pattern in "${SENSITIVE_PATTERNS[@]}"; do
    if git ls-files | grep -E "$pattern"; then
        echo -e "${RED}❌ ERROR: Sensitive file pattern found: $pattern${NC}"
        CHECKS_FAILED=1
    fi
done

echo ""
echo "📂 Step 4: Verifying .gitignore..."
if [ ! -f .gitignore ]; then
    echo -e "${RED}❌ ERROR: .gitignore file not found!${NC}"
    CHECKS_FAILED=1
else
    if ! grep -q "^\.env$" .gitignore; then
        echo -e "${RED}❌ ERROR: .env not in .gitignore!${NC}"
        CHECKS_FAILED=1
    else
        echo -e "${GREEN}✅ .gitignore properly configured${NC}"
    fi
fi

echo ""
echo "===================="
if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All security checks passed!${NC}"
    echo "Safe to push 🚀"
    exit 0
else
    echo -e "${RED}❌ Security checks failed!${NC}"
    echo "Please fix the issues above before pushing"
    exit 1
fi
