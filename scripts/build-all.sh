NODE_BIN="../../node_modules/.bin"
list=$(yarn lerna list)
list_split=( ${list} )

for i in "${list_split[@]}"
do
    if [[ $i = @* ]]
    then
        package=${i/@concurrent-tasks\//""};
        (
            cd packages/$package;
            $NODE_BIN/rimraf dist
        )
    fi
done

ENV="production" yarn lerna run build;
