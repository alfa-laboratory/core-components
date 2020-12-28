## Как писать тест для нового компонента

Так выглядит типовой тест файл `component.screenshot.test.tsx`:
```
/**
 * @jest-environment node
 */
import axios from 'axios';

import { screenshotTesting, getScreenshotTestCases } from '../../utils';

const cases = getScreenshotTestCases({
    host: 'http://localhost:9009/iframe.html',
    items: [
        {
            group: 'components',
            name: 'amount',
            variant: '',
            params: {
                value: [12300, 40000, 12000],
                currency: ['RUR', 'EUR', 'USD', 'SOS', 'ZAR'],
                // view: ['default', 'withZeroMinorPart'],
            },
        },
    ],
});

describe('Amount | screenshots', screenshotTesting(cases, it, beforeAll, afterAll, expect));
```

## Как запустить отдельный тест

```
➜ yarn test packages/amount/src/component.screenshots.test.tsx
```

## Как запустить все тесты

```
➜ yarn test
```

## Как обновить существующий скриншот при изменении компонента

```
➜ yarn test packages/amount/src/component.screenshots.test.tsx -u
```

## Как устроена работа скриншотного тестирования изнутри

Запрос отправляется на сервер который передает данные из запроса в playwright который в качестве результата возвращает изображение которое в дальнейшем сравнивается с локальной копией.

## Куда скрипт стучится для того чтобы получить скриншот

```
POST: http://digital/playwright // image/png
```

## Что находится внутри докер-контейнера, который возвращает скриншотные тесты

* Koa;
* Playwright;
