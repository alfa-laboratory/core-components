#!/bin/bash

# удаляем неиспользуемые css-переменные из сборки
lerna exec --parallel \
    --ignore @alfalab/core-components-vars \
    --ignore @alfalab/core-components-themes \
    -- node ../../bin/purgecss.js
