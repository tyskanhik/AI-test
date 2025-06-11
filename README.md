# 🏠🌳👶 Детский психологический тест "Дом-Дерево-Человек"

![alt text](Image.png)

Веб-приложение для проведения проективного теста "Дом-Дерево-Человек" (ДДЧ) с автоматическим анализом результатов.

## ✨ Особенности

- 🎨 Интерактивный интерфейс для детского тестирования
- 📊 Автоматический анализ рисунков и ответов
- 📝 Генерация развернутого психологического заключения
- 📁 Сохранение отчетов в PDF
- 📱 Полностью адаптивный дизайн

## 🛠 Технологии

![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white)
![Redux](https://img.shields.io/badge/-Redux-764ABC?logo=redux&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![SCSS](https://img.shields.io/badge/-SCSS-CC6699?logo=sass&logoColor=white)

- React 18 (TypeScript)
- SCSS Modules
- React Router 6
- Адаптивная верстка

## 🚀 Запуск проекта

1. Клонируйте репозиторий:

```bash
git clone https://github.com/tyskanhik/AI-test.git
cd AI-test
```

2. Установите зависимости:

```bash
npm install
```

 3. Запустите development-сервер:

```bash
npm start
```

Приложение будет доступно по адресу:
http://localhost:3000

⚠️ Особенности работы
Приложение имеет демонстрационный режим:

❗ Если сервер недоступен (CORS ошибки или timeout 10 сек):

Автоматически загружаются моковые данные

Появляется предупреждение:
Сервер не отвечает, показаны демонстрационные данные

Все функции остаются рабочими с тестовыми данными

📂 Структура проекта

```text
src/
├── assets/       	  # Изображения шрифты и переменные для стилей
├── api/              # Api для запросов
├── pages/            # Страницы приложения
├── ui-kit/           # UI компоненты дизайн-системы
├── App.tsx           # Главный компонент
└── index.tsx         # Точка входа
```
