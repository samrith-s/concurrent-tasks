#!/bin/bash

source scripts/utils/init.sh;

(
    cd core;
    $NODE_BIN_CORE/mocha -r ts-node/register './tests/**/*.ts';
)
