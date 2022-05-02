import fs from 'fs/promises';
import {Stats} from 'fs';

/**
 * This class stores flags about the state of a path (file or directory or other...) when being evaluated by Fairu.
 */
class PathState {
    /**
     * Creates a new `PathState` instance.
     * @param {String} targetPath - The file-system path being represented.
     */
    constructor(targetPath) {

        /**
         * @type {String}
         */
        this.path = targetPath;

        /**
         * Indicates the file or directory appears to exist.
         * @type {Boolean}
         */
        this.exists = false;

        /**
         * Indicates the file or directory appears to be readable.
         * @type {Boolean}
         */
        this.readable = false;

        /**
         * Indicates the file or directory appears to be writable.
         * @type {Boolean}
         */
        this.writable = false;

        /**
         * The Fairu operation in action, can be: "read", "write", "append", "touch", or "unlink".
         * @type {String}
         */
        this.operation = null;

        /**
         * Indicates the operation was successful.
         * @type {Boolean}
         */
        this.success = false;

        /**
         * @type {Stats}
         */
        this.stats = null;
        
    }
}

export default PathState;