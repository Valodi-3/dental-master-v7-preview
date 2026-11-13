# Dental Atlas 4.1 — финальная приёмка PR #2

Дата: 13 ноября 2026 года
Ветка: `codex/dental-atlas-4-1-premium`
Базовый опубликованный коммит до этого прохода: `cb3468e`
Production и `main` не изменялись.

## Исправление окна записи

В `atlas-v4-1/assets/atlas-4-1.css` и `atlas-v4-1/assets/atlas-4-1.js` сохранён существующий официальный DentalPRO handoff и исправлены только UX-детали:

- мобильный порядок стал последовательным: **филиал → услуга → способ записи**;
- кнопки «Позвонить» и «Открыть DentalPRO» имеют шрифт 14 px и область нажатия не менее 48 px;
- основной описательный текст карточки DentalPRO — 16 px;
- окно без выбранной услуги показывает компактный шаг услуги, а не пустой блок;
- выбранная услуга остаётся в контексте записи, длинное название ограничено двумя строками с полным названием в `title`;
- крестик закрытия — 48×48 px, Escape и возврат фокуса сохранены в существующей логике `v2.js`;
- официальный URL не изменён: `https://dantist-prokshino.ru/online-zapis/`.

Независимая визуальная проверка выявила три точечных проблемы, которые исправлены в этом же проходе:

- на ширине 320 px кнопки выбора больше не получают одинокие буквы: для двухколоночных карточек снята принудительная капитель и разрешён перенос только по словам;
- у прайса уменьшен декоративный блок `254`, а hero теперь заканчивается до панели поиска;
- у каталога врачей уменьшена пустая высота hero и сокращён верхний отступ списка на ПК.

## Проверки

| Проверка | Результат |
|---|---:|
| `tests/visual/dentalpro-branch-choice.spec.js` — оба филиала, 390/768/1440/1920 | 8 passed |
| `tests/visual/patient-path.spec.js` — услуга → прайс → врач → запись | 1 passed |
| `tests/visual/final-acceptance-audit.spec.js` — каталог, врачи, галерея, контакты, booking smoke 320/360/390/768/1440/1920 | 14 passed |
| `tests/visual/no-photo-overlay.spec.js` — ключевые страницы обоих филиалов, 390/1440 | 90 passed |
| `tests/visual/mobile-hero-metrics.spec.js` | 2 passed |
| `tests/visual/stage-d-page-families.spec.js` — врачи/услуги/цены/контакты/запись, 390/1440/1920 | 36 passed |

Финальный полный прогон после изменений: **151 passed (2.5m)**.

### Фактически проверено в acceptance-тесте

- В каждом филиале в прайсе ровно **254** позиции; фильтр имплантации показывает 18, поиск и раскрытие строки работают.
- Все ссылки профилей врачей возвращают HTTP 200; изображения профилей загружаются.
- Галерея открывает lightbox, изображение имеет источник, Escape закрывает просмотр.
- Контакты содержат `tel:`, Яндекс Карты и подтверждённые WhatsApp/Telegram-ссылки.
- На 320, 360, 390, 768, 1440 и 1920 px нет горизонтального переполнения, отсутствуют ошибки Console/PageError, есть title, description и canonical.
- В окне записи без услуги высота шага услуги менее 160 px; в сценарии с услугой порядок и сохранение контекста проверяются отдельным тестом.

## Сравнение с действующими сайтами

Свежая проверка старых доменов:

- `https://dantist-prokshino.ru/` — HTTP 200;
- `https://stomatolog-ispanskie-kvartaly.ru/` — HTTP 200;
- оба используют общую официальную страницу `https://dantist-prokshino.ru/online-zapis/` — HTTP 200;
- старый `mail.php` на обоих доменах отвечает `{"responce":"bad","error":"POST required"}` на GET; получатель и серверная обработка не раскрыты.

V4.1 сохраняет полезные функции старых сайтов: отдельные маршруты филиалов, 254 позиции прайса, каталоги врачей, контакты, карты, мессенджеры и официальный DentalPRO handoff. Неизвестная callback-форма не подключалась.

## Скриншоты

Актуальные скриншоты booking-модалки:

- `review/acceptance/booking-ispanskie-320.png`
- `review/acceptance/booking-ispanskie-360.png`
- `review/acceptance/booking-ispanskie-390.png`
- `review/acceptance/booking-ispanskie-1440.png`
- `review/acceptance/booking-prokshino-320.png`
- `review/acceptance/booking-prokshino-360.png`
- `review/acceptance/booking-prokshino-390.png`
- `review/acceptance/booking-prokshino-1440.png`

Дополнительные кадры для независимой приёмки замечаний:

- `review/acceptance/prices-ispanskie-390.png`
- `review/acceptance/prices-ispanskie-1440.png`
- `review/acceptance/prices-prokshino-390.png`
- `review/acceptance/prices-prokshino-1440.png`
- `review/acceptance/doctors-ispanskie-1440.png`
- `review/acceptance/doctors-prokshino-1440.png`

Ранее сохранённые скриншоты всех основных типов страниц (home, doctors, service, prices, contacts, gallery, booking) находятся в `review/after/` с префиксами `stage-d-`, `home-` и `gallery-`. Они соответствуют текущему preview; booking-кадры выше перегенерированы после финальной правки.

## Что не подтверждено

1. Реальный слот и отправка записи DentalPRO не выполнялись, чтобы не создавать запись пациенту. В отдельном прямом smoke-тесте внешнего iframe ранее отображалось `Токен не найден`; это внешнее состояние, не изменяемое из PR.
2. Отдельные ID филиалов и официальный параметр передачи врача/услуги в URL не опубликованы в доступных источниках.
3. Callback `mail.php` намеренно не переносился: endpoint, получатель и политика обработки персональных данных не подтверждены.

Итог текущего preview: функциональность и интерфейс проверены в PR; публикация в production и merge не выполнялись.
