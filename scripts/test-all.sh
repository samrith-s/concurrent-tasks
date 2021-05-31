#!/bin/bash

source scripts/utils/init.sh;

scripts/core/test-core.sh

for package in "${packages[@]}"
do
    scripts/strategies/test-strategy.sh $package
done
