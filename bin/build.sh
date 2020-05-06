#!/bin/bash

# выхожу, если одна из команд завершилась неудачно
set -e

# удаляю билды
yarn clean

# компилю все подпакеты, за исключением core-components-vars
lerna exec --parallel --ignore @alfalab/core-components-vars -- tsc --build

# копирую все дополнительные файлы в dist
copy_cmd="yarn copyfiles -e \"**/*.{[jt]s*(x),snap}\" -u 1 \"src/**/*\" dist"
lerna exec --parallel -- $copy_cmd

# обрабатываю postcss в подпакетах, которые содержат css-файлы, за исключением core-components-vars
postcss_cmd='
if [ $(find . -type f -name "*.css" | wc -l) -gt 0 ];
    then postcss dist/*.css -d dist;
fi'
lerna exec --parallel --ignore @alfalab/core-components-vars -- $postcss_cmd

# копирую результат сборки в dist/modern
copy_modern="mkdir dist/modern && yarn copyfiles -e dist/modern -u 1 dist/**/* dist/modern"
lerna exec --parallel --ignore @alfalab/core-components-vars -- $copy_modern

# компилю все подпакеты в es2020, за исключением core-components-vars
lerna exec --parallel --ignore @alfalab/core-components-vars -- tsc --target es2020 --module ES2015 --outDir dist/modern

# удаляю папку dist в корне проекта
rm -rf dist

# запускаю скрипт build-root-package.sh во всех подпакетах
lerna exec --parallel -- $(pwd)/bin/build-root-package.sh \$LERNA_PACKAGE_NAME

# меняю импорты из @alfalab/core-components на относительные в агрегирующем пакете
yarn replace-in-file '/require\("@alfalab\/core-components-/g' 'require("../' dist/**/*.js --isRegex

# копирую package.json в сборку корневого пакета
cp package.json dist/package.json

# делаю корневой пакет публичным
yarn json -f dist/package.json -I -e "delete this.private" -e "delete this.workspaces"

# копирую package.json в dist для @alfalab/core-components-vars, т.к. он публикуется из папки dist
lerna exec --scope @alfalab/core-components-vars -- cp package.json dist/package.json
