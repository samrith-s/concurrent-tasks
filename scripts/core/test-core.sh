#!/bin/bash

source scripts/utils/init.sh;

(
    cd core;
    export TS_NODE_COMPILER_OPTIONS='{"module": "commonjs" }';
    $NODE_BIN_CORE/mocha -r ts-node/register './tests/**/*.ts';
)
