# Dental Atlas 4.1 — финальная UX-полировка PR #2

Рабочая ветка: `codex/dental-atlas-4-1-premium`  
Preview: локальный сервер `http://127.0.0.1:4174`  
Production и `main` не изменялись.

## Изменения и визуальные доказательства

| Требование | Что сделано | Файл: строки | Как проверено |
|---|---|---|---|
| Мобильная запись: hero не должен занимать экран | Сокращены вертикальные отступы hero, заголовок и описание получили компактные размеры; первый блок способов записи начинается сразу после hero. | `atlas-v4-1/assets/atlas-4-1.css:1744-1767` | Скриншоты 390×844 до/после; `mobile-hero-metrics.spec.js`; `stage-d-page-families.spec.js`. |
| Прайс: блок «254» не должен отодвигать поиск | Уменьшен orbit-счётчик, title-row собран в две колонки на телефоне, отступы hero уменьшены. | `atlas-v4-1/assets/atlas-4-1.css:1732-1740,1771-1787` | Скриншоты 390×844 до/после; поиск и фильтры присутствуют и доступны в первом экране. |
| Контраст подписей и информационных плашек | Согласованы цвета стажа, experience-stamp, счётчиков каталога, source-note и второстепенного текста; для тёмной карточки контактов задан светлый текст. | `atlas-v4-1/assets/atlas-4-1.css:178,422,1045-1088,1747` | Скриншоты 390×844 до/после; computed styles для стажа и контактов; `no-photo-overlay.spec.js`. |
| Пустое пространство над каталогом врачей | Уменьшен верхний padding каталога врачей до 32px после hero. | `atlas-v4-1/assets/atlas-4-1.css:1741-1743,1789-1791` | Скриншоты 1440×900 до/после; замер первого ряда карточек: `doctors-directory` 32px. |
| Второстепенный текст на контактах и остальных страницах | Усилен базовый muted-текст на светлых поверхностях, увеличены размер и line-height описаний контактных/booking-карточек. | `atlas-v4-1/assets/atlas-4-1.css:1045-1088` | Скриншоты 390×844 до/после; computed style контактов: `#eaf6ed`, 15.2px/23.56px; полный визуальный прогон. |

Для каждого пункта сохранена пара реальных скриншотов:

- Запись: `review/before/final-polish-booking-hero.png` → `review/after/final-polish-booking-hero.png`
- Прайс: `review/before/final-polish-prices-orbit.png` → `review/after/final-polish-prices-orbit.png`
- Контраст стажа: `review/before/final-polish-experience-contrast.png` → `review/after/final-polish-experience-contrast.png`
- Каталог врачей: `review/before/final-polish-doctors-spacing.png` → `review/after/final-polish-doctors-spacing.png`
- Контакты: `review/before/final-polish-contacts-secondary.png` → `review/after/final-polish-contacts-secondary.png`

## Путь пациента

Автоматизированный сценарий `tests/visual/patient-path.spec.js` проходит маршрут:

1. направление «Дентальная имплантация»;
2. переход к полному прайсу и проверка поиска/фильтра;
3. переход в каталог врачей;
4. открытие профиля Амины Машрабовой;
5. открытие модального окна способов записи и проверка телефона и официальной ссылки DentalPRO.

Слоты и бронирование в DentalPRO не создавались.

## Тесты

- `stage-d-page-families.spec.js` — основные типы страниц обоих филиалов на 390, 1440 и 1920px.
- `no-photo-overlay.spec.js` — нет текста/кнопок поверх фотографий на 390 и 1440px.
- `mobile-hero-metrics.spec.js` — метрики первого экрана на 390px.
- `patient-path.spec.js` — услуга → цена → врач → запись.
- `git diff --check`.

Итоговый вывод: `129 passed (2.1m)` одним worker; приёмка выполнена на локальном preview, не на production.

## Что не выполнялось

- Не создавались реальные записи и не проверялись реальные слоты DentalPRO.
- Не публиковалось в production и не изменялась ветка `main`.
- Внешние каналы связи не тестировались как часть этого этапа.
