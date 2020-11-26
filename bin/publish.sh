#!/bin/bash

# выхожу, если одна из команд завершилась неудачно
set -e

# поднимаю версию во всех подпакетах
lerna version --no-push --no-commit-hooks
# собираю корневой проект
yarn build
# публикую все подпакеты
lerna publish from-git
# публикую корневой проект
yarn publish dist --no-git-tag-version
# обновляю версию в корневом пакете, генерирую CHANGELOG.MD, делаю коммит, создаю git-tag
yarn release --release-as $RELEASE_TYPE
# отправляю изменения на github
git push --follow-tags