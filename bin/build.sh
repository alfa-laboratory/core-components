#!/bin/bash

lerna exec --parallel -- rm -rf dist
lerna exec --parallel -- NODE_ENV=production babel \
    --root-mode upward \
    --extensions '.ts,.tsx' src -d dist \
    --copy-files \
    --no-copy-ignored \
    --ignore **/*.stories.tsx,**/*.test.tsx
lerna exec --parallel -- tsc --p tsconfig.json
lerna exec --parallel -- postcss dist/*.css -d dist
lerna exec --parallel -- cp package.json dist/package.json
rm -rf dist
lerna exec --parallel -- $(pwd)/bin/build-root-package.sh \$LERNA_PACKAGE_NAME
cp -r packages/vars dist
cp package.json dist/package.json
