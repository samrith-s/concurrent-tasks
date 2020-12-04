#!/bin/bash

source scripts/utils/init.sh;

command="
    clear; 
    $NODE_BIN_CORE/rollup -c \"../rollup.config.js\";
    node dist/cjs/index.js
"

(
    cd core;
    $NODE_BIN_CORE/rimraf dist;
    eval $command;
    $NODE_BIN_CORE/chokidar "src/**/*.ts" -c "$command";
)
