#!/bin/bash

# выхожу, если одна из команд завершилась неудачно
set -e

# поднимаю версию во всех подпакетах
lerna version --no-push
# собираю корневой проект
yarn build
# публикую все подпакеты
lerna publish from-git
# публикую корневой проект
yarn publish dist --no-git-tag-version
# обновляю версию в корневом package.json после публикации
version=$(yarn --silent json -f dist/package.json version)
yarn json -f package.json -I -e "this.version='$version'"
# сохраняю в гите поднятую версию
git add package.json
git commit -m 'update version'
git push
