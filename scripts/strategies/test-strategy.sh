#!/bin/bash

source scripts/utils/init.sh;

(
    cd strategies/strategy-$1;
    export TS_NODE_COMPILER_OPTIONS='{"module": "commonjs" }';
    $NODE_BIN_PACKAGES/mocha -r ts-node/register './tests/**/*.ts';
)
