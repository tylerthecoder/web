#!/bin/bash

git pull

yarn --frozen-lockfile

# Set node env to prod
export NODE_ENV=production

yarn api build

NEXT_PUBLIC_API_URL=https://api.tylertracy.com yarn web build
cp -r ./apps/web/public ./apps/web/standalone/public
cp -r ./apps/web/.next/static ./apps/web/standalone/.next/static


pm2 kill
pm2 start pm2-ecosystem.config.js

# Autostart process on boot
pm2 startup systemd
pm2 save
