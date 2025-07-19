#!/bin/bash

# Script to sync environment variables from .env file to Render
# Usage: ./sync-env.sh [SERVICE_ID]

set -e

ENV_FILE="config/.env"
SERVICE_ID="$1"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE not found"
    exit 1
fi

# If no service ID provided, try to get it
if [ -z "$SERVICE_ID" ]; then
    echo "No service ID provided. Getting list of services..."
    render services list
    
    echo ""
    echo "Please provide your service ID:"
    read -p "Service ID: " SERVICE_ID
fi

if [ -z "$SERVICE_ID" ]; then
    echo "Error: Service ID is required"
    exit 1
fi

echo "Reading environment variables from $ENV_FILE..."
echo "Service ID: $SERVICE_ID"
echo ""

# Read .env file and set each variable
while IFS='=' read -r key value; do
    # Skip empty lines and comments
    if [[ -n "$key" && ! "$key" =~ ^[[:space:]]*# ]]; then
        # Remove leading/trailing whitespace
        key=$(echo "$key" | xargs)
        value=$(echo "$value" | xargs)
        
        if [[ -n "$key" && -n "$value" ]]; then
            echo "Setting $key..."
            render env set "$key"="$value" --service-id "$SERVICE_ID"
        fi
    fi
done < "$ENV_FILE"

echo ""
echo "Environment variables updated successfully!" 