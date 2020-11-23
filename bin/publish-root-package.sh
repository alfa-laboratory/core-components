#!/bin/bash

# выхожу, если одна из команд завершилась неудачно
set -e

# получаем последний актуальный git тег
current_version=`git describe --tags $(git rev-list --tags --max-count=1) | sed -e "s/^v//"`

yarn publish dist --no-git-tag-version --new-version $current_version
