#!/usr/bin/env bash
set -e

# ── Config ───────────────────────────────────────────────────────────
source .env

TAG="$(git rev-parse --short HEAD)"

# Colours for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

DRY_RUN=false
[ "$1" = "--dry-run" ] && DRY_RUN=true

run() {
  if [ "$DRY_RUN" = true ]; then
    echo "[DRY-RUN] $*"
  else
    eval "$@"
  fi
}

echo ""
echo "🚀 Deploy ${CONTAINER_NAME}"
echo "   Commit:  $TAG"
echo "   Server:  $SERVER"
echo "   Port: $PORT"
echo "   Network: $NETWORK"
echo "   Dry-run: $DRY_RUN"
echo ""

# ── Safety checks ────────────────────────────────────────────────────
git diff --quiet || { echo "❌ Git working tree not clean"; exit 1; }

# ── Build image locally ──────────────────────────────────────────────
echo "🏗️  Building image ${IMAGE_NAME}:${TAG}..."
run "docker build -t ${IMAGE_NAME}:${TAG} -f ${DOCKERFILE} ."

# ── Send image to server ─────────────────────────────────────────────
echo "📦 Sending image to ${SERVER}..."
run "docker save ${IMAGE_NAME}:${TAG} | ssh ${SERVER} 'docker load'"

# ── Deploy atomically ────────────────────────────────────────────────
echo "🌐 Ensuring Docker network exists..."
run "ssh ${SERVER} 'docker network create ${NETWORK} 2>/dev/null || true'"

echo "🛑 Stopping old container (if any)..."
run "ssh ${SERVER} '
  docker stop ${CONTAINER_NAME} 2>/dev/null || true
  docker rm ${CONTAINER_NAME} 2>/dev/null || true
'"

echo "🚀 Starting new container ${CONTAINER_NAME}_${TAG}..."
run "ssh ${SERVER} 'docker run -d \
  --name ${CONTAINER_NAME}_${TAG} \
  --restart unless-stopped \
  --network ${NETWORK} \
  -p ${PORT} \
  -e ORIGIN=${URL} \
  ${IMAGE_NAME}:${TAG}'"

# ── Health check ──────────────────────────────────────────────────────
echo "⏳ Waiting for container to become healthy..."
RETRIES=12
for i in $(seq 1 $RETRIES); do
  STATUS=$(ssh ${SERVER} "docker inspect --format='{{.State.Health.Status}}' ${CONTAINER_NAME}_${TAG} 2>/dev/null" || echo "starting")
  if [ "$STATUS" = "healthy" ]; then
    echo -e "${GREEN}✅ Container is healthy!${NC}"
    break
  fi
  if [ "$i" -eq "$RETRIES" ]; then
    echo -e "${RED}❌ Container did not become healthy after ${RETRIES} attempts${NC}"
    echo "📝 Logs:"
    ssh ${SERVER} "docker logs --tail=30 ${CONTAINER_NAME}_${TAG}"
    echo -e "${YELLOW}🛑 Rolling back...${NC}"
    ssh ${SERVER} "docker stop ${CONTAINER_NAME}_${TAG} || true; docker rm ${CONTAINER_NAME}_${TAG} || true"
    exit 1
  fi
  echo "   Attempt $i/$RETRIES — status: $STATUS"
  sleep 5
done

# ── Switch traffic ────────────────────────────────────────────────────
echo "🔄 Switching to new container..."
run "ssh ${SERVER} 'docker rename ${CONTAINER_NAME}_${TAG} ${CONTAINER_NAME}'"

# ── Cleanup ───────────────────────────────────────────────────────────
echo ""
echo "🧹 Pruning unused images on server..."
run "ssh ${SERVER} 'docker image prune -f'"

echo ""
echo "🧹 Pruning all unused docker elements locally ..."
run "docker system prune -a -f"

# ── Done ──────────────────────────────────────────────────────────────
echo ""
if ssh ${SERVER} "docker ps | grep -q ${CONTAINER_NAME}"; then
    echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
    echo -e "${BLUE}🌐 ${CONTAINER_NAME} available at: ${URL}${NC}"
    echo -e "${BLUE}📋 View logs: ssh ${SERVER} 'docker logs -f ${CONTAINER_NAME}'${NC}"
else
    echo -e "${RED}❌ Deployment failed - container is not running${NC}"
    exit 1
fi
