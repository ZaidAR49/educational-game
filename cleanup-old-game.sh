#!/bin/bash

# Clean up deprecated static game files
# This script removes the old public/game directory that conflicts with the Next.js route

echo "🧹 Removing deprecated public/game directory..."

if [ -d "public/game" ]; then
    rm -rf public/game/
    echo "✅ Removed public/game/"
    echo ""
    echo "📝 Next steps:"
    echo "1. npm run build"
    echo "2. npm run dev"
    echo "3. Click 'ابدأ اللعبة' button - should now work!"
    echo ""
else
    echo "⚠️ public/game directory not found"
    echo "This is expected if you already removed it"
fi
