## Тулзы для миграции с arui-feather на core-components.

С помощью данного cli-инструмента можно быстро заменить компоненты из arui-feather на компоненты из core-components.

На данный момент, для замены доступны следуюшие компоненты из arui-feather:

-   Heading
-   Paragraph
-   Label

### Использование

1. Установить к себе на проект:

```bash
$ yarn add --dev @alfalab/core-components-codemod
```

2. Заменить компоненты:

Можно заменить сразу все доступные компоненты:

```bash
$ npx core-components-codemod src/**/*.tsx
```

Можно заменять компоненты частично. Например только Label и Paragraph:

```bash
$ npx core-components-codemod --components=Label,Paragraph src/**/*.tsx
```

В большинстве случаев можно заменить один компонент на другой и однозначно поменять ему пропсы. Но это не всегда возможно. В таких случаях вы увидите предупреждение, и должны будете руками поменять пропсы у компонента.

Сейчас замена компонентов доступна только для кода, написанного на `typescript`. Если кому-то нужно мигрировать с `js` - дайте знать, докрутим.


### Запуск тестов

```bash
$ npx jest packages/codemod/src --config=jest.codemod.config.js
```
