#!/bin/bash

# Простой скрипт для экспорта Firestore через Firebase CLI
# Использование: ./backup-firestore-simple.sh

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

BACKUP_DIR="firestore-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo -e "${GREEN}📊 Экспорт Firestore Database...${NC}\n"

# Способ 1: Через Firebase CLI (если доступно)
echo -e "${YELLOW}Попытка экспорта через Firebase CLI...${NC}"
firebase firestore:export "$BACKUP_DIR/firestore" 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Экспорт успешно завершен!${NC}"
    echo -e "${GREEN}📁 Файлы сохранены в: $BACKUP_DIR/firestore${NC}"
else
    echo -e "${RED}❌ Экспорт через Firebase CLI не удался${NC}"
    echo -e "${YELLOW}Попробуйте другие способы из инструкции BACKUP.md${NC}"
fi

