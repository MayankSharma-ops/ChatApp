#!/usr/bin/env bash
set -e

GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; NC='\033[0m'

echo -e "\n${CYAN}╔════════════════════════════════════╗"
echo -e "║   ChatDApp — Setup Script          ║"
echo -e "╚════════════════════════════════════╝${NC}\n"

# nvm check
if command -v nvm &>/dev/null || [ -s "$HOME/.nvm/nvm.sh" ]; then
  source "$HOME/.nvm/nvm.sh" 2>/dev/null || true
  echo -e "${CYAN}→ nvm found — loading .nvmrc (Node 22+)${NC}"
  nvm install 2>/dev/null || true
  nvm use     2>/dev/null || true
fi

echo -e "\n${CYAN}→ Installing root dependencies...${NC}"
npm install

echo -e "\n${CYAN}→ Installing backend dependencies...${NC}"
cd backend && npm install && cd ..

echo -e "\n${CYAN}→ Installing frontend dependencies...${NC}"
cd frontend && npm install && cd ..

# .env files
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo -e "\n${YELLOW}⚠  Created backend/.env — please edit DATABASE_URL and JWT_SECRET!${NC}"
fi

if [ ! -f frontend/.env.local ]; then
  cp frontend/.env.local.example frontend/.env.local
  echo -e "${GREEN}✓  Created frontend/.env.local${NC}"
fi

echo -e "\n${GREEN}✅  All dependencies installed!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "  1. Edit   ${CYAN}backend/.env${NC}          → set DATABASE_URL & JWT_SECRET"
echo -e "  2. Run    ${CYAN}npm run db:init${NC}        → create PostgreSQL tables"
echo -e "  3. Run    ${CYAN}npm run dev${NC}            → start both servers\n"
echo -e "  Backend  → ${CYAN}http://localhost:4000${NC}"
echo -e "  Frontend → ${CYAN}http://localhost:3000${NC}\n"
