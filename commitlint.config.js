module.exports = {
    extends: [
        '@commitlint/config-conventional',
        '@commitlint/config-lerna-scopes',
    ],
    rules: {
        'body-max-line-length': [0, 'always', 99999],
    },
};
