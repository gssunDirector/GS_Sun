#!/bin/bash

# Скрипт для резервного копирования всех данных Firebase
# Использование: ./backup-firebase.sh

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Создаем папку для бэкапов с датой и временем
BACKUP_DIR="firebase-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo -e "${GREEN}🚀 Начинаем резервное копирование Firebase...${NC}"
echo -e "${YELLOW}Папка для бэкапа: $BACKUP_DIR${NC}\n"

# 1. Экспорт Firestore Database
echo -e "${GREEN}📊 Экспорт Firestore Database...${NC}"
if command -v gcloud &> /dev/null; then
    # Используем gcloud для экспорта Firestore
    gcloud firestore export gs://azs-project-55e79.appspot.com/backups/firestore-$(date +%Y%m%d-%H%M%S) || \
    firebase firestore:export "$BACKUP_DIR/firestore" || \
    echo -e "${RED}⚠️  Не удалось экспортировать Firestore. Установите gcloud CLI или используйте Firebase Console${NC}"
else
    echo -e "${YELLOW}⚠️  gcloud CLI не установлен. Используйте Firebase Console для экспорта Firestore${NC}"
    echo -e "${YELLOW}   Или установите: https://cloud.google.com/sdk/docs/install${NC}"
fi

# 2. Экспорт Authentication Users
echo -e "\n${GREEN}👥 Экспорт пользователей Authentication...${NC}"
firebase auth:export "$BACKUP_DIR/auth-users.json" --format=json 2>/dev/null || \
echo -e "${YELLOW}⚠️  Не удалось экспортировать пользователей. Проверьте права доступа${NC}"

# 3. Скачивание Storage файлов
echo -e "\n${GREEN}📦 Скачивание файлов из Storage...${NC}"
if command -v gsutil &> /dev/null; then
    gsutil -m cp -r gs://azs-project-55e79.appspot.com "$BACKUP_DIR/storage" || \
    echo -e "${YELLOW}⚠️  Не удалось скачать файлы из Storage${NC}"
else
    echo -e "${YELLOW}⚠️  gsutil не установлен. Используйте Firebase Console для скачивания файлов${NC}"
    echo -e "${YELLOW}   Или установите gcloud CLI (включает gsutil)${NC}"
fi

# 4. Копирование конфигурации Firebase
echo -e "\n${GREEN}⚙️  Копирование конфигурации Firebase...${NC}"
cp firebase.json "$BACKUP_DIR/" 2>/dev/null || echo -e "${YELLOW}⚠️  firebase.json не найден${NC}"
cp .firebaserc "$BACKUP_DIR/" 2>/dev/null || echo -e "${YELLOW}⚠️  .firebaserc не найден${NC}"

# 5. Информация о проекте
echo -e "\n${GREEN}ℹ️  Сохранение информации о проекте...${NC}"
{
    echo "Дата бэкапа: $(date)"
    echo "Проект: azs-project-55e79"
    echo "Firebase CLI версия: $(firebase --version 2>/dev/null || echo 'не установлен')"
} > "$BACKUP_DIR/backup-info.txt"

echo -e "\n${GREEN}✅ Резервное копирование завершено!${NC}"
echo -e "${GREEN}📁 Все файлы сохранены в: $BACKUP_DIR${NC}\n"

# Показываем размер папки
if command -v du &> /dev/null; then
    SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
    echo -e "${YELLOW}Размер бэкапа: $SIZE${NC}"
fi

