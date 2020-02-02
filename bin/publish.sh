#!/bin/bash

lerna version --no-push
yarn build
lerna publish from-git --contents dist
yarn publish dist --no-git-tag-version
cp dist/package.json package.json
git add package.json
git commit -m 'update version'
git push