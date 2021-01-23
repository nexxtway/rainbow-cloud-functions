# Rainbow Cloud Functions

[![CircleCI](https://circleci.com/gh/nexxtway/rainbow-cloud-functions/tree/master.svg?style=svg&circle-token=c6bd9999468138a7e0c44b0c0da619f69aac99b7)](https://circleci.com/gh/nexxtway/rainbow-cloud-functions/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/nexxtway/rainbow-cloud-functions/badge.svg?branch=master)](https://coveralls.io/github/nexxtway/rainbow-cloud-functions?branch=master)

## Development

1. `yarn bootstrap`
    1. Since we are using yarn workspaces this command will install the dependencies of the root folder and go into all package’s root folders and execute yarn install. It doesn’t make much sense to invoke lerna bootstrap since it just calls yarn install itself.

_If you want to run command in a specific package:_

```sh
yarn workspace <package-name> <command>
```

_If you want to add a common dependency to all packages:_

```sh
yarn add some-package -W
```

_If you want to add a dependency to specific package:_

```sh
npx lerna add some-package --scope=module1
```
