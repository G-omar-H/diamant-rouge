#!/bin/bash

# Script to run the application with local database settings

# Temporarily backup the production .env file
if [ -f .env ]; then
    echo "Backing up production .env file..."
    mv .env .env.production.backup
fi

# Create a local .env file for development
echo "Creating local .env file..."
cat > .env << EOF
# Local development environment
DATABASE_URL="postgresql://diamantuser:diamantpassword@localhost:5432/diamantrouge"
NEXTAUTH_SECRET="local-development-secret-key"
NEXTAUTH_URL="http://localhost:3000"
EOF

# Create Prisma client if needed
echo "Generating Prisma client..."
npx prisma generate

# Push the schema directly to the database (without migrations)
echo "Creating database tables..."
npx prisma db push

# Seed the database with the project's original seed file
echo "Seeding database with seed-final.js..."
node prisma/seed-final.js || {
    echo "Main seeding had errors. Running appointment fix..."
    node prisma/local-seed-fix.js
}

# Start the development server
echo "Starting the Next.js development server..."
echo "The site should be available at http://localhost:3000"
npm run dev

# When the server stops (Ctrl+C), restore the original .env file
cleanup() {
    echo "Restoring production .env file..."
    if [ -f .env.production.backup ]; then
        mv .env.production.backup .env
    fi
    exit 0
}

# Set up trap to catch Ctrl+C (SIGINT)
trap cleanup SIGINT

# Wait for server to exit
wait 