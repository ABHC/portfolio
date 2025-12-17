#!/bin/bash

# Portfolio deployment script
# To be executed ON THE SERVER
# Located in: ~/projects/portfolio/deploy.sh
# Usage: ./deploy.sh

set -e

# Configuration - simple fixed paths
PUBLIC_REPO_PATH="$HOME/projects/portfolio"
PRIVATE_REPO_PATH="$HOME/projects/portfolio-private-data"
PRIVATE_REPO_URL="git@github.com:ABHC/portfolio-private-data.git"  # Update with your private repo URL

# Colours for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting portfolio deployment...${NC}\n"
echo -e "${BLUE}📂 Public repo: $PUBLIC_REPO_PATH${NC}"
echo -e "${BLUE}📂 Private repo: $PRIVATE_REPO_PATH${NC}\n"

# Navigate to public repository
cd "$PUBLIC_REPO_PATH"

# Pull public repository
echo -e "${YELLOW}📥 Pulling public code...${NC}"
git pull origin main
echo -e "${GREEN}✓ Public code updated${NC}"

# Pull or clone private data repository
if [ ! -d "$PRIVATE_REPO_PATH" ]; then
    echo -e "\n${YELLOW}📦 Cloning private data repository...${NC}"
    git clone "$PRIVATE_REPO_URL" "$PRIVATE_REPO_PATH"
    echo -e "${GREEN}✓ Private repository cloned${NC}"
else
    echo -e "\n${YELLOW}🔄 Updating private data...${NC}"
    cd "$PRIVATE_REPO_PATH"
    git pull origin main
    cd "$PUBLIC_REPO_PATH"
    echo -e "${GREEN}✓ Private data updated${NC}"
fi

# Copy private data to frontend
echo -e "\n${YELLOW}📋 Copying private data to frontend...${NC}"
cp "$PRIVATE_REPO_PATH/projects.json" "$PUBLIC_REPO_PATH/frontend/src/lib/data/projects.json"
echo -e "${GREEN}✓ projects.json copied${NC}"

# Copy assets if they exist
if [ -d "$PRIVATE_REPO_PATH/assets" ]; then
    echo -e "${YELLOW}🖼️  Copying assets...${NC}"
    rm -rf "$PUBLIC_REPO_PATH/frontend/static/assets"
    cp -r "$PRIVATE_REPO_PATH/assets" "$PUBLIC_REPO_PATH/frontend/static/assets"
    echo -e "${GREEN}✓ Assets copied${NC}"
fi

# Create .npmrc
echo -e "\n${YELLOW}🔧 Creating .npmrc...${NC}"
cd "$PUBLIC_REPO_PATH/frontend"
echo "optional=true" > .npmrc
cd "$PUBLIC_REPO_PATH"
echo -e "${GREEN}✓ .npmrc created${NC}"

# Docker operations
echo -e "\n${YELLOW}🐳 Docker operations...${NC}"

echo "🌐 Ensuring Docker network exists..."
docker network create web 2>/dev/null || echo "Network already exists"

echo "🛑 Stopping old container..."
docker compose down

echo "🏗️  Building new image..."
docker compose build --no-cache

echo "🚀 Starting container..."
docker compose up -d

echo ""
echo "⏳ Waiting for container to start..."
sleep 5

echo ""
echo -e "${YELLOW}📋 Container status:${NC}"
docker ps | grep portfolio || echo -e "${RED}⚠️  Container not running!${NC}"

echo ""
echo -e "${YELLOW}📝 Recent logs:${NC}"
docker compose logs --tail=30

echo ""
if docker ps | grep -q portfolio; then
    echo -e "${GREEN}✨ Deployment completed successfully!${NC}"
    echo -e "${BLUE}🌐 Portfolio available at: https://combe.tf${NC}"
else
    echo -e "${RED}❌ Deployment failed - container is not running${NC}"
    exit 1
fi