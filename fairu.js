import path from 'path';
import fs from 'fs/promises';
import { constants } from 'fs';
import glob from 'glob';
import toml from '@iarna/toml';
import yaml from 'js-yaml';
import PathState from './path-state.js';
import ReadPathState from './read-path-state.js';

/**
 * @callback FairuPathCallback
 * @param {path} p - The path utility for constructing file-system paths.
 * @returns {String}
 */

/**
 * @callback FairuConditionCallback
 * @param {PathState} state - The state of the path as discovered by Fairu.
 * @returns {Boolean}
 */

/**
 * @callback FairuPathStateCreateCallback
 * @param {String} targetPath - The path utility for constructing file-system paths.
 * @returns {PathState}
 */

/**
 * @enum {String}
 */
const FairuFormat = {
    yaml: 'yaml',
    toml: 'toml',
    json: 'json'
};

/**
 * Fairu is a file-system reading & writing helper designed to simplify operations. It provides an asynchronous and
 * chained method interface to working with files that helps you focus less on file system operations, and more on
 * just getting things written and read reliably.
 */
class Fairu {
    constructor() {

        /**
         * The globbing options to apply to path discovery.
         * @see https://www.npmjs.com/package/glob
         * @type {glob.IOptions}
         */
        this.options = {
            absolute: true
        };

        /**
         * The metadata for the constructed Fairu operation.
         * @private
         */
        this.metadata = {
            /**
             * @type {Array.<String>}
             */
            with: [],
            /**
             * @type {Array.<String>}
             */
            without: [],
            /**
             * @type {FairuConditionCallback}
             */
            when: null,
            /**
             * @type {Boolean}
             */
            throw: true,
            /**
             * @type {String}
             */
            format: null,
            /**
             * @type {Boolean}
             */
            ensure: false,
            /**
             * @type {String}
             */
            encoding: null
        };
    }

    /**
     * Stringifies an object into the specified format (yaml, toml, or json).
     * @throws Error when the format is unknown.
     * @throws Error when stringification fails.
     * @param {Util.format} format - Can be either 'json', 'yaml', or 'json'.
     * @param {*} object - The object to stringify.
     * @param {Number} [space=4] - The number of spaces to use for indentations.
     * @returns {String}
     */
    static stringify(format, object, space = 4) {
        if (format) {
            if (/json/i.test(format)) {
                return JSON.stringify(object, null, space);
            } else if (/yaml/i.test(format)) {
                return yaml.dump(object, {
                    indent: space,
                    lineWidth: 120
                });
            } else if (/toml/i.test(format)) {
                return toml.stringify(object);
            }
        }
        throw new Error(`Unknown format "${format}".`);
    }

    /**
     * Attempts to parse the given input string using the specified format parser into an object.
     * @throws Error when the format is unknown.
     * @throws Error when parsing fails.
     * @param {Util.format} format - Can be either 'json', 'yaml', or 'json'.
     * @param {*} inputString - The string to be parsed.
     * @param {String} [filePath] - The file path used in error/warning messages.
     * @returns {*}
     */
    static parse(format, inputString, filePath) {
        if (format) {
            if (/json/i.test(format)) {
                return JSON.parse(inputString);
            } else if (/yaml/i.test(format)) {
                return yaml.load(inputString, {
                    filename: filePath
                });
            } else if (/toml/i.test(format)) {
                return toml.parse(inputString);
            }
        }
        throw new Error(`Unknown format "${format}".`);
    }

    /**
     * Specify the file-system paths (including glob patterns) you will be performing an operation on. You may
     * optionally provide a callback that returns a path to use- the callback will be passed the `path` module as an
     * argument.
     * 
     * Calling this resets the paths used in this Fairu operation, letting you daisy-chain multiple operations
     * together, each starting with the `with` specification.
     * 
     * This function is not cummulative, specified paths will overwrite those set by a previous call.
     * @throws Error when a specified path is not a string or callback function.
     * @param  {...String | FairuPathCallback} paths - The series of file-system paths or callback functions. 
     * @returns {Fairu}
     * @example
     * Daisy chaining multiple operations:
     * ```js
     * await Fairu
     *   .with('./file1.txt', p => p.join('/home/', 'file2.txt'))
     *   .write(content)
     *   .with('./file3.txt')
     *   .write(otherContent);
     * ```
     * 
     * @example
     * Using glob paths:
     * ```js
     * await Fairu
     *   .with('./**', './+(hello|greetings)?(world|mars|venus).txt')
     *   .read();
     * ```
     */
    static with(...paths) {
        return new Fairu().with(...paths);
    }

