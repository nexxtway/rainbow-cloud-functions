// eslint-disable-next-line no-undef
module.exports = {
    roots: ['<rootDir>/packages'],
    testMatch: ['**/__test__/**/*.+(ts|ts|js)', '**/?(*.)+(spec|test).+(ts|ts|js)'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
};
