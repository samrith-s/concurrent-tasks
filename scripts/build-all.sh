#!/bin/bash

source scripts/utils/init.sh;

for package in "${packages[@]}"
do
    scripts/build.sh $package
done
