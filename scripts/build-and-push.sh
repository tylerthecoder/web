#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define variables
DOCKER_USERNAME="tylerthecoder"
WEB_IMAGE_NAME="tylertracydotcom-webui"
API_IMAGE_NAME="tylertracydotcom-api"
TAG="latest"

# Build the Docker image
echo "Building Docker image..."
docker build --target webui -t $DOCKER_USERNAME/$WEB_IMAGE_NAME:$TAG .
docker build --target api -t $DOCKER_USERNAME/$API_IMAGE_NAME:$TAG .

# Push the image to Docker Hub
echo "Pushing image to Docker Hub..."
docker push $DOCKER_USERNAME/$WEB_IMAGE_NAME:$TAG
docker push $DOCKER_USERNAME/$API_IMAGE_NAME:$TAG

echo "Build and push completed successfully!"
