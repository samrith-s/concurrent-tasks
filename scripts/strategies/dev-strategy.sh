#!/bin/bash

source scripts/utils/init.sh;

source scripts/utils/check-strategy.sh "$1"

command="
    clear; 
    $NODE_BIN_PACKAGES/rollup -c \"../../rollup.config.js\";
    node dist/cjs/index.js
"

(
    cd strategies/$1;
    $NODE_BIN_PACKAGES/rimraf dist;
    eval $command;
    $NODE_BIN_PACKAGES/chokidar "src/**/*.ts" -c "$command";
)
