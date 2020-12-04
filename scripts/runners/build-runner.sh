#!/bin/bash

source scripts/utils/init.sh;

source scripts/utils/check-runner.sh $1

(
    cd runners/$1;
    $NODE_BIN_PACKAGES/rimraf dist
    NODE_ENV=production $NODE_BIN_PACKAGES/rollup -c '../../rollup.config.js'
)
