import PathState from './path-state.js';

describe('#constructor', () => {
    it('constructs with property defaults.', () => {
        expect(new PathState('./test/')).toMatchObject({
            path: './test/',
            exists: false,
            readable: false,
            writable: false,
            operation: null,
            error: null,
            stats: null
        });
    });
});