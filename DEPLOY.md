# Инструкция по деплою на Firebase Hosting

## Шаг 1: Установка Firebase CLI

Если Firebase CLI еще не установлен, выполните одну из команд:

**Глобальная установка:**
```bash
npm install -g firebase-tools
```

**Или локальная установка в проект:**
```bash
npm install --save-dev firebase-tools
```

## Шаг 2: Вход в Firebase

Выполните команду для входа в ваш аккаунт Firebase:
```bash
firebase login
```

Откроется браузер, где нужно будет авторизоваться через Google аккаунт.

## Шаг 3: Сборка проекта

Перед деплоем нужно собрать проект:
```bash
npm run build
```

Эта команда создаст папку `build` с готовыми файлами для деплоя.

## Шаг 4: Деплой на Firebase

После успешной сборки выполните:
```bash
firebase deploy --only hosting
```

Или если Firebase CLI установлен локально:
```bash
npx firebase deploy --only hosting
```

## Шаг 5: Проверка

После деплоя вы получите URL вашего сайта, например:
`https://azs-project-55e79.web.app`

---

## Быстрый деплой (все команды подряд)

```bash
# 1. Сборка проекта
npm run build

# 2. Деплой
firebase deploy --only hosting
```

---

## Полезные команды

- `firebase login` - вход в аккаунт
- `firebase logout` - выход из аккаунта
- `firebase projects:list` - список ваших проектов
- `firebase use` - выбор проекта (текущий: azs-project-55e79)
- `firebase deploy --only hosting` - деплой только hosting
- `firebase hosting:channel:deploy preview` - создание preview канала для тестирования

