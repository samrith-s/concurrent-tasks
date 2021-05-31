#!/bin/bash

source scripts/utils/init.sh;

if [[ ! " ${packages[@]} " =~ " $1 " ]] || [[ -z $1 ]];
then
    echo ""
    echo "Please provide one of the following package names:";
    echo "${packages[@]}"
    echo "";
    exit 1;
fi
