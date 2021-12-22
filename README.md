# Fairu
This is a utility library for the AppKu ecosystem which provides file and directory read/write operations for regular, YAML, TOML, and env files.

# Configuration
This library does not have any configuration options.

# Code Documentation
You can generate a static JSDoc site under the `docs/` path using the command `npm run docs`.

# Installing
```sh
npm i @appku/fairu
```

# Testing
This project uses `jest` to perform unit tests.

## Running Tests
Run `npm test` to run jest unit tests.

Run `npm run lint` to run ESLint, optionally install the Visual Studio Code ESLint extension to have linting issues show in your "Problems" tab and be highlighted.

If you are writing unit tests, you may need to `npm install @types/jest` to get intellisense in Visual Studio Code if for some reason it did not get installed.

# Publishing
Only maintainers with proper access can publish this package to npm. To do so as maintainers, you can publish by running the following command:

```sh
npm publish --registry=https://registry.npmjs.org --access=public
```