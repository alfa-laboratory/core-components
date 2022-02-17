# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.1.1](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@5.1.0...@alfalab/core-components-button@5.1.1) (2022-02-15)

**Note:** Version bump only for package @alfalab/core-components-button





# [5.1.0](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@5.0.5...@alfalab/core-components-button@5.1.0) (2022-02-09)


### Features

* **themes:** introducing intranet theme ([#983](https://github.com/alfa-laboratory/core-components/issues/983)) ([85eb9cf](https://github.com/alfa-laboratory/core-components/commit/85eb9cfffeef31b886c5123d6333e177c261ac62))





## [5.0.5](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@5.0.4...@alfalab/core-components-button@5.0.5) (2022-02-03)


### Bug Fixes

* **loader:** fix animation in IE ([#970](https://github.com/alfa-laboratory/core-components/issues/970)) ([03df943](https://github.com/alfa-laboratory/core-components/commit/03df9438f00bda639aae78aadb940161112a2672))





## [5.0.4](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@5.0.3...@alfalab/core-components-button@5.0.4) (2022-02-02)


### Bug Fixes

* **themes:** fix font weight mobile button ([#972](https://github.com/alfa-laboratory/core-components/issues/972)) ([447a89d](https://github.com/alfa-laboratory/core-components/commit/447a89dde25aa7659d771ae1c722086354323706))





## [5.0.3](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@5.0.2...@alfalab/core-components-button@5.0.3) (2021-12-29)


### Bug Fixes

* **button:** решение проблемы с тултипом и заблокированной кнопкой ([#920](https://github.com/alfa-laboratory/core-components/issues/920)) ([d04f311](https://github.com/alfa-laboratory/core-components/commit/d04f31109baf340a4dc7264d3b8ab13109a5a68c)), closes [#799](https://github.com/alfa-laboratory/core-components/issues/799)
* **button:** убраны лишние отступы для вида ghost ([#933](https://github.com/alfa-laboratory/core-components/issues/933)) ([f43cdf6](https://github.com/alfa-laboratory/core-components/commit/f43cdf6afe349d2c7cb0d8436123e63aed347b54))





## [5.0.2](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@5.0.1...@alfalab/core-components-button@5.0.2) (2021-12-14)


### Bug Fixes

* **button:** удален вызов console.warn, если process.env.NODE_ENV !== 'development' ([d3e14ce](https://github.com/alfa-laboratory/core-components/commit/d3e14cef7835b5512e4848c5a1048475a8990018))





## [5.0.1](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@5.0.0...@alfalab/core-components-button@5.0.1) (2021-12-08)


### Bug Fixes

* актуализируем @alfalab/utils ([#897](https://github.com/alfa-laboratory/core-components/issues/897)) ([30fb88e](https://github.com/alfa-laboratory/core-components/commit/30fb88eee36f68cabf80069e5125d911fabde4a5))





# [5.0.0](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@4.4.0...@alfalab/core-components-button@5.0.0) (2021-11-26)


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





# [4.4.0](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@4.3.0...@alfalab/core-components-button@4.4.0) (2021-09-14)


### Features

* **vars:** updated colors and typography from latest alfa-ui-primitives ([#803](https://github.com/alfa-laboratory/core-components/issues/803)) ([0d5b2a3](https://github.com/alfa-laboratory/core-components/commit/0d5b2a30a78e70392dd505790a92bc3bc83f9386))





# [4.3.0](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@4.2.0...@alfalab/core-components-button@4.3.0) (2021-08-27)


### Features

* custom components for button and link ([#814](https://github.com/alfa-laboratory/core-components/issues/814)) ([a623dd0](https://github.com/alfa-laboratory/core-components/commit/a623dd021ef611f9994a6587ba6a0d0ee9d8929c))





# [4.2.0](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@4.1.0...@alfalab/core-components-button@4.2.0) (2021-08-04)


### Features

* add mods colors ([#770](https://github.com/alfa-laboratory/core-components/issues/770)) ([fe985f4](https://github.com/alfa-laboratory/core-components/commit/fe985f467b4d47a5152e168d2ab3846872d1a574))





# [4.1.0](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@4.0.2...@alfalab/core-components-button@4.1.0) (2021-07-23)


### Features

* **input:** input mobile theme (PDS-241) ([#737](https://github.com/alfa-laboratory/core-components/issues/737)) ([88f6f7c](https://github.com/alfa-laboratory/core-components/commit/88f6f7c58968b9564970eaa3d759aa2bc275ca7e))
* add mobile theme for tag, radio, checkbox (PDS-244/247/248) ([#717](https://github.com/alfa-laboratory/core-components/issues/717)) ([36e2d99](https://github.com/alfa-laboratory/core-components/commit/36e2d99c716a03e7f319439df9ca47ec43ad4b71))





## [4.0.2](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@4.0.1...@alfalab/core-components-button@4.0.2) (2021-07-19)

**Note:** Version bump only for package @alfalab/core-components-button





## [4.0.1](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@4.0.0...@alfalab/core-components-button@4.0.1) (2021-07-09)

**Note:** Version bump only for package @alfalab/core-components-button





# [4.0.0](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@3.0.1...@alfalab/core-components-button@4.0.0) (2021-07-08)


### Features

* upgrade storybook ([#696](https://github.com/alfa-laboratory/core-components/issues/696))


## [3.0.1](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@3.0.0...@alfalab/core-components-button@3.0.1) (2021-05-31)

**Note:** Version bump only for package @alfalab/core-components-button





# [3.0.0](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@2.3.2...@alfalab/core-components-button@3.0.0) (2021-05-25)


### Features

* **button:** add inverted ([#649](https://github.com/alfa-laboratory/core-components/issues/649)) ([be321b0](https://github.com/alfa-laboratory/core-components/commit/be321b07e99d20824138ad65141f3fbed1b6e315)), closes [#658](https://github.com/alfa-laboratory/core-components/issues/658) [#657](https://github.com/alfa-laboratory/core-components/issues/657)


### BREAKING CHANGES

* **button:** remove inverted themes





## [2.3.2](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@2.3.1...@alfalab/core-components-button@2.3.2) (2021-05-25)

**Note:** Version bump only for package @alfalab/core-components-button





## [2.3.1](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@2.3.0...@alfalab/core-components-button@2.3.1) (2021-05-18)


### Bug Fixes

* **button:** loader position in ie ([#661](https://github.com/alfa-laboratory/core-components/issues/661)) ([6f0ddab](https://github.com/alfa-laboratory/core-components/commit/6f0ddab3a3e59672f20b0f2239a4de6ba548edb1))





# [2.3.0](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@2.2.0-beta.4...@alfalab/core-components-button@2.3.0) (2021-05-07)


### Features

* **button:** fix version ([#648](https://github.com/alfa-laboratory/core-components/issues/648)) ([ec51599](https://github.com/alfa-laboratory/core-components/commit/ec5159910a7fdc103d4f4e8d3d4198db3ffbdcc8))





# [2.2.0-beta.4](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@2.2.0-beta.3...@alfalab/core-components-button@2.2.0-beta.4) (2021-05-07)


### Features

* **button:** add loader minimal display interval ([#634](https://github.com/alfa-laboratory/core-components/issues/634)) ([d2f7edc](https://github.com/alfa-laboratory/core-components/commit/d2f7edc52c3e43ce3f5db8250446227b869ab731))





# [2.2.0-beta.3](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@2.2.0-beta.2...@alfalab/core-components-button@2.2.0-beta.3) (2021-04-28)


### Features

* **button:** experimental active transform (site theme) ([a741e4f](https://github.com/alfa-laboratory/core-components/commit/a741e4fb73716902e6a72957e672921c21e7696b))





# [2.2.0-beta.2](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@2.2.0...@alfalab/core-components-button@2.2.0-beta.2) (2021-04-26)

**Note:** Version bump only for package @alfalab/core-components-button





# [2.2.0](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@2.1.7...@alfalab/core-components-button@2.2.0) (2021-04-01)


### Features

* **button:** updated xs button font-weight ([#599](https://github.com/alfa-laboratory/core-components/issues/599)) ([b05a554](https://github.com/alfa-laboratory/core-components/commit/b05a5547c97afba0d66489eca83a7a04d6c24283))





## [2.1.7](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@2.1.6...@alfalab/core-components-button@2.1.7) (2021-03-30)

**Note:** Version bump only for package @alfalab/core-components-button





## [2.1.6](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@2.1.5...@alfalab/core-components-button@2.1.6) (2021-03-24)

**Note:** Version bump only for package @alfalab/core-components-button





## [2.1.5](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@2.1.4...@alfalab/core-components-button@2.1.5) (2021-03-19)


### Bug Fixes

* **button:** fixed alignment of several buttons in a row ([#561](https://github.com/alfa-laboratory/core-components/issues/561)) ([8d9e1e2](https://github.com/alfa-laboratory/core-components/commit/8d9e1e2f7a4ba8c5c986bb833f7424b38601d463))





## [2.1.4](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@2.1.2...@alfalab/core-components-button@2.1.4) (2021-03-18)


### Bug Fixes

* one more sborka bug ([#579](https://github.com/alfa-laboratory/core-components/issues/579)) ([9fbe0be](https://github.com/alfa-laboratory/core-components/commit/9fbe0beca56ec5971de78b3f6cda25305b260efc))





## [2.1.2](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@2.1.0...@alfalab/core-components-button@2.1.2) (2021-03-16)


### Bug Fixes

* border-radius in packages ([781749e](https://github.com/alfa-laboratory/core-components/commit/781749ef38aefd5a6707ac56d2e297dce9f3e073))





# [2.1.0](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@2.0.2...@alfalab/core-components-button@2.1.0) (2021-03-15)


### Features

* **vars:** introducing border-radius vars ([1a6fb28](https://github.com/alfa-laboratory/core-components/commit/1a6fb287bcfab50048c3a9100645b4dee8cd3395))





## [2.0.2](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@2.0.1...@alfalab/core-components-button@2.0.2) (2021-03-14)


### Bug Fixes

* **button:** set type button by default ([#564](https://github.com/alfa-laboratory/core-components/issues/564)) ([59fdefd](https://github.com/alfa-laboratory/core-components/commit/59fdefd4f37fbe589840aa8944d88bde5b8cda6e))





## [2.0.1](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@2.0.0...@alfalab/core-components-button@2.0.1) (2021-03-10)

**Note:** Version bump only for package @alfalab/core-components-button





# [2.0.0](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@1.15.4...@alfalab/core-components-button@2.0.0) (2021-03-04)


### Features

* size vars (xs/s/m/l/xl → 32/48/56/64/72) ([d7254d2](https://github.com/alfa-laboratory/core-components/commit/d7254d2963106663e8f04b84bc747b38e4f57632))
* **button:** changed size L (72 → 64), added size XL (72) ([051d964](https://github.com/alfa-laboratory/core-components/commit/051d964e83fd7af3703c82facf75345eca66915b))


### BREAKING CHANGES

* **button:** size L changed to size XL





## [1.15.4](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@1.15.3...@alfalab/core-components-button@1.15.4) (2021-03-03)

**Note:** Version bump only for package @alfalab/core-components-button





## [1.15.3](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@1.15.2...@alfalab/core-components-button@1.15.3) (2021-03-03)

**Note:** Version bump only for package @alfalab/core-components-button





## [1.15.2](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@1.15.1...@alfalab/core-components-button@1.15.2) (2021-03-03)

**Note:** Version bump only for package @alfalab/core-components-button





## [1.15.1](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@1.15.0...@alfalab/core-components-button@1.15.1) (2021-02-20)

**Note:** Version bump only for package @alfalab/core-components-button





# [1.15.0](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@1.14.1...@alfalab/core-components-button@1.15.0) (2021-02-19)


### Features

* **button:** add rel='noopener noreferrer' if target='blank' ([#522](https://github.com/alfa-laboratory/core-components/issues/522)) ([a1da871](https://github.com/alfa-laboratory/core-components/commit/a1da87118a32195ba844c239f5a0f73e164faa6f))





## [1.14.1](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@1.14.0...@alfalab/core-components-button@1.14.1) (2021-02-18)


### Bug Fixes

* update versions ([#525](https://github.com/alfa-laboratory/core-components/issues/525)) ([31b2e4c](https://github.com/alfa-laboratory/core-components/commit/31b2e4c92fde6e2b63a3391a4e053cd328e93e70))





# [@alfalab/core-components-button-v1.7.0](https://github.com/alfa-laboratory/core-components/compare/@alfalab/core-components-button@1.6.7...@alfalab/core-components-button@1.7.0) (2020-11-25)


### Bug Fixes

* slightly better and safer ie fixes ([0e34b4f](https://github.com/alfa-laboratory/core-components/commit/0e34b4fb9800a435c05dc8f83146ce5617cf99a5))


### Features

* **button:** design review fixes ([e8f5faf](https://github.com/alfa-laboratory/core-components/commit/e8f5faf42b2ea98eff7d5914076a1916008b13b9))
