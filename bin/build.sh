#!/bin/bash
# выхожу, если одна из команд завершилась неудачно
set -e

# удаляю билды
yarn clean

# собираю все подпакеты, за исключением css-пакетов (vars, themes)
lerna exec --parallel \
    --ignore @alfalab/core-components-vars \
    --ignore @alfalab/core-components-themes \
    -- $(pwd)/bin/rollup.sh

# копирую src в dist в css-пакетах (vars, themes)
copy_css="yarn copyfiles -u 1 \"src/**/*.css\" dist"
lerna exec \
    --scope @alfalab/core-components-vars \
    --scope @alfalab/core-components-themes \
    -- $copy_css

# собираю пакет themes
lerna exec --scope @alfalab/core-components-themes -- node $(pwd)/bin/build-themes.js

# запускаю скрипт build-root-package.sh во всех подпакетах
lerna exec --parallel -- $(pwd)/bin/build-root-package.sh \$LERNA_PACKAGE_NAME

# меняю импорты из @alfalab/core-components на относительные в агрегирующем пакете
# TODO: сделать это плагином rollup
yarn replace-in-file '/require\("@alfalab\/core-components-/g' 'require("../' dist/**/*.js --isRegex

# копирую package.json в сборку корневого пакета
cp package.json dist/package.json

# делаю корневой пакет публичным
yarn json -f dist/package.json -I -e "delete this.private" -e "delete this.workspaces"

# копирую package.json в dist для css-пакетов, т.к. они публикуется из папки dist
lerna exec \
    --scope @alfalab/core-components-vars \
    --scope @alfalab/core-components-themes \
    -- cp package.json dist/package.json
