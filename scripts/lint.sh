#!/bin/bash

source scripts/utils/init.sh;

eslint core/src/**

for package in "${packages[@]}"
do
    if [[ "$package" != "core" ]] 
    then
        (
            eslint strategies/$package/src/**
        )
    fi
done
