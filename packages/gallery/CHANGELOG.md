# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-gallery@2.0.3...@alfalab/core-components-gallery@3.0.0) (2021-12-08)


* fix!: новый cdn иконок (#913) (#917) ([224831f](https://github.com/alfa-laboratory/core-components/commit/224831f41ed2de49dc1a228dc081b0629cf274b1)), closes [#913](https://github.com/alfa-laboratory/core-components/issues/913) [#917](https://github.com/alfa-laboratory/core-components/issues/917)


### BREAKING CHANGES

* Добавьте новый домен в список разрешенных 'img-src': `'self' alfabank.gcdn.co data: 'self'`

This reverts commit 953fbcfec46a40089a5cfde670597315269b05f5.





## [2.0.3](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-gallery@2.0.2...@alfalab/core-components-gallery@2.0.3) (2021-12-08)


### Bug Fixes

* revert 0e8124552206f96149d104f65cff1667e857bf01 ([#916](https://github.com/alfa-laboratory/core-components/issues/916)) ([953fbcf](https://github.com/alfa-laboratory/core-components/commit/953fbcfec46a40089a5cfde670597315269b05f5))





## [2.0.2](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-gallery@2.0.1...@alfalab/core-components-gallery@2.0.2) (2021-12-08)


### Bug Fixes

* актуализируем @alfalab/utils ([#897](https://github.com/alfa-laboratory/core-components/issues/897)) ([30fb88e](https://github.com/alfa-laboratory/core-components/commit/30fb88eee36f68cabf80069e5125d911fabde4a5))
* новый cdn иконок ([#913](https://github.com/alfa-laboratory/core-components/issues/913)) ([0e81245](https://github.com/alfa-laboratory/core-components/commit/0e8124552206f96149d104f65cff1667e857bf01))





## [2.0.1](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-gallery@2.0.0...@alfalab/core-components-gallery@2.0.1) (2021-12-01)

**Note:** Version bump only for package @alfalab/core-components-gallery





# [2.0.0](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-gallery@1.2.2...@alfalab/core-components-gallery@2.0.0) (2021-11-26)


### Features

* **button:** добавлена кнопка размера 40px, изменены скругления ([#886](https://github.com/alfa-laboratory/core-components/issues/886)) ([88e657a](https://github.com/alfa-laboratory/core-components/commit/88e657a9f0f68b8b58f6e9437053954ee984f83c)), closes [#890](https://github.com/alfa-laboratory/core-components/issues/890)


### BREAKING CHANGES

* **button:** Кнопка размера xs теперь имеет размер 40px. Тем, кто использовал размер xs, надо
заменить размер  на xxs. Можно воспользоваться codemod.

* feat(codemod): add button xs to xxs transformer

* feat(tag): добавлен тэг размера 40px, изменены отступы

Добавлен тэг размером 40px, изменены отступы. Тем, кто использовал размер xs, надо заменить размер
на xxs.
* **button:** Тэг размера xs теперь имеет размер 40px. Тем, кто использовал размер xs, надо
заменить размер на xxs. Можно воспользоваться codemod.

* test: update screenshots

* test: update screenshots

* feat(button): linter fix

* feat(button): fix min-width

* feat(tag): remove vertical paddings

* feat(tag): remove vertical paddings

* feat(button): updates





## [1.2.2](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-gallery@1.2.1...@alfalab/core-components-gallery@1.2.2) (2021-11-16)

**Note:** Version bump only for package @alfalab/core-components-gallery





## [1.2.1](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-gallery@1.2.0...@alfalab/core-components-gallery@1.2.1) (2021-11-08)

**Note:** Version bump only for package @alfalab/core-components-gallery





# [1.2.0](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-gallery@1.1.0...@alfalab/core-components-gallery@1.2.0) (2021-09-22)


### Features

* **gallery:** add `canDownload` image prop, some refactoring ([#837](https://github.com/alfa-laboratory/core-components/issues/837)) ([b0c6665](https://github.com/alfa-laboratory/core-components/commit/b0c6665bb6a3d4b1e9d5bc176149f63ca2bd8542))





# 1.1.0 (2021-09-16)


### Features

* **gallery:** add component ([#815](https://github.com/alfa-laboratory/core-components/issues/815)) ([7ffd20e](https://github.com/alfa-laboratory/core-components/commit/7ffd20e2d007f658223d29aa943639c13ad51342)), closes [#774](https://github.com/alfa-laboratory/core-components/issues/774) [#795](https://github.com/alfa-laboratory/core-components/issues/795)
