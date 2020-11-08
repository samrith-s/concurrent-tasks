#!/bin/bash

source scripts/utils/init.sh;

source scripts/utils/check-package.sh "$1"

command="
    clear; 
    $NODE_BIN/rollup -c \"../../rollup.config.js\";
    node dist/index.js
"

(
    cd packages/$1;
    $NODE_BIN/rimraf dist;
    eval $command;
    $NODE_BIN/chokidar "src/index.ts" -c "$command";
)
