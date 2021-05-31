#!/bin/bash

source scripts/utils/init.sh;

(
    cd core;
    env TS_NODE_COMPILER_OPTIONS='{\"module\": \"commonjs\" }' $NODE_BIN_PACKAGES/mocha -r ts-node/register './tests/**/*.ts';
)
