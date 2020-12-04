#!/bin/bash

export NODE_BIN_CORE="../node_modules/.bin"
export NODE_BIN_PLUGIN="../../node_modules/.bin"
list=$(yarn lerna list)
list_split=( ${list} )

for i in "${list_split[@]}"
do
    if [[ $i = @* ]]
    then
        packages+=(${i/@concurrent-tasks\//""});
    fi
done

export packages;
