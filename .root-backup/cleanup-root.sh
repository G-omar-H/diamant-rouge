#!/bin/bash

# Create backup directory
mkdir -p root-backup

# Move configuration files to backup
mv tsconfig.json root-backup/
mv package.json root-backup/
mv package-lock.json root-backup/
mv next.config.js root-backup/
mv vercel.json root-backup/

# Move any remaining important files
[ -d "pages" ] && mv pages root-backup/
[ -d "types" ] && mv types root-backup/
[ -d "assets" ] && mv assets root-backup/

# Create a new package.json that redirects to the main project
echo '{
  "name": "diamant-rouge-redirect",
  "private": true,
  "workspaces": ["diamant-rouge"],
  "scripts": {
    "dev": "cd diamant-rouge && npm run dev",
    "build": "cd diamant-rouge && npm run build",
    "start": "cd diamant-rouge && npm run start"
  }
}' > package.json

# Update .gitignore to include backup directory
echo "root-backup/" >> .gitignore

echo "Cleanup complete! The original files have been backed up to root-backup/"
echo "The project is now properly configured to work from the diamant-rouge directory"
echo "You can now run 'npm install' and 'npm run dev' from either the root or diamant-rouge directory" 