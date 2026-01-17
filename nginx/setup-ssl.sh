#!/bin/bash
# SSL Setup Script for app.skuller78.click
# Run this script on EC2 instance

set -e

DOMAIN-A="app.skuller78.click"
DOMAIN-CNAME="www.app.skuller78.click" # Points to the A record
EMAIL="your-email@example.com"  # Change this to your email

echo "Setting up SSL certificate for $DOMAIN..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

# Create certbot directory
mkdir -p /var/www/certbot
chmod -R 755 /var/www/certbot


# Create certificate
echo "Requesting SSL certificate for $DOMAIN..."
certbot certonly --standalone \
    -d $DOMAIN \ # Add A record to AWS Route53
    -d $DOMAIN \ # Add CNAME record to AWS Route53
    --email $EMAIL \ # Add email 
    --agree-tos \
    --non-interactive \
    --preferred-challenges http
