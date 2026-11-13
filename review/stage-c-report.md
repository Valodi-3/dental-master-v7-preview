# Dental Atlas 4.1 — этап C

Дата проверки: 2026-11-12. Работа выполнена только в ветке codex/dental-atlas-4-1-premium; main и production не изменялись. Этап D не запускался.

## 1. Таблица требований

| Требование | Что сделано | Файл: строки | Как проверено |
|---|---|---|---|
| Главная Испанских кварталов: компактный первый экран | Убраны индекс 02, технические факты и адрес из hero; H1 без принудительного переноса; порядок «текст → CTA → фото» | atlas-v4-1/ispanskie/index.html:22; atlas-v4-1/assets/atlas-4-1.css:1110-1381 | Playwright 390/1440; H1 31.98px/48px, 2/3 строки; CTA 48/50px; фото 340px/514px |
| Главная Прокшино: компактный первый экран | Убраны индекс 01, технические факты и адрес из hero; оставлены подтверждённые CTA и фото | atlas-v4-1/prokshino/index.html:22; atlas-v4-1/assets/atlas-4-1.css:1110-1381 | Playwright 390/1440; H1 31.98px/60px, 3/3 строки; CTA 48/50px; фото 340px/514px |
| Страница услуги | В hero оставлены направление, описание, кнопка записи и фото; блок статистики удалён; на мобильном текст и CTA идут перед фото | atlas-v4-1/ispanskie/services/implantation.html:22; atlas-v4-1/assets/atlas-4-1.css:1110-1381 | Playwright 390: H1 31.98px, 1 строка; описание 3 строки; CTA 48px; фото 340px видимо полностью |
| Галерея | Заголовок и пояснение приведены к компактной иерархии; подписи остаются в потоке под фото | atlas-v4-1/assets/atlas-4-1.css:1110-1381 | Playwright 390: H1 31.98px, 2 строки; горизонтального переполнения нет; скриншот первого и полного экрана |
| Фиксированные панели не перекрывают hero | Для этапа C сохранён потоковый mobile action bar, у hero нет min-height:100vh/100svh; основной контент без принудительного нижнего перекрытия | atlas-v4-1/assets/atlas-4-1.css:1110-1381 | Снятие геометрии Playwright; CTA полностью в первом экране на обеих главных |
| Фото без текста/плашек поверх | Использован существующий тест Stage A без изменений | tests/visual/no-photo-overlay.spec.js | 90/90 тестов PASS, полный вывод ниже |

## 2. Изменённые файлы

- atlas-v4-1/ispanskie/index.html
- atlas-v4-1/prokshino/index.html
- atlas-v4-1/ispanskie/services/implantation.html
- atlas-v4-1/assets/atlas-4-1.css
- Скриншоты: review/before/stage-c-*.png, review/after/stage-c-*.png

## 3. Числовая проверка первого экрана

| Страница | Ширина | H1 | Строки H1 | Строки описания | Фото (видимая высота) | CTA | scrollWidth |
|---|---:|---:|---:|---:|---:|---:|---:|
| Испанские кварталы | 390 | 31.98px | 2 | 2 | 340px | 48px, полностью в viewport | 390 |
| Испанские кварталы | 1440 | 48px | 3 | 2 | 514px | 50px | 1440 |
| Прокшино | 390 | 31.98px | 3 | 3 | 340px | 48px, полностью в viewport | 390 |
| Прокшино | 1440 | 60px | 3 | 2 | 514px | 50px | 1440 |
| Имплантация | 390 | 31.98px | 1 | 3 | 340px | 48px, полностью в viewport | 390 |
| Галерея | 390 | 31.98px | 2 | 3 | 295px (первый кадр) | — | 390 |

## 4. Проверочный скрипт mobile-hero-metrics.spec.js

Команда: node playwright/cli.js test tests/visual/mobile-hero-metrics.spec.js --workers=1

~~~
Running 2 tests using 1 worker
[1/2] mobile hero metrics: /atlas-v4-1/ispanskie/index.html @390 — passed
[2/2] mobile hero metrics: /atlas-v4-1/prokshino/index.html @390 — passed
2 passed (3.8s)
~~~

## 5. Проверочный скрипт no-photo-overlay.spec.js

Команда: node playwright/cli.js test tests/visual/no-photo-overlay.spec.js --workers=1

Полный вывод сохранён также в stage-c-no-overlay-final.log:

~~~
Running 90 tests using 1 worker



