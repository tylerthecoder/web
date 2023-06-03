#!/bin/bash

git pull

yarn --frozen-lockfile

# Set node env to prod
export NODE_ENV=production

yarn web build
cp -r ./apps/web/public ./apps/web/standalone/public
cp -r ./apps/web/.next/static ./apps/web/standalone/.next/static

yarn api build

pm2 start pm2-ecosystem.config.js

