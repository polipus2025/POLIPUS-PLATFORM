#!/bin/bash

echo "🔍 POLIPUS PLATFORM HEALTH CHECK"
echo "================================="

# Check TypeScript compilation
echo "📝 Checking TypeScript compilation..."
npm run check

if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation: PASSED"
else
    echo "❌ TypeScript compilation: FAILED"
    echo "⚠️  Fix TypeScript errors before deploying"
    exit 1
fi

# Check if app starts successfully
echo "🚀 Testing app startup..."
timeout 30s npm run dev &
PID=$!

sleep 20

if kill -0 $PID 2>/dev/null; then
    echo "✅ App startup: PASSED"
    kill $PID
else
    echo "❌ App startup: FAILED"
    exit 1
fi

echo "🎉 All health checks passed!"