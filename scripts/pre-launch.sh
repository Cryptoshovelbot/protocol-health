#!/bin/bash

# Pre-Launch Safety Checklist
# Run this before EVERY deployment!

echo "🚀 PRE-LAUNCH SAFETY CHECKLIST"
echo "=============================="
echo ""

ERRORS=0
WARNINGS=0

# Color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Function to check condition
check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        ERRORS=$((ERRORS + 1))
    fi
}

warn() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${YELLOW}⚠️  $2${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
}

echo "1️⃣  CHECKING ENVIRONMENT VARIABLES..."
echo "-----------------------------------"

# Check .env.local exists
[ -f ".env.local" ]
check $? ".env.local file exists"

# Check critical env vars are set
if [ -f ".env.local" ]; then
    source .env.local
    
    [ ! -z "$NEXT_PUBLIC_SUPABASE_URL" ]
    check $? "SUPABASE_URL is set"
    
    [ ! -z "$STRIPE_SECRET_KEY" ]
    check $? "STRIPE_SECRET_KEY is set"
    
    [ ! -z "$CRON_SECRET" ]
    check $? "CRON_SECRET is set"
    
    # Check CRON_SECRET is strong
    if [ ${#CRON_SECRET} -lt 12 ]; then
        echo -e "${RED}❌ CRON_SECRET is too short (min 12 chars)${NC}"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✅ CRON_SECRET is strong enough${NC}"
    fi
    
    # Check we're not using test keys in production
    if [ "$NODE_ENV" = "production" ]; then
        [[ "$STRIPE_SECRET_KEY" != sk_test_* ]]
        check $? "Using LIVE Stripe keys (not test)"
    fi
fi

echo ""
echo "2️⃣  CHECKING SECURITY..."
echo "----------------------"

# Check .gitignore exists and contains .env
[ -f ".gitignore" ]
check $? ".gitignore exists"

grep -q "\.env" .gitignore 2>/dev/null
check $? ".env files are in .gitignore"

# Check for exposed secrets in code
echo "Scanning for exposed secrets..."
EXPOSED=$(grep -r "sk_live\|pk_live\|eyJ" --include="*.ts" --include="*.tsx" --include="*.js" . 2>/dev/null | wc -l)
if [ $EXPOSED -gt 0 ]; then
    echo -e "${RED}❌ Found possible exposed secrets in code!${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ No exposed secrets found${NC}"
fi

echo ""
echo "3️⃣  CHECKING DEPENDENCIES..."
echo "--------------------------"

# Check for vulnerabilities
echo "Running security audit..."
npm audit --production 2>/dev/null | grep -q "found 0 vulnerabilities"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ No known vulnerabilities${NC}"
else
    VULNS=$(npm audit --production 2>/dev/null | grep "found" | head -1)
    echo -e "${YELLOW}⚠️  $VULNS${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check package-lock exists
[ -f "package-lock.json" ]
check $? "package-lock.json exists"

echo ""
echo "4️⃣  CHECKING BUILD..."
echo "-------------------"

# Try to build
echo "Testing build..."
npm run build > /dev/null 2>&1
check $? "Build succeeds"

# Check build output exists
[ -d ".next" ]
check $? "Build output exists"

echo ""
echo "5️⃣  CHECKING DATABASE..."
echo "----------------------"

# Check if we can connect to Supabase
if [ ! -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/" > /dev/null 2>&1
    check $? "Can connect to Supabase"
fi

# Check for backup
BACKUPS=$(find ./backups -name "*.sql" -mtime -7 2>/dev/null | wc -l)
if [ $BACKUPS -gt 0 ]; then
    echo -e "${GREEN}✅ Recent backup found (< 7 days)${NC}"
else
    echo -e "${YELLOW}⚠️  No recent backup found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "6️⃣  CHECKING MONITORING..."
echo "-----------------------"

# Check Sentry config
grep -q "SENTRY_DSN" .env.local 2>/dev/null
warn $? "Sentry configured (recommended)"

# Check if health endpoint works
npm run dev > /dev/null 2>&1 &
DEV_PID=$!
sleep 5
curl -s http://localhost:3000/api/health > /dev/null 2>&1
warn $? "Health endpoint responding"
kill $DEV_PID 2>/dev/null

echo ""
echo "7️⃣  CHECKING STRIPE..."
echo "--------------------"

# Check Stripe webhook endpoint is configured
if [ ! -z "$STRIPE_WEBHOOK_SECRET" ]; then
    echo -e "${GREEN}✅ Stripe webhook secret configured${NC}"
else
    echo -e "${RED}❌ Stripe webhook secret missing${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "8️⃣  FINAL CHECKS..."
echo "-----------------"

# Check for console.logs in production code
CONSOLE_LOGS=$(grep -r "console.log" --include="*.ts" --include="*.tsx" ./app ./lib ./components 2>/dev/null | wc -l)
if [ $CONSOLE_LOGS -gt 10 ]; then
    echo -e "${YELLOW}⚠️  Found $CONSOLE_LOGS console.log statements${NC}"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✅ Minimal console.log usage${NC}"
fi

# Check for TODO comments
TODOS=$(grep -r "TODO\|FIXME\|XXX" --include="*.ts" --include="*.tsx" . 2>/dev/null | wc -l)
if [ $TODOS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found $TODOS TODO/FIXME comments${NC}"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✅ No TODO comments${NC}"
fi

echo ""
echo "=============================="
echo "📊 RESULTS:"
echo "=============================="

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}❌ FAILED: $ERRORS critical errors found${NC}"
    echo -e "${RED}DO NOT DEPLOY! Fix errors first.${NC}"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  PASSED WITH WARNINGS: $WARNINGS warnings${NC}"
    echo "You can deploy, but consider fixing warnings."
    exit 0
else
    echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
    echo "Ready to deploy! 🚀"
    exit 0
fi
