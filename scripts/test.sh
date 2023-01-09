export TS_NODE_COMPILER_OPTIONS="{\"module\": \"commonjs\"}"
yarn mocha -r ts-node/register "./tests/**/*.ts" --sort