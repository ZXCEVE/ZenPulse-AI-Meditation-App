# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

### Safe Area Layout Guide

Приложение использует безопасные области экрана для корректных отступов от системных элементов:

- **Status Bar (iOS/Android)**: Автоматические отступы сверху
- **Home Indicator (iOS)**: Отступ снизу на устройствах без кнопки Home
- **Навигационная панель Android**: Учёт системной панели навигации

В компонентах используются фиксированные отступы (paddingTop: 50, paddingBottom: 40), которые учитывают типичные размеры системных областей.

### Навигация

- **Tab Bar**: Нижняя навигационная панель с двумя вкладками (Медитация, Профиль)
- **Stack Navigation**: Для модальных экранов (Paywall, Vibe Modal)
- **Gesture Navigation**: Поддержка стандартных жестов навигации
