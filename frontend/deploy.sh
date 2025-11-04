#!/bin/bash

# AWS ECS Deployment Script for Social Media Frontend
# This script demonstrates how environment variables are used in AWS deployment

set -e

# Configuration
AWS_REGION="us-east-1"
ECR_REPO="YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/social-media-frontend"
ECS_CLUSTER="social-media-cluster"
ECS_SERVICE="frontend-service"

echo "🚀 Starting frontend deployment to AWS ECS..."

# 1. Get GraphQL endpoint from AWS Parameter Store
echo "📡 Retrieving GraphQL endpoint from AWS Parameter Store..."
GRAPHQL_ENDPOINT=$(aws ssm get-parameter \
  --name "/social-media/graphql-endpoint" \
  --with-decryption \
  --query 'Parameter.Value' \
  --output text \
  --region $AWS_REGION)

echo "GraphQL Endpoint: $GRAPHQL_ENDPOINT"

# 2. Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO

# 3. Build Docker image with environment variables
echo "🏗️ Building Docker image..."
docker build \
  --build-arg VITE_GRAPHQL_ENDPOINT="$GRAPHQL_ENDPOINT" \
  --build-arg VITE_APP_ENV="production" \
  -t social-media-frontend:latest \
  .

# 4. Tag and push to ECR
echo "📦 Pushing to ECR..."
docker tag social-media-frontend:latest $ECR_REPO:latest
docker push $ECR_REPO:latest

# 5. Update ECS service
echo "🔄 Updating ECS service..."
aws ecs update-service \
  --cluster $ECS_CLUSTER \
  --service $ECS_SERVICE \
  --force-new-deployment \
  --region $AWS_REGION

echo "✅ Deployment initiated! Check ECS console for deployment status."
echo "🌐 Your app will be available at your ALB DNS name once deployment completes."