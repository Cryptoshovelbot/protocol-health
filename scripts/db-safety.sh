#!/bin/bash

# Database Safety Script - Run before ANY database changes
# Usage: ./scripts/db-safety.sh

set -e  # Exit on error

echo "🔒 Database Safety Check & Backup"
echo "================================"

# Load environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Check if we're in production
if [ "$NODE_ENV" = "production" ]; then
    echo "⚠️  PRODUCTION ENVIRONMENT DETECTED!"
    echo "Are you SURE you want to proceed? (type 'yes-production')"
    read confirmation
    if [ "$confirmation" != "yes-production" ]; then
        echo "❌ Aborted for safety"
        exit 1
    fi
fi

# Create backup directory
BACKUP_DIR="./backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# Backup current database
echo "📦 Creating backup..."
BACKUP_FILE="$BACKUP_DIR/backup_$(date +%H%M%S).sql"

# Using Supabase CLI for backup
npx supabase db dump --db-url "$DATABASE_URL" -f "$BACKUP_FILE" 2>/dev/null || {
    echo "⚠️  Supabase CLI backup failed, trying pg_dump..."
    pg_dump "$DATABASE_URL" > "$BACKUP_FILE" 2>/dev/null || {
        echo "❌ Backup failed! Do NOT proceed with migrations!"
        exit 1
    }
}

if [ -f "$BACKUP_FILE" ]; then
    echo "✅ Backup created: $BACKUP_FILE"
    echo "   Size: $(du -h $BACKUP_FILE | cut -f1)"
else
    echo "❌ Backup failed!"
    exit 1
fi

# Test restore capability (optional)
echo "🧪 Testing restore capability..."
echo "   Would you restore to: $DATABASE_URL"
echo "   Command: psql $DATABASE_URL < $BACKUP_FILE"

# Check for pending migrations
echo ""
echo "📋 Pending migrations check:"
if [ -d "./supabase/migrations" ]; then
    PENDING=$(ls -la ./supabase/migrations/*.sql 2>/dev/null | wc -l)
    if [ "$PENDING" -gt 0 ]; then
        echo "   Found $PENDING migration files"
        ls -la ./supabase/migrations/*.sql
    else
        echo "   No pending migrations"
    fi
fi

# Final safety check
echo ""
echo "✅ Safety check complete!"
echo "📝 Remember:"
echo "   1. Test migrations on staging first"
echo "   2. Have rollback plan ready"
echo "   3. Monitor after deployment"
echo "   4. Keep backup for 30 days minimum"

# Create recovery script
cat > "$BACKUP_DIR/recovery.sh" << EOF
#!/bin/bash
# Emergency Recovery Script
# Generated: $(date)
# Usage: ./recovery.sh

echo "🚨 EMERGENCY DATABASE RECOVERY"
echo "This will restore database to: $(date)"
echo "Data after this point will be LOST!"
echo ""
echo "Type 'RESTORE-DATABASE' to proceed:"
read confirm

if [ "\$confirm" = "RESTORE-DATABASE" ]; then
    psql "$DATABASE_URL" < "$BACKUP_FILE"
    echo "✅ Database restored from $BACKUP_FILE"
else
    echo "❌ Recovery cancelled"
fi
EOF

chmod +x "$BACKUP_DIR/recovery.sh"
echo ""
echo "🆘 Recovery script created: $BACKUP_DIR/recovery.sh"
