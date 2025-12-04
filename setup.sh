#!/bin/bash

echo "🚀 Setting up Reel-Ed..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🗄️  Setting up database..."

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed demo data
npm run db:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎉 You can now run: npm run dev"
echo "📖 Then open: http://localhost:3000"
echo ""
echo "📚 Demo credentials:"
echo "   Creator: creator@reeled.com"
echo "   Learner: learner@reeled.com"
echo ""
