import toml from '@iarna/toml';
import yaml from 'js-yaml';

class Util {

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

}

/**
 * @enum {String}
 * @readonly
 */
Util.format = {
    JSON: 'json',
    TOML: 'toml',
    YAML: 'yaml'
};

export default Util;