import ReadPathState from './read-path-state.js';

describe('#constructor', () => {
    it('constructs with property defaults.', () => {
        expect(new ReadPathState('./test/')).toMatchObject({
            path: './test/',
            exists: false,
            readable: false,
            writable: false,
            operation: 'read',
            error: null,
            stats: null
        });
    });
});