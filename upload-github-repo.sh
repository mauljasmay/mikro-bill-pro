#!/bin/bash

# GitHub Upload Script
# Ganti variabel berikut:
GITHUB_USERNAME="mauljasmay"
REPO_NAME="mikro-bill-pro"
GITHUB_TOKEN="YOUR_TOKEN"

# Buat repository via API
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{
    \"name\": \"$REPO_NAME\",
    \"description\": \"MikroBill Pro - Complete ISP Billing & Management System with Mikrotik Integration and Xendit Payment Gateway\",
    \"private\": false,
    \"auto_init\": false
  }"

# Tambahkan remote
git remote add origin https://$GITHUB_USERNAME@github.com/$GITHUB_USERNAME/$REPO_NAME.git

# Push ke GitHub
git push -u origin master

echo "Repository berhasil diupload ke GitHub!"
echo "URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"