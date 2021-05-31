#!/bin/bash

source scripts/utils/init.sh;

(
    cd strategies/strategy-$1;
    $NODE_BIN_PACKAGES/mocha -r ts-node/register './tests/**/*.ts';
)
