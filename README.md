
[![NPM](https://img.shields.io/npm/v/@appku/fairu)](https://npmjs.org/package/@appku/fairu)
[![License](https://img.shields.io/npm/l/@appku/fairu)](https://npmjs.org/package/@appku/fairu)
[![Downloads](https://img.shields.io/npm/dt/@appku/fairu)](https://npmjs.org/package/@appku/fairu)

# Fairu
Fairu is an asynchronous utility library that provides fast and reliable file-system operations that can be daisy chained together and leverage glob patterns, and serialization to toml, json, and yaml.
This is a library built within the [AppKu](https://github.com/appku) ecosystem of tools and utilities to help build apps. Specifically Fairu provides file and directory read/write operations for regular, YAML, TOML, and env files.

You can find formal [documentation here](https://appku.github.io/fairu/).

# Usage
Fairu is designed to be usable through a series of chained methods. These methods define how Fairu will perform the final action, either discovery, reading, writing, appending, touching, or unlinking. 

Your Fairu usage should almost always begin with a `.with` call to specify the paths (which may be [glob](https://github.com/isaacs/node-glob) patterns). You then can follow up with methods to define how Fairu will behave, such as specifying `.throw(false)` to have Fairu avoid throwing errors and instead continue processing.

### Returned Value
In Fairu operations (`discover`, `touch`, `read`, `write`, `delete`) the returned value will be a promise of an `Array` of `PathState` objects. 

### Example Discovering Files
```js
let found = await Fairu
    .with('./**/*')
    .discover();
//found = [...PathState]
```

### Example Reading Files
```js
let readFiles = await Fairu
    .with('./path/to/files.*')
    .throw(false)
    .read();
//found = [...ReadPathState]
```

### Example Writing Files
```js
let writeResults = await Fairu
    .with('./hello.txt')
    .write('hello world!');
//found = [...PathState]
```

### Example Appending Files
```js
let appendResults = await Fairu
    .with('./hello.txt', 'only-mars.txt')
    .append('\nalso, hello Mars!');
//found = [...PathState]
```

### Example Touching Files
```js
let writeResults = await Fairu
    .with('./hello.txt')
    .touch();
//found = [...PathState]
```

## Other Utilities
Fairu also provides a number of static utility functions to make your life easier:

- `mv`: Move a file or directory (recursively) to another.
- `cp`: Copy a file or directory (recursively) to another.
- `stringify`: Stringify a JavaScript object into a `json`, `toml`, or `yaml` string.
- `parse`: Parse `json`, `toml`, or `yaml` string content into a JavaScript object.
- `packageJSON`: Read a `package.json` file synchronously from a specific directory.

# Configuration
By default, Fairu works out of the box without needing any adjustment. You can tweak the behavior of path discovery though by setting the `options` property on the Fairu instance you create. This affects the path matching and discovery prior to taking action on defined paths.

### Example
```js
let f = new Fairu();
f.options = {
    absolute: true,
    debug: true
};
//f.with(...paths) etc.
```

You can find the full documentation on these options on the `glob` package's [README](https://github.com/isaacs/node-glob#options).

# Documentation
You can find examples and the fully published documentation at [appku.github.io/fairu](https://appku.github.io/fairu/).

If you'd like to generate the documentation locally, you can do so by running `npm run docs` and the site will be statically generated under the `docs/` path.

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