NODE_BIN="../../node_modules/.bin"
if [ -z "$1" ];
then
    echo "\nPlease provide one of the following package names:";
    ls -1 packages/;
    echo "";
    exit 1;
fi

echo "Starting $PWD/packages/$1";
(
    cd packages/$1;
    $NODE_BIN/rimraf dist;
    $NODE_BIN/tsdx watch
);
