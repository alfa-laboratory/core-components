#!/bin/bash

# поднимаю версию во всех подпакетах
lerna version --no-push
# собираю корневой проект
yarn build
# публикую все подпакеты
lerna publish from-git --contents dist
# публикую корневой проект
yarn publish dist --no-git-tag-version
# копирую package.json, чтобы сохранить поднятую, во публикации, версию
cp dist/package.json package.json
# сохраняю в гите поднятую версию
git add package.json
git commit -m 'update version'
git push