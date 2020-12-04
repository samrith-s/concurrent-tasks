#!/bin/bash

source scripts/utils/init.sh;

source scripts/utils/check-package.sh "$1"

command="
    clear; 
    $NODE_BIN_PLUGIN/rollup -c \"../../rollup.config.js\";
    node dist/index.js
"

(
    cd plugins/$1;
    $NODE_BIN_PLUGIN/rimraf dist;
    eval $command;
    $NODE_BIN_PLUGIN/chokidar "src/**/*.ts" -c "$command";
)
