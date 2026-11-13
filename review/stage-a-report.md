# Dental Atlas 4.1 — этап A

Проверена локальная preview-сборка на коммите `9b1ddf6` с рабочими изменениями этапа A. Production и `main` не изменялись. Для сравнения создан тег `before-visual-rework-9b1ddf6`.

## Требования и проверка

| Требование | Что сделано | Файл:строки | Как проверено |
|---|---|---|---|
| Удалить текстовые наклейки с фотографий | Удалены `.photo-floating-badge`, `.image-mark`, индексы филиалов и счётчики специалистов из реальной разметки; связанные стили удалены | `atlas-v4-1/**/{index,*.html}`, `atlas-v4-1/assets/v2.css`, `atlas-v4-1/assets/atlas-4-1.css` | Поиск по HTML/CSS не находит целевые классы; no-overlay: 90/90 |
| Удалить градиентные подложки и captions поверх кадров | Для галереи, hero-изображений услуг и профилей `figcaption` переведён в `position: static`, прозрачный фон и обычный отступ после изображения | `atlas-v4-1/assets/v2.css:171,251,301,733-734`; `atlas-v4-1/assets/atlas-4-1.css:264,862-867` | Playwright-проверка пересечений текста/контролов с media: 0 нарушений |
| Не перекрывать фото мобильными действиями записи | Мобильные действия сохранены, но вставляются перед футером в потоке документа; fixed-панель, закрывавшая нижнюю часть фото, убрана | `atlas-v4-1/assets/atlas-4-1.js:134-143`; `atlas-v4-1/assets/atlas-4-1.css:408-410,1091-1098` | no-overlay: 390 px без пересечений; кнопки остаются в DOM и работают штатным обработчиком |
| Сохранить подписи, когда они несут информацию | Описательные подписи реальных кадров оставлены под фото: кабинет, гигиена, микроскоп и т. п. | `atlas-v4-1/ispanskie/gallery/index.html:21`; `atlas-v4-1/prokshino/gallery/index.html:21` | Визуальная проверка мобильной галереи и full-page screenshot |
| Создать проверочный скрипт этапа A | Добавлен скрипт с реальными маршрутами двух филиалов, услуг и профилей | `tests/visual/no-photo-overlay.spec.js:1-96` | Запущено 45 маршрутов × 2 viewport (390 и 1440) |

## Скриншоты

До и после сохранены попарно с одинаковыми именами:

- [Испанские кварталы · 390 до](before/home-ispanskie-390.png) / [после](after/home-ispanskie-390.png)
- [Испанские кварталы · 1440 до](before/home-ispanskie-1440.png) / [после](after/home-ispanskie-1440.png)
- [Прокшино · 390 до](before/home-prokshino-390.png) / [после](after/home-prokshino-390.png)
- [Прокшино · 1440 до](before/home-prokshino-1440.png) / [после](after/home-prokshino-1440.png)
- [Галерея Прокшино · 390 до](before/gallery-prokshino-390.png) / [после](after/gallery-prokshino-390.png)

Для каждой пары также сохранён full-page вариант с суффиксом `-full.png`.

## Вывод проверочных скриптов

`tests/visual/no-photo-overlay.spec.js`:

```text
Running 90 tests using 1 worker
90 passed (1.1m)
```

Проверены все 45 маршрутов из `PAGES` на 390×844 и 1440×900. В итоговой выдаче нет `forbidden element`, `overlap` или `pseudo-text`.

`tests/visual/mobile-hero-metrics.spec.js` (создан на этапе A для последующих этапов, но текущим этапом не исправляется):

```text
Running 2 tests using 1 worker
FAIL /atlas-v4-1/ispanskie/index.html @390
{"heroHeight":953.75,"photoVisibleHeight":176.328125,"photoHeight":305.078125,"ctaTop":531.890625,"ctaBottom":583.453125,"ctaHeight":51.5625,"h1FontSize":47.97,"h1Lines":4,"leadLines":2,"bodyTextSize":16,"scrollWidth":390}
Expected photoVisibleHeight >= 340, received 176.328125

FAIL /atlas-v4-1/prokshino/index.html @390
{"heroHeight":915.65625,"photoVisibleHeight":214.421875,"photoHeight":305.078125,"ctaTop":493.796875,"ctaBottom":545.359375,"ctaHeight":51.5625,"h1FontSize":47.97,"h1Lines":3,"leadLines":3,"bodyTextSize":16,"scrollWidth":390}
Expected photoVisibleHeight >= 340, received 214.421875
```

Эти два результата относятся к этапу C (композиция первого экрана и размеры hero), поэтому на этапе A намеренно не менялись.

## Что не удалось или вызывает сомнения

- Этап B (изучение референсов), этап C (переработка первого экрана) и этап D (распространение на остальные страницы) не выполнялись по правилу «один этап за раз».
- Preview-сервер использован локально; production не публиковался и PR #2 не объединялся.
- Скриншоты и тесты фиксируют результат именно этапа A; несоответствия `mobile-hero-metrics` оставлены для следующего этапа после проверки владельцем.
