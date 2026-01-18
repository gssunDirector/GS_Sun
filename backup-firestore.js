/**
 * Скрипт для экспорта Firestore через Admin SDK
 * 
 * Использование:
 * 1. Установите зависимости: npm install firebase-admin
 * 2. Получите service account key из Firebase Console
 * 3. Запустите: node backup-firestore.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Путь к service account key (скачайте из Firebase Console)
// Project Settings → Service Accounts → Generate New Private Key
const serviceAccount = require('./serviceAccountKey.json'); // Создайте этот файл

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const backupDir = `firestore-backup-${new Date().toISOString().split('T')[0]}`;

async function exportCollection(collectionName) {
  console.log(`📊 Экспорт коллекции: ${collectionName}`);
  const snapshot = await db.collection(collectionName).get();
  const data = [];
  
  snapshot.forEach(doc => {
    data.push({
      id: doc.id,
      ...doc.data()
    });
  });
  
  const filePath = path.join(backupDir, `${collectionName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Сохранено ${data.length} документов в ${filePath}`);
}

async function backupFirestore() {
  // Создаем папку для бэкапа
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }
  
  console.log('🚀 Начинаем экспорт Firestore...\n');
  
  try {
    // Получаем список всех коллекций
    const collections = await db.listCollections();
    
    for (const collection of collections) {
      await exportCollection(collection.id);
    }
    
    console.log(`\n✅ Экспорт завершен! Файлы сохранены в: ${backupDir}`);
  } catch (error) {
    console.error('❌ Ошибка при экспорте:', error);
  }
}

backupFirestore();

