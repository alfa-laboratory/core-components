<img width="914" alt="Библиотека React компонентов для создания веб-интерфейсов" src="https://user-images.githubusercontent.com/109410/78970104-3873e000-7b11-11ea-945d-02f86cad62e0.png"/>

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## ✨ Возможности

- Набор готовых к использованию и протестированных React компонентов, которые реализуют [дизайн-систему Альфа-банка](https://digital.alfabank.ru/principles)
- Все компоненты написаны на TypeScript и типизированы.
- Удобный [сторибук](https://alfa-laboratory.github.io/core-components/) с песочницей.
- Компоненты открыты к темизации через css-переменные.

## 🖥 Поддерживаемые браузеры


| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/yandex/yandex_48x48.png" alt="Yandex Browser" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Yandex Browser |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <p align="center">IE11, Edge</p>                                                                                                                                                                                            | <p align="center">последние 2 версии</p>                                                                                                                                                                                                  | <p align="center">последние 2 версии</p>                                                                                                                                                                                                | <p align="center">последние 2 версии</p>                                                                                                                                                                                                | <p align="center">последние 2 версии</p>                                                                                                                                                                                            | <p align="center">последние 2 версии</p>                                                                                                                                                                                                        |

## 📦 Установка


### Установка всех компонентов
```bash
yarn add @alfa-labaratory/core-components
```

### Установка определенного компонента

Каждый компонент публикуется отдельным пакетом, поэтому вы можете подключить только нужный, не устанавливая библиотеку целиком.

```bash
yarn add @alfa-labaratory/core-components-button
```

## 🔨 Использование

```jsx
import { Button } from '@alfalab/core-components/button';
import { Button } from '@alfalab/core-components-button';
```

## 💅 Темизация

1. Создайте у себя на проекте css файл с темой, например theme.css:
```
:root {
    --border-radius: 100px;
}
```

2. Подключите файл с темой:
- Если вы используете нативные css-переменные, то просто подключите файл к проекту.

- Если вы используете [arui-scripts](https://github.com/alfa-laboratory/arui-scripts), то добавьте в `package.json`:
   ```
   "aruiScripts": {
        "сomponentsTheme": "./node_modules/@alfalab/core-components-themes/click.css"
    }
   ```
- В другом случае - используйте [alfa-laboratory/postcss-custom-properties](https://github.com/alfa-laboratory/postcss-custom-properties), указав в `importFrom` путь к файлу с темой.

## 🔗 Ссылки

[Alfa-Bank UI Icons](https://github.com/alfa-laboratory/icons)

## ⌨️ Разработка

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
### Как публиковать пакеты:
```bash
$ yarn pub:patch # соберет и выпустит patch-версию
$ yarn pub:minor # соберет и выпустит minor-версию
$ yarn pub:major # соберет и выпустит major-версию
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

## 🤝 Contributing [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Мы открыты к любым предложениям по развитию библиотеки.
Отправляйте свои идеи и вопросы через [pull requests](https://github.com/alfa-laboratory/core-components/pulls) или [issues](https://github.com/alfa-laboratory/core-components/issues).
Пожалуйста, сначала прочтите наш [contributing guide](https://github.com/alfa-laboratory/core-components/blob/master/.github/CONTRIBUTING.md) и [правила разработки](https://github.com/alfa-laboratory/core-components/wiki/Development).

## 👨🏻‍💻 Мейнтейнеры

* [Евгений Сергеев](https://github.com/SiebenSieben)
* [Александр Яценко](https://github.com/reme3d2y)
* [Дмитрий Савкин](https://github.com/dmitrsavk)
* [Евгений Тройнов](https://github.com/etroynov)
