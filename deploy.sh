#!/bin/bash

# Install required packages
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# Install PM2 globally
npm install -g pm2

# Clean previous build
rm -rf .next

# Install dependencies
npm install

# Build the application in production mode
NODE_ENV=production npm run build

# Start the application with PM2
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Set up PM2 to start on system boot
pm2 startup

# Copy Nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/booth.chatflow.id
sudo ln -s /etc/nginx/sites-available/booth.chatflow.id /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Stop Nginx temporarily
sudo systemctl stop nginx

# Obtain SSL certificate using standalone mode
sudo certbot certonly --standalone -d booth.chatflow.id -d www.booth.chatflow.id

# Start Nginx again
sudo systemctl start nginx

# Set up automatic SSL renewal
sudo certbot renew --dry-run

# Verify the application is running
curl -I https://booth.chatflow.id

echo "Deployment completed successfully!" 