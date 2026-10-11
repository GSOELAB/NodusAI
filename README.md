# Nodus AI

AI-ассистент для Obsidian: плагин с React-интерфейсом в отдельной вкладке (чат и настройки).
Сейчас это каркас — view, роутинг между страницами и сохранение настроек.

## Стек

TypeScript, React, React Router (MemoryRouter), Zustand, Zod, Vercel AI SDK, esbuild с CSS Modules.

## Dev-сборка

Требуется Node.js 20+.

```bash
npm install
npm run dev     # watch-сборка: main.js + styles.css в корне репозитория
```

Подключение к тестовому vault (не используйте основной):

```bash
mkdir -p /path/to/dev-vault/.obsidian/plugins
ln -s "$(pwd)" /path/to/dev-vault/.obsidian/plugins/nodus-ai
```

Затем откройте vault в Obsidian → Settings → Community plugins → выключите Restricted mode → включите **Nodus AI**.
Вкладка открывается иконкой в ribbon или командой «Nodus AI: Open view».
После пересборки перезагрузите плагин (выключить/включить) или используйте плагин Hot Reload.

## Скрипты

| Команда          | Что делает                                    |
| ---------------- | --------------------------------------------- |
| `npm run dev`    | esbuild в режиме watch                        |
| `npm run build`  | проверка типов + production-сборка            |
| `npm run lint`   | ESLint (с правилами eslint-plugin-obsidianmd) |
| `npm run format` | Prettier                                      |
| `npm test`       | Vitest                                        |

## Структура

```
src/
  main.ts          класс плагина, только регистрация
  types.ts         настройки и DEFAULT_SETTINGS
  views/           ItemView, монтирует React
  ui/              App.tsx, pages/, components/
  services/        ai/, vault/, settings/
  store/           Zustand-стор
```
