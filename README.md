# Fairu
Fairu is an asynchronous utility library that provides fast and reliable file-system operations that can be daisy chained together and leverage glob patterns, and serialization to toml, json, and yaml.
This is a utility library for the AppKu ecosystem which provides file and directory read/write operations for regular, YAML, TOML, and env files.

# Usage
Fairu is designed to be usable through a series of chained methods. These methods define how Fairu will perform the final action, either discovery, reading, writing, appending, touching, or unlinking. 

Your Fairu usage should almost always begin with a `.with` call to specify the paths (which may be [glob](https://github.com/isaacs/node-glob) patterns). You then can follow up with methods to define how Fairu will behave, such as specifying `.throw(false)` to have Fairu avoid throwing errors and instead continue processing.

### Example Discovering Files
```js
let found = await Fairu
    .with('./**/*')
    .discover();
```

### Example Reading Files
```js
let readFiles = await Fairu
    .with('./path/to/files.*')
    .throw(false)
    .read();
```

### Example Writing Files
```js
let writeResults = await Fairu
    .with('./hello.txt')
    .write('hello world!');
```

### Example Appending Files
```js
let appendResults = await Fairu
    .with('./hello.txt', 'only-mars.txt')
    .append('\nalso, hello Mars!');
```

### Example Touching Files
```js
let writeResults = await Fairu
    .with('./hello.txt')
    .touch();
```

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