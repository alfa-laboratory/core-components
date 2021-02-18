#!/bin/bash

set -e

# Релизим рут-пакет с помощью semantic-release
semantic_output=$(yarn semantic-release)

# Выводим логи семантика
echo $semantic_output

# Проеряем, что semantic-release зарелизил рут-пакет (пока не знаю, как это можно сделать по-другому)
if [[ $semantic_output =~ "Publishing version" ]]
then
    git remote set-url origin https://semantic-release-bot:$GITHUB_TOKEN@github.com/alfa-laboratory/core-components.git
    git checkout master
    git pull origin master --rebase
    git fetch --tags

    if [ -z $(lerna changed) ]
    then
        echo "There are no relevant changes, so no new versions are released."
    else
        lerna version --conventional-commits --no-commit-hooks --yes
        git push origin master
        lerna publish from-git --yes
    fi
else
    exit 0
fi
