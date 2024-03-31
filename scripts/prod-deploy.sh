#!/bin/bash

# This script runs on the server that this app is deployed to

# change to the project directory
cd "$(dirname "$0")"
cd ..

yarn --frozen-lockfile

# Set node env to prod
export NODE_ENV=production

NEXT_PUBLIC_API_URL=https://api.tylertracy.com yarn build --no-cache

pm2 kill
pm2 start pm2-ecosystem.config.js

# Autostart process on boot
pm2 startup systemd
pm2 save
