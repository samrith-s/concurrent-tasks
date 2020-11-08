#!/bin/bash

source scripts/utils/init.sh;

for package in "${packages[@]}"
do
    (
        eslint packages/$package/src/**
    )
done
