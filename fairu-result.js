import PathState from './path-state.js';

/**
 * The results of the Fairu operation on a single path.
 */
class FairuResult extends PathState{
    constructor(targetPath) {
        super(targetPath);

        /**
         * The data read from the file.
         * @type {*}
         */
        this.data = null;
        
    }
}

export default FairuResult;