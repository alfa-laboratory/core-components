#!/bin/bash

ROLLUP_CONFIG_PATH="rollup.config.js"
rollup -c ${LERNA_ROOT_PATH}/${ROLLUP_CONFIG_PATH} --silent
