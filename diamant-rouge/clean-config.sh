#!/bin/bash

# Clean up duplicate config files
echo "Cleaning up duplicate configuration files..."

# Remove next.config.ts (keeping the more complete next.config.js)
echo "Removing next.config.ts..."
rm -f next.config.ts

# Remove tailwind.config.ts (keeping the more complete tailwind.config.js)
echo "Removing tailwind.config.ts..."
rm -f tailwind.config.ts

# Remove postcss.config.mjs (keeping postcss.config.js)
echo "Removing postcss.config.mjs..."
rm -f postcss.config.mjs

echo "Cleanup complete!" 