    /**
     * Specify the file-system paths (including glob patterns) you will be performing an operation on. You may
     * optionally provide a callback that returns a path to use- the callback will be passed the `path` module as an
     * argument.
     * 
     * Calling this resets the paths used in this Fairu operation, letting you daisy-chain multiple operations
     * together, each starting with the `with` specification.
     * 
     * This function is not cummulative, specified paths will overwrite those set by a previous call.
     * @throws Error when a specified path is not a string or callback function.
     * @param  {...String | FairuPathCallback} paths - The series of file-system paths or callback functions. 
     * @returns {Fairu}
     * @example
     * Daisy chaining multiple operations:
     * ```js
     * await Fairu
     *   .with('./file1.txt', p => p.join('/home/', 'file2.txt'))
     *   .write(content)
     *   .with('./file3.txt')
     *   .write(otherContent);
     * ```
     * 
     * @example
     * Using glob paths:
     * ```js
     * await Fairu
     *   .with('./**', './+(hello|greetings)?(world|mars|venus).txt')
     *   .read();
     * ```
     */
    with(...paths) {
        this.metadata.with = [];
        for (let p of paths) {
            let pathType = typeof p;
            if (pathType === 'function') {
                this.metadata.with.push(p(path));
            } else if (pathType === 'string') {
                this.metadata.with.push(p);
            } else if (pathType === 'undefined' || p === null) {
                continue;
            } else {
                throw new Error('The "paths" argument encountered a specified non-string/non-function path. Only callbacks and strings are allowed paths. If a null or undefined value is found it is skipped.');
            }
        }
        return this;
    }

    /**
     * Specify the file-system paths (including glob patterns) you *do not* want to perform an operation on. You may
     * optionally provide a callback that returns a path to use- the callback will be passed the `path` module as an
     * argument.
     * 
     * This function is not cummulative, specified paths will overwrite those set by a previous call.
     * @throws Error when a specified path is not a string or callback function.
     * @param  {...String | FairuPathCallback} paths - The series of file-system paths or callback functions. 
     * @returns {Fairu}
     * @example
     * Skipping over certain files, in this case finding all `.js` files without `.test.` in the file name:
     * ```js
     * Fairu.
     *   .with('./*.js')
     *   .without('./*.test.*')
     *   .discover();
     * ```
     */
    without(...paths) {
        this.metadata.without = [];
        for (let p of paths) {
            let pathType = typeof p;
            if (pathType === 'function') {
                this.metadata.without.push(p(path));
            } else if (pathType === 'string') {
                this.metadata.without.push(p);
            } else if (pathType === 'undefined' || p === null) {
                continue;
            } else {
                throw new Error('The "paths" argument encountered a specified non-string/non-function path. Only callbacks and strings are allowed paths. If a null or undefined value is found it is skipped.');
            }
        }
        return this;
    }

    /**
     * Sets the text file encoding to the specified value.
     * By default the encoding is not set.
     * 
     * Calling this function without an argument or `null` will reset it to it's default (not set).
     * @throws Error when the encoding value is specified and not a string.
     * @param {String} encoding - The file text encoding to use when reading and writing files.
     * @returns {Fairu}
     */
    encoding(encoding) {
        let encodingType = typeof encoding;
        if (encodingType !== 'undefined' && encoding !== null && encodingType !== 'string') {
            throw new Error('The "encoding" argument, when specified, must be a string.');
        }
        this.metadata.encoding = encoding || null;
        return this;
    }

