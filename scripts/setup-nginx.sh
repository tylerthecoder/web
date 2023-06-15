#!/bin/bash

# Path to Nginx configuration directory
nginx_conf_dir="/etc/nginx/conf.d"

# Source path of the Nginx configuration file
config_file_path="../configs/app-redirect.conf"

# Destination path to copy the configuration file
destination_path="${nginx_conf_dir}/app-redirect.conf"

# Copy the Nginx configuration file to the appropriate location
cp "${config_file_path}" "${destination_path}"

# Restart Nginx
service nginx restart

echo "Nginx configuration file copied and Nginx restarted successfully."
