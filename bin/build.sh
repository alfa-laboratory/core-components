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

# собираю css пакеты
copy_css="yarn copyfiles -u 1 \"src/**/*.css\" dist"
copy_package="yarn copyfiles package.json dist"
lerna exec \
    --scope @alfalab/core-components-vars \
    --scope @alfalab/core-components-themes \
    -- "$copy_css && $copy_package"

# собираю пакет themes
lerna exec --scope @alfalab/core-components-themes -- node $(pwd)/bin/build-themes.js

# копирую собранные css пакеты в корневой пакет
copy_to_root="mkdir -p ../../dist/\${PWD##*/} && cp -r dist/ ../../dist/\${PWD##*/}"
lerna exec \
    --scope @alfalab/core-components-vars \
    --scope @alfalab/core-components-themes \
    -- $copy_to_root

# копирую package.json в сборку корневого пакета
cp package.json dist/package.json

# делаю корневой пакет публичным
yarn json -f dist/package.json -I -e "delete this.private" -e "delete this.workspaces"
