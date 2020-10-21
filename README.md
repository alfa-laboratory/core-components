<div class="github-doc">

<p><img width="914" alt="Библиотека React компонентов для создания веб-интерфейсов" src="https://user-images.githubusercontent.com/109410/78970104-3873e000-7b11-11ea-945d-02f86cad62e0.png"/></p>

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

[Cторибук](https://alfa-laboratory.github.io/core-components/) с документацией и песочницей.

</div>

## Установка

Установка всех компонентов:

```bash
yarn add @alfalab/core-components
```

Каждый компонент публикуется отдельным пакетом, поэтому вы можете подключить только нужный, не устанавливая библиотеку целиком:

```bash
yarn add @alfalab/core-components-button
```

## Использование

```jsx
import { Button } from '@alfalab/core-components/button';
import { Button } from '@alfalab/core-components-button';
```

## Темизация

1.  Создайте у себя на проекте css файл с темой, например, theme.css:

    ```
    :root {
        --border-radius: 12px;
    }
    ```

2.  Подключите файл с темой:

-   Если вы используете нативные css-переменные, то просто подключите файл к проекту.

-   Если вы используете [arui-scripts](https://github.com/alfa-laboratory/arui-scripts), то добавьте в `package.json`:

    ```
    "aruiScripts": {
        "сomponentsTheme": "./node_modules/@alfalab/core-components-themes/click.css"
    }
    ```

-   В другом случае - используйте [postcss-custom-properties](https://github.com/postcss/postcss-custom-properties), указав в `importFrom` путь к файлу с темой.

[Подробнее о темизации](https://alfa-laboratory.github.io/core-components/master/?path=/docs/гайдлайны-темизация--page)

## Поддерживаемые браузеры

Мы поддерживаем две последние стабильные версии всех популярных браузеров. Исключение — IE11+ и Android 5+ (Mobile Chrome).

#### Desktop

-   Chrome
-   Yandex
-   Firefox
-   Edge
-   IE 11+
-   Safari

#### Mobile

-   Android 5+
-   iOS

## Разработка

```bash
$ git clone git@github.com:alfa-laboratory/core-components.git
$ cd core-components
$ yarn install
$ yarn start
```

Сторибук будет доступен по адресу http://localhost:9009/

### Сигнатуры коллбэков

> Компоненты передают в функции обратного вызова два аргумента:
>
> 1. `event: SyntheticEvent` - объект события, инициировавшего вызов.
> 2. `payload: {}` - объект с дополнительными данными. Например `{ amount: 5000 }`

### Импорт компонентов внутри компонентов

Так как у нас монорепозиторий, то все пакеты должны быть независимы. Если при разработке компонента вам потребовался другой компонент, то его нужно добавить как зависимость. Пример можно посмотреть в [Тултипе](https://github.com/alfa-laboratory/core-components/tree/master/packages/tooltip). Также нужно добавить пару опций в `tsconfig.json`:

```json
{
    "compilerOptions": {
        "paths": {
            "@alfalab/core-components-popover": ["../popover/src"] // для корректоной сборки rollup
        }
    },
    "references": [{ "path": "../popover" }] // для корректной работы IDE
}
```

## Релизы

Для выпуска новых версий используйте следущие команды:

```bash
$ yarn pub:patch # соберет и выпустит patch-версию
$ yarn pub:minor # соберет и выпустит minor-версию
$ yarn pub:major # соберет и выпустит major-версию
```

### Как выпустить бета-версию:

1. Собираем пакет

```bash
$ yarn build
```

2. Переходим в папку с собранным пакетом и обновляем версию

```bash
$ cd dist
$ npm version 2.0.0-beta.0 // подставить нужную версию
```

3. Публикуем пакет

```bash
npm publish --tag beta
```

## Коммиты

На проекте подключен `commitlint` для линтинга коммитов. На основании коммитов формируется `CHANGELOG.MD`.
Мы придерживаемся [AngularJS commit conventions.](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)
Коммиты можно делать с помощью утилиты `commitizen`:

```bash
$ git add .
$ yarn cm # запустит утилиту commitizen для создания коммита
$ git push
```

## Сборка компонентов

Компоненты поставляются в трех видах:

1. `ES5`

2. `ES5 с css-модулями`

3. `ES2020`

Импорт `ES5`:

```tsx
import { Button } from '@alfalab/core-components-button';
// или
import { Button } from '@alfalab/core-components/button';
```

Импорт `ES5` с css-модулями:

```tsx
import { Button } from '@alfalab/core-components-button/dist/cssm';
// или
import { Button } from '@alfalab/core-components/button/cssm';
```

Импорт `ES2020`:

```tsx
import { Button } from '@alfalab/core-components-button/dist/modern';
// или
import { Button } from '@alfalab/core-components/button/modern';
```

## Правила контрибьютинга

Мы открыты к любым предложениям по развитию библиотеки.
Отправляйте свои идеи и вопросы через [pull requests](https://github.com/alfa-laboratory/core-components/pulls) или [issues](https://github.com/alfa-laboratory/core-components/issues).

-   Уважаем тех, кто видит проблему и кидает PR.
-   Не знаете что делать – можно брать любую задачу без Assignee, назначив её на себя.
-   Знаете что делать и есть возможность – кидайте PR.
-   Знаете что делать, но нет времени – добавьте задачу (issue).

![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)

## Мейнтейнеры

-   [Евгений Сергеев](https://github.com/SiebenSieben)
-   [Александр Яценко](https://github.com/reme3d2y)
-   [Дмитрий Савкин](https://github.com/dmitrsavk)
