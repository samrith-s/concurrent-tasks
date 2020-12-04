#!/bin/bash

source scripts/utils/init.sh;

source scripts/utils/check-plugin.sh $1

(
    cd plugins/$1;
    $NODE_BIN_PLUGIN/rimraf dist
    NODE_ENV=production $NODE_BIN_PLUGIN/rollup -c '../../rollup.config.js'
)