    /**
     * Sets the flag to have Fairu throw an error if one is encountered (`true`), or simply halt the operation for 
     * that path (`false`). By default Fairu will throw an error (`true`).
     * When the flag is `false` and an error occurs:
     * - `read()` will return `null` value for the `data` property in the result.
     * - `write()` may or may not occur or may only partially write.
     * - `touch()` may or may not occur.
     * 
     * Calling this function without an argument will reset it to it's default (`true`).
     * @throws Error when the `throwErrors` argument is not a boolean value.
     * @param {Boolean} [throwErrors=true] - If `true` an error is thrown as soon as it is encountered, when `false`
     * no errors are thrown and the next path operation is attempted. 
     * @returns {Fairu}
     */
    throw(throwErrors) {
        if (typeof throwErrors === 'undefined') {
            throwErrors = true;
        } else if (typeof throwErrors !== 'boolean') {
            throw new Error('The "throwErrors" argument, when specified, must be a boolean.');
        }
        this.metadata.throw = !!throwErrors;
        return this;
    }

    /**
     * Sets the flag to create any directories not found in a Fairu operation's path(s). If this flag is not 
     * enabled (`false`) and the directory path does not exist, then the file operation will error.
     * 
     * Calling this function without a `ensure` parameter argument will set the flag to `true`.
     * 
     * This only has an effect on `write`, `append`, and `touch` operations.
     * The `discover` and `read` operations *will not* attempt to ensure the path.
     * @throws Error when the `ensure` argument is not a boolean value.
     * @param {Boolean} [ensure=false] - If true, the directory path will be created if missing.
     * @returns {Fairu}
     */
    ensure(ensure) {
        if (typeof ensure === 'undefined') {
            ensure = true;
        } else if (typeof ensure !== 'boolean') {
            throw new Error('The "ensure" argument must be a boolean.');
        }
        this.metadata.ensure = ensure || false;
        return this;
    }

    /**
     * Enables formatting of written or read objects or data to the specified format, either: "json", "toml", or
     * "yaml". You may also ensure raw bufferred reads or writes by passing a `null` argument to clear the setting.
     * By default the format is not set.
     * 
     * Calling this function without an argument or `null` will reset it to it's default (not set).
     * @throws Error when the specified `format` argument is not "json", "yaml", "toml".
     * @param {FairuFormat} format - The format (or `null`) to use for reading & writing. Can be: "json", "toml", or
     *   "yaml".
     * @returns {Fairu}
     */
    format(format) {
        let formatType = typeof format;
        if (formatType !== 'undefined' && format !== null && formatType !== 'string') {
            throw new Error('The "format" argument, when specified, must be a string.');
        } else if (
            formatType !== 'undefined'
            && format !== null
            && format !== FairuFormat.json
            && format !== FairuFormat.toml
            && format !== FairuFormat.yaml) {
            throw new Error(`The "format" argument, when specified, must be either "json", "toml", or "yaml. Instead "${format}" was specified.`);
        }
        this.metadata.format = format || null;
        return this;
    }

    /**
     * Sets the conditional callback that determines, per discovered path, that the file-system operation being
     * performed can continue and be processed. 
     * 
     * Calling this function without an argument or `null` will reset it to it's default (no conditional callback).
     * @throws Error when the specified conditions are not a callback function.
     * @param {FairuConditionCallback} conditions - Conditional flags indicating what states of the path must appear
     *  to be true before proceeding with the operation for a path.
     * @returns {Fairu}
     * @example
     * Discovering only paths that are writable with a minimum size of 1024 bytes.
     * ```js
     * let states = await Fairu
     *   .with('./*.js')
     *   .when(s => s.stats && s.stats.size > 1024 && s.writable)
     *   .discover();
     * console.log(states);
     * ```
     */
    when(conditions) {
        let conditionsType = typeof conditions;
        if (conditionsType !== 'undefined' && conditions !== null) {
            if (conditionsType === 'function') {
                this.metadata.when = conditions;
            } else {
                throw new Error('The "conditions" argument must be a callback.');
            }
        } else {
            this.metadata.when = null;
        }
        return this;
    }

