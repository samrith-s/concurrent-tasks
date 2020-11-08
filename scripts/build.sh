#!/bin/bash

source scripts/utils/init.sh;

source scripts/utils/check-package.sh $1

(
    cd packages/$1;
    $NODE_BIN/rimraf dist
    NODE_ENV=production $NODE_BIN/rollup -c '../../rollup.config.js'
)
