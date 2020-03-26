#!/bin/bash

# удаляю папки dist во всех подпакетах
lerna exec --parallel -- rm -rf dist
# компилю все подпакеты
lerna exec --parallel -- NODE_ENV=production babel \
    --root-mode upward \
    --extensions '.ts,.tsx' src -d dist \
    --copy-files \
    --no-copy-ignored \
    --ignore **/*.stories.tsx,**/*.test.tsx
# удаляем лишнее из билдов во всех подпакетах
lerna exec --parallel -- rm -rf ./dist/__snapshots__
# обрабатываю ts во всех подпакетах
lerna exec --parallel -- tsc --p tsconfig.json
# обрабатываю postcss во всех подпакетах
lerna exec --parallel -- postcss dist/*.css -d dist
# копирую package.json во всех подпакетах
lerna exec --parallel -- cp package.json dist/package.json
# удаляю папку dist в корне проекта
rm -rf dist
# запускаю скрипт build-root-package.sh во всех подпакетах
lerna exec --parallel -- $(pwd)/bin/build-root-package.sh \$LERNA_PACKAGE_NAME
# копирую package.json в сборку корневого пакета
cp package.json dist/package.json