    /**
     * Asynchronously resolves a glob pattern.
     * @param {String} pattern - The glob pattern to resolve.
     * @param {String | Array.<String>} [ignore] - An ignore pattern to exclude results from the matching file paths.
     * @returns {Promise.<Array.<String>>}
     * @private
     */
    async _globFind(pattern, ignore) {
        return await new Promise((resolve, reject) => {
            glob(pattern, Object.assign({}, this.options, {
                ignore: ignore
            }), (err, matches) => {
                if (err) reject(err);
                if (matches.length === 0 && glob.hasMagic(pattern, this.options) === false && (!ignore || Array.isArray(ignore) && ignore.length === 0)) {
                    matches.push(path.resolve(pattern));
                }
                return resolve(matches);
            });
        });
    }

    /**
     * Expands globbed paths and discovers information about them, returning a record for each path (including invalid)
     * ones.
     * @throws Error when the `throw` flag is true and an error discovering paths is encountered.
     * @throws Error when the "when" condition for the Fairu operation fails to return a boolean result.
     * @param {FairuPathStateCreateCallback} [create] - Optional callback that returns an initialized `PathState`.
     * @returns {Promise.<Array.<PathState>>}
     */
    async discover(create) {
        //de-glob
        let paths = [];
        for (let globPath of this.metadata.with) {
            let foundPaths = await this._globFind(globPath, this.metadata.without);
            //ensure the path only shows up once in the results.
            for (let fp of foundPaths) {
                if (paths.indexOf(fp) <= -1) {
                    paths.push(fp);
                }
            }
        }
        //iterate & discover.
        let results = [];
        for (let p of paths) {
            //build default state
            let state = null;
            if (typeof create === 'function') {
                state = create(p); //allow other Fairu operations to hijack discover for their usage.
            } else {
                state = new PathState(p);
                state.operation = 'discover';
            }
            state.exists = true;
            try {
                //gather dicey details
                state.stats = await fs.stat(p); //allowed to fail
                try {
                    await fs.access(p, constants.R_OK);
                    state.readable = true;
                } catch (readErr) { } // eslint-disable-line no-empty
                try {
                    await fs.access(p, constants.W_OK);
                    state.writable = true;
                } catch (writeErr) { } // eslint-disable-line no-empty
            } catch (err) {
                state.error = err;
                if (err.code === 'ENOENT') {
                    state.exists = false;
                }
                if (this.metadata.throw) {
                    throw err;
                }
            }
            if (this.metadata.when) {
                let whenResult = this.metadata.when(state);
                if (whenResult === true) {
                    results.push(state);
                } else if (whenResult !== false) {
                    throw new Error(`The "when" condition for the Fairu operation "${state.operation}" failed to return a boolean result.`);
                }
            } else {
                results.push(state);
            }
        }
        return results;
    }

    /**
     * Reads from all file-system paths specified in the Fairu operation.
     * Directories will return data that is the top-level list of files and directories they contain. 
     * Files and other types will return the data read in the form of a `Buffer` unless a `format` was specified.
     * 
     * If a format was specified, the read data will be (attempted) to parse from that format into an in-memory object.
     * 
     * If the file is in an errored state prior to the read, it will not be read and data will be `null`.
     * @returns {Promise.<Array.<ReadPathState>>}
     */
    async read() {
        let states = await this.discover(tp => new ReadPathState(tp));
        for (let state of states) {
            if (!state.error) { //skip paths in an errored state
                try {
                    if (state.stats.isDirectory()) {
                        //path points to a directory, read the file list instead.
                        state.data = await fs.readdir(state.path);
                    } else {
                        state.data = await fs.readFile(state.path, {
                            encoding: this.metadata.encoding
                        });
                        if (this.metadata.format) {
                            state.data = Fairu.parse(
                                this.metadata.format,
                                state.data.toString(this.metadata.encoding || undefined),
                                state.path
                            );
                        }
                    }
                } catch (err) {
                    state.error = err;
                    if (this.metadata.throw) {
                        throw err;
                    }
                }
            }
        }
        return states;
    }

    async write(content) {
        return this;
    }

    async append(content) {

    }

    async touch() {
        return this;
    }

    async unlink() {
        return this;
    }

}

export { Fairu as default, FairuFormat };