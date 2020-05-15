#!/bin/bash

# Сборка ts-пакетов

# выхожу, если одна из команд завершилась неудачно
set -e

# удаляю билды
yarn clean

# собираю все подпакеты, за исключением css-пакетов (vars, themes)
# lerna exec --parallel \
#     --ignore @alfalab/core-components-vars \
#     --ignore @alfalab/core-components-themes \
#     -- $(pwd)/bin/rollup.sh

lerna exec \
    --scope @alfalab/core-components-tooltip \
    -- $(pwd)/bin/rollup.sh