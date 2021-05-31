#!/bin/bash

source scripts/utils/init.sh;

printf "\n\nBuilding package: $1"
source scripts/utils/check-strategy.sh "$1"

(
    cd strategies/strategy-$1;
    $NODE_BIN_PACKAGES/rimraf dist
    NODE_ENV=production $NODE_BIN_PACKAGES/rollup -c '../../rollup.config.js'
)
