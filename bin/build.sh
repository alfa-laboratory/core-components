#!/bin/bash

# выхожу, если одна из команд завершилась неудачно
set -e

# удаляю папки dist во всех подпакетах
lerna exec --parallel -- rm -rf dist
# компилю все подпакеты
lerna exec --parallel -- NODE_ENV=production babel \
    --root-mode upward \
    --extensions '.ts,.tsx' src -d dist \
    --copy-files \
    --no-copy-ignored \
    --ignore **/*.stories.tsx,**/*.test.tsx
# удаляю снэпшоты из билдов во всех подпакетах
lerna exec --parallel -- rm -rf ./dist/__snapshots__
# обрабатываю ts во всех подпакетах
lerna exec --parallel -- tsc --p tsconfig.json
# обрабатываю postcss в подпакетах, которые содержат css-файлы, за исключением core-components-vars
postcss_cmd='
if [ $(find . -type f -name "*.css" | wc -l) -gt 0 ];
    then postcss dist/*.css -d dist;
fi'
lerna exec --parallel --ignore @alfalab/core-components-vars -- $postcss_cmd
# копирую package.json во всех подпакетах
lerna exec --parallel -- cp package.json dist/package.json
# удаляю папку dist в корне проекта
rm -rf dist
# запускаю скрипт build-root-package.sh во всех подпакетах
lerna exec --parallel -- $(pwd)/bin/build-root-package.sh \$LERNA_PACKAGE_NAME
# копирую package.json в сборку корневого пакета
cp package.json dist/package.json
