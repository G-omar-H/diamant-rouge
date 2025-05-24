#!/bin/bash

# Create backup directory for safety
mkdir -p .config-backup

# Backup and remove conflicting configuration files
echo "Backing up and removing conflicting configuration files..."

# TypeScript configuration
if [ -f "tsconfig.json" ]; then
    mv tsconfig.json .config-backup/
    echo "✓ Removed root tsconfig.json"
fi

# Next.js configuration
if [ -f "next.config.js" ]; then
    mv next.config.js .config-backup/
    echo "✓ Removed root next.config.js"
fi

# Add backup directory to .gitignore
if ! grep -q "^.config-backup/" .gitignore; then
    echo ".config-backup/" >> .gitignore
    echo "✓ Added .config-backup to .gitignore"
fi

echo ""
echo "Done! Conflicting configuration files have been moved to .config-backup/"
echo "The project will now use only the configurations from the diamant-rouge directory" 