(node:36860) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/index.html @390
[2/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/index.html @390
[3/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/directions/index.html @390
[4/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/prices/index.html @390
[5/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/doctors/index.html @390
[6/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/gallery/index.html @390
[7/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/contacts/index.html @390
[8/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/booking/index.html @390
[9/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/services/consultations.html @390
[10/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/services/diagnostics.html @390
[11/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/services/anesthesia.html @390
[12/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/services/hygiene.html @390
[13/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/services/treatment.html @390
[14/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/services/endodontics.html @390
[15/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/services/surgery.html @390
[16/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/services/implantation.html @390
[17/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/services/prosthetics.html @390
[18/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/services/orthodontics.html @390
[19/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/doctors/aram-danielyan.html @390
[20/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/doctors/azer-nadzhafov.html @390
[21/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/doctors/diana-fiasheva.html @390
[22/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/doctors/anna-karapetyan.html @390
[23/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/doctors/amina-mashrabova.html @390
[24/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/index.html @390
[25/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/directions/index.html @390
[26/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/prices/index.html @390
[27/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/doctors/index.html @390
[28/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/gallery/index.html @390
[29/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/contacts/index.html @390
[30/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/booking/index.html @390
[31/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/services/consultations.html @390
[32/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/services/diagnostics.html @390
[33/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/services/anesthesia.html @390
[34/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/services/hygiene.html @390
[35/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/services/treatment.html @390
[36/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/services/endodontics.html @390
[37/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/services/surgery.html @390
[38/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/services/implantation.html @390
[39/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/services/prosthetics.html @390
[40/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/services/orthodontics.html @390
[41/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/doctors/aram-danielyan.html @390
[42/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/doctors/azer-nadzhafov.html @390
[43/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/doctors/diana-fiasheva.html @390
[44/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/doctors/anna-karapetyan.html @390
[45/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/doctors/amina-mashrabova.html @390
[46/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/index.html @1440
[47/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/index.html @1440
[48/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/directions/index.html @1440
[49/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/prices/index.html @1440
[50/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/doctors/index.html @1440
[51/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/gallery/index.html @1440
[52/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/contacts/index.html @1440
[53/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/booking/index.html @1440
[54/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/services/consultations.html @1440
[55/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/services/diagnostics.html @1440
[56/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/services/anesthesia.html @1440
[57/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/services/hygiene.html @1440
[58/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/services/treatment.html @1440
[59/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/services/endodontics.html @1440
[60/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/services/surgery.html @1440
[61/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/services/implantation.html @1440
[62/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/services/prosthetics.html @1440
[63/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/services/orthodontics.html @1440
[64/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/doctors/aram-danielyan.html @1440
[65/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/doctors/azer-nadzhafov.html @1440
[66/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/doctors/diana-fiasheva.html @1440
[67/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/doctors/anna-karapetyan.html @1440
[68/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/ispanskie/doctors/amina-mashrabova.html @1440
[69/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/index.html @1440
[70/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/directions/index.html @1440
[71/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/prices/index.html @1440
[72/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/doctors/index.html @1440
[73/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/gallery/index.html @1440
[74/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/contacts/index.html @1440
[75/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/booking/index.html @1440
[76/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/services/consultations.html @1440
[77/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/services/diagnostics.html @1440
[78/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/services/anesthesia.html @1440
[79/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/services/hygiene.html @1440
[80/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/services/treatment.html @1440
[81/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/services/endodontics.html @1440
[82/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/services/surgery.html @1440
[83/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/services/implantation.html @1440
[84/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/services/prosthetics.html @1440
[85/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/services/orthodontics.html @1440
[86/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/doctors/aram-danielyan.html @1440
[87/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/doctors/azer-nadzhafov.html @1440
[88/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/doctors/diana-fiasheva.html @1440
[89/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/doctors/anna-karapetyan.html @1440
[90/90] tests\visual\no-photo-overlay.spec.js:36:5 › no overlay on photos: /atlas-v4-1/prokshino/doctors/amina-mashrabova.html @1440
  90 passed (1.3m)
~~~

Итог: 90 тестов (45 маршрутов × 2 ширины 390/1440) — PASS; нарушений наложения не обнаружено.

## 6. Интерактивные проверки

- Главные Испанских кварталов и Прокшино: кнопка записи открывает существующий диалог, закрытие работает, ошибок страницы нет.
- Страница имплантации: выбор позиции прайса заполняет существующий блок выбранной позиции, без создания записи.
- Галерея: клик по фото открывает существующий lightbox, ошибок JavaScript нет.
- Проверка проводилась на локальном preview http://127.0.0.1:4174; реальные DentalPRO/записи не имитировались.

## 7. Скриншоты

После:

- review/after/stage-c-home-ispanskie-390.png и -390-full.png
- review/after/stage-c-home-ispanskie-1440.png и -1440-full.png
- review/after/stage-c-home-prokshino-390.png и -390-full.png
- review/after/stage-c-home-prokshino-1440.png и -1440-full.png
- review/after/stage-c-service-ispanskie-390.png и -390-full.png
- review/after/stage-c-gallery-ispanskie-390.png и -390-full.png

До (состояние коммита 0395f29, до этапа C): соответствующие файлы находятся в review/before/stage-c-*.png.

## 8. Что НЕ удалось или вызывает сомнения

- Проверка выполнена на локальном preview; production не публиковался по правилам этапа C.
- Полный мобильный/десктопный цикл для остальных страниц не запускался: это относится к этапу D и намеренно отложено.
- Реальная отправка формы DentalPRO не выполнялась; проверен только официальный переход/диалог без бронирования.
