#!/bin/bash
cd ~/dev/tgtapi

set -e
set -x

yarn

yarn build

# Add yarn global to path
PATH="$HOME/.yarn/bin:$PATH"

pm2 kill

PORT=3000 pm2 start -f dist/main.js --name "tgtapi" --update-env

# Autostart process on boot
pm2 startup systemd
pm2 save
