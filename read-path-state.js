import PathState from './path-state.js';

/**
 * The read results of the Fairu operation on a single path.
 */
class ReadPathState extends PathState {
    constructor(targetPath) {
        super(targetPath);
        this.operation = 'read';

        /**
         * The data read from the file.
         * @type {*}
         */
        this.data = null;

    }
}

export default ReadPathState;