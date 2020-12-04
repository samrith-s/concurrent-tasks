#!/bin/bash

export NODE_BIN="./node_modules/.bin"
export NODE_BIN_CORE="../node_modules/.bin"
export NODE_BIN_PACKAGES="../../node_modules/.bin"
list=$(yarn lerna list)
list_split=( ${list} )

for i in "${list_split[@]}"
do
    if [[ $i = @* ]]
    then
        packageName=${i/@concurrent-tasks\//""};
        if [[ "$packageName" != "core" ]]
        then
            packages+=("$packageName");
        fi
    fi
done

export packages;
