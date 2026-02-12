#!/bin/bash
# MCP Security Audit Script v1.0
# T.O. Mercer | SafePasswordGenerator.net | MIT License

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'; BOLD='\033[1m'
FOUND=0; EXPOSED=0; PERMS=0; NETWORK=0

echo "${BOLD}MCP Security Audit Tool v1.0${NC}"
echo "---------------------------------------------"

# PHASE 1: Plaintext credential scan
DIRS=("$HOME/.config" "$HOME/.cursor" "$HOME/.vscode" "$HOME/.claude")
[[ "$OSTYPE" == "darwin"* ]] && DIRS+=("$HOME/Library/Application Support")

for dir in "${DIRS[@]}"; do
  [ -d "$dir" ] || continue
  HITS=$(grep -rnE "API_KEY|TOKEN|SECRET|PASSWORD|ACCESS_KEY|PRIVATE_KEY" \
    "$dir" --include="*.json" --include="*.env" --include="*.yaml" 2>/dev/null)
  if [ -n "$HITS" ]; then
    COUNT=$(echo "$HITS" | wc -l | tr -d ' ')
    EXPOSED=$((EXPOSED + COUNT)); FOUND=1
    echo "${RED}[EXPOSED]${NC} $COUNT credential(s) in: $dir"
  else
    echo "${GREEN}[CLEAN]${NC} $dir"
  fi
done

# PHASE 2: File permission check
for dir in "${DIRS[@]}"; do
  [ -d "$dir" ] || continue
  LOOSE=$(find "$dir" -type f \( -name "*.json" -o -name "*.env" \) \
    ! -perm 600 2>/dev/null | head -20)
  if [ -n "$LOOSE" ]; then
    COUNT=$(echo "$LOOSE" | wc -l | tr -d ' ')
    PERMS=$((PERMS + COUNT)); FOUND=1
    echo "${RED}[LOOSE]${NC} $COUNT file(s) with open permissions in: $dir"
  fi
done

# PHASE 3: NeighborJack detection
LISTEN=$(lsof -i -P -n 2>/dev/null | grep LISTEN || ss -tlnp 2>/dev/null)
NJ=$(echo "$LISTEN" | grep -E '0\.0\.0\.0|\*:' 2>/dev/null)
if [ -n "$NJ" ]; then
  COUNT=$(echo "$NJ" | wc -l | tr -d ' ')
  NETWORK=$((NETWORK + COUNT)); FOUND=1
  echo "${RED}[NEIGHBORJACK]${NC} $COUNT process(es) on 0.0.0.0"
fi

# SUMMARY
echo "---------------------------------------------"
if [ $FOUND -eq 0 ]; then
  echo "${GREEN}${BOLD}PASS:${NC} No issues detected."
else
  echo "${RED}${BOLD}ISSUES FOUND:${NC}"
  echo "  Plaintext credentials: $EXPOSED | Loose permissions: $PERMS | Network exposed: $NETWORK"
  echo "  Hardening guide: https://safepasswordgenerator.net/mcp-security"
fi

