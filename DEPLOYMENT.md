# Инструкция по деплою на Vercel

## Подготовка проекта

### 1. Исправленные ошибки

В проекте были исправлены следующие ошибки:
- ✅ Исправлен импорт `useSocket` в `app/hooks/useSocket.js` (добавлен именованный экспорт)
- ✅ Исправлена проверка `params` в `app/admin/competitions/[id]/page.tsx`
- ✅ Обновлена конфигурация TypeScript в `tsconfig.json`
- ✅ Создан `vercel.json` для правильной конфигурации деплоя
- ✅ Исправлен импорт `Textarea` в `app/admin/competitions/create/page.tsx` (удален из импорта antd)
- ✅ Удален устаревший пакет `dnd-kit@0.0.2` из зависимостей
- ✅ Обновлен `.gitignore` для исключения `.next` директории

### 2. Переменные окружения

Перед деплоем необходимо настроить следующие переменные окружения в Vercel:

#### Обязательные переменные:
```bash
# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-here

# Database (если используется)
DATABASE_URL=your-database-url

# Google Maps (если используется)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

#### Опциональные переменные:
```bash
# Stripe (если используется)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# Firebase (если используется)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Mapbox (если используется)
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

## Деплой на Vercel

### Способ 1: Через Vercel CLI

1. Установите Vercel CLI:
```bash
npm i -g vercel
```

2. Войдите в аккаунт Vercel:
```bash
vercel login
```

3. Деплой проекта:
```bash
vercel
```

4. Для продакшн деплоя:
```bash
vercel --prod
```

### Способ 2: Через GitHub

1. Загрузите код в GitHub репозиторий

2. Перейдите на [vercel.com](https://vercel.com)

3. Нажмите "New Project"

4. Подключите ваш GitHub репозиторий

5. Настройте переменные окружения в разделе "Environment Variables"

6. Нажмите "Deploy"

### Способ 3: Через Vercel Dashboard

1. Перейдите на [vercel.com](https://vercel.com)

2. Нажмите "New Project"

3. Выберите "Upload" и загрузите ZIP архив с проектом

4. Настройте переменные окружения

5. Нажмите "Deploy"

## Проверка деплоя

После успешного деплоя:

1. Проверьте, что все страницы загружаются корректно
2. Проверьте работу Socket.io соединений
3. Проверьте работу с базой данных (если используется)
4. Проверьте работу с внешними API (Google Maps, Stripe и т.д.)

## Возможные проблемы

### 1. Ошибки сборки
- Убедитесь, что все зависимости установлены
- Проверьте, что TypeScript конфигурация корректна
- Проверьте, что все импорты правильные

### 2. Ошибки переменных окружения
- Убедитесь, что все необходимые переменные настроены в Vercel
- Проверьте, что переменные имеют правильные значения

### 3. Проблемы с Socket.io
- Убедитесь, что API роут `/api/socket` работает корректно
- Проверьте, что WebSocket соединения не блокируются

### 4. Проблемы с базой данных
- Убедитесь, что DATABASE_URL настроен правильно
- Проверьте, что база данных доступна из Vercel

## Дополнительные настройки

### Настройка домена
1. В Vercel Dashboard перейдите в настройки проекта
2. В разделе "Domains" добавьте ваш домен
3. Настройте DNS записи согласно инструкциям Vercel

### Настройка SSL
SSL сертификаты настраиваются автоматически в Vercel

### Мониторинг
В Vercel Dashboard доступны:
- Логи деплоя
- Логи функций
- Метрики производительности
- Аналитика

## Поддержка

При возникновении проблем:
1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что все переменные окружения настроены
3. Проверьте, что код соответствует требованиям Next.js 14
4. Обратитесь в поддержку Vercel при необходимости 