#!/bin/bash

source scripts/utils/init.sh;

(
    cd core;
    $NODE_BIN_CORE/rimraf dist
    NODE_ENV=production $NODE_BIN_CORE/rollup -c '../rollup.config.js'
)
