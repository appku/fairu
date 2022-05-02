import Fairu from './fairu.js';
import path from 'path';

describe('#constructor', () => {
    it('constructs with metadata object defaults.', () => {
        expect(new Fairu().metadata).toMatchObject({
            with: [],
            without: [],
            when: null,
            throw: true,
            format: null,
            ensure: false,
            encoding: null
        });
    });
});

describe('.with', () => {
    it('returns a Fairu instance.', () => expect(Fairu.with('abc')).toBeInstanceOf(Fairu));
    it('sets the metadata "with" value with given paths.', () => {
        expect(Fairu.with('abc', '123').metadata.with).toEqual(['abc', '123']);
    });
});

describe('#with', () => {
    it('returns a Fairu instance.', () => expect(new Fairu().with('abc')).toBeInstanceOf(Fairu));
    it('sets the metadata "with" value with given paths.', () => {
        expect(new Fairu().with('abc', '123').metadata.with).toEqual(['abc', '123']);
    });
    it('calls multiple times overwrite previous.', () => {
        expect(new Fairu()
            .with('abc', '123')
            .with('hello').metadata.with).toEqual(['hello']);
    });
    it('allows use of callback function and stores the result in metadata', () => {
        let f = new Fairu().with('abc', p => p.join('test/', 'file.txt'));
        expect(f.metadata.with).toEqual(['abc', 'test/file.txt']);
    });
    it('ignores null and undefined paths.', () => {
        expect(() => new Fairu().with('abc', null, undefined, '123')).not.toThrow();
        expect(new Fairu().with('abc', null, undefined, '123').metadata.with).toEqual(['abc', '123']);
    });
    it('throws error on specified invalid argument value type.', () => {
        expect(() => new Fairu().with(true)).toThrow(/paths/);
        expect(() => new Fairu().with(1234)).toThrow(/paths/);
        expect(() => new Fairu().with(new Date())).toThrow(/paths/);
        expect(() => new Fairu().with(Infinity)).toThrow(/paths/);
        expect(() => new Fairu().with(NaN)).toThrow(/paths/);
    });
});

describe('#without', () => {
    it('returns a Fairu instance.', () => expect(new Fairu().without('abc')).toBeInstanceOf(Fairu));
    it('sets the metadata "without" value with given paths.', () => {
        expect(new Fairu().without('abc', '123').metadata.without).toEqual(['abc', '123']);
    });
    it('calls multiple times overwrite previous.', () => {
        expect(new Fairu()
            .without('abc', '123')
            .without('hello').metadata.without).toEqual(['hello']);
    });
    it('allows use of callback function and stores the result in metadata', () => {
        let f = new Fairu().without('abc', p => p.join('test/', 'file.txt'));
        expect(f.metadata.without).toEqual(['abc', 'test/file.txt']);
    });
    it('ignores null and undefined paths.', () => {
        expect(() => new Fairu().without('abc', null, undefined, '123')).not.toThrow();
        expect(new Fairu().without('abc', null, undefined, '123').metadata.without).toEqual(['abc', '123']);
    });
    it('throws error on specified invalid argument value type.', () => {
        expect(() => new Fairu().without(true)).toThrow(/paths/);
        expect(() => new Fairu().without(1234)).toThrow(/paths/);
        expect(() => new Fairu().without(new Date())).toThrow(/paths/);
        expect(() => new Fairu().without(Infinity)).toThrow(/paths/);
        expect(() => new Fairu().without(NaN)).toThrow(/paths/);
    });
});

describe('#encoding', () => {
    it('returns a Fairu instance.', () => expect(new Fairu().encoding('utf8')).toBeInstanceOf(Fairu));
    it('sets the metadata "encoding" value.', () => {
        expect(new Fairu().encoding('utf8').metadata.encoding).toEqual('utf8');
    });
    it('sets the metadata "encoding" value to null when null or undefined.', () => {
        expect(new Fairu().encoding('utf8').encoding().metadata.encoding).toBeNull();
        expect(new Fairu().encoding('utf8').encoding(null).metadata.encoding).toBeNull();
    });
    it('calls multiple times overwrite previous.', () => {
        expect(new Fairu()
            .encoding('utf8')
            .encoding('hex').metadata.encoding).toEqual('hex');
    });
    it('throws error on specified invalid argument value type.', () => {
        expect(() => new Fairu().encoding(true)).toThrow(/encoding/);
        expect(() => new Fairu().encoding(1234)).toThrow(/encoding/);
        expect(() => new Fairu().encoding(new Date())).toThrow(/encoding/);
        expect(() => new Fairu().encoding(Infinity)).toThrow(/encoding/);
        expect(() => new Fairu().encoding(NaN)).toThrow(/encoding/);
    });
});

describe('#throw', () => {
    it('returns a Fairu instance.', () => expect(new Fairu().throw(true)).toBeInstanceOf(Fairu));
    it('sets the metadata "throw" value.', () => {
        expect(new Fairu().throw(false).metadata.throw).toEqual(false);
        expect(new Fairu().throw(true).metadata.throw).toEqual(true);
    });
    it('sets the metadata "throw" value to true when undefined.', () => {
        expect(new Fairu().throw(false).throw().metadata.throw).toBe(true);
    });
    it('calls multiple times overwrite previous.', () => {
        expect(new Fairu()
            .throw(false)
            .throw(true).metadata.throw).toEqual(true);
    });
    it('throws error on specified invalid argument value type.', () => {
        expect(() => new Fairu().throw(null)).toThrow(/throwErrors/);
        expect(() => new Fairu().throw('hello')).toThrow(/throwErrors/);
        expect(() => new Fairu().throw(1234)).toThrow(/throwErrors/);
        expect(() => new Fairu().throw(new Date())).toThrow(/throwErrors/);
        expect(() => new Fairu().throw(Infinity)).toThrow(/throwErrors/);
        expect(() => new Fairu().throw(NaN)).toThrow(/throwErrors/);
    });
});

describe('#ensure', () => {
    it('returns a Fairu instance.', () => expect(new Fairu().ensure(true)).toBeInstanceOf(Fairu));
    it('sets the metadata "ensure" value.', () => {
        expect(new Fairu().ensure(false).metadata.ensure).toEqual(false);
        expect(new Fairu().ensure(true).metadata.ensure).toEqual(true);
    });
    it('sets the metadata "ensure" value to true when undefined.', () => {
        expect(new Fairu().ensure(false).ensure().metadata.ensure).toBe(true);
    });
    it('calls multiple times overwrite previous.', () => {
        expect(new Fairu()
            .ensure(false)
            .ensure(true).metadata.ensure).toEqual(true);
    });
    it('throws error on specified invalid argument value type.', () => {
        expect(() => new Fairu().ensure(null)).toThrow(/ensure/);
        expect(() => new Fairu().ensure('hello')).toThrow(/ensure/);
        expect(() => new Fairu().ensure(1234)).toThrow(/ensure/);
        expect(() => new Fairu().ensure(new Date())).toThrow(/ensure/);
        expect(() => new Fairu().ensure(Infinity)).toThrow(/ensure/);
        expect(() => new Fairu().ensure(NaN)).toThrow(/ensure/);
    });
});

describe('#format', () => {
    it('returns a Fairu instance.', () => expect(new Fairu().format('json')).toBeInstanceOf(Fairu));
    it('sets the metadata "format" value.', () => {
        expect(new Fairu().format('json').metadata.format).toEqual('json');
    });
    it('sets the metadata "format" value to null when null or undefined.', () => {
        expect(new Fairu().format('json').format().metadata.format).toBeNull();
        expect(new Fairu().format('json').format(null).metadata.format).toBeNull();
    });
    it('calls multiple times overwrite previous.', () => {
        expect(new Fairu()
            .format('json')
            .format('toml').metadata.format).toEqual('toml');
    });
    it('throws error on unsupported format.', () => {
        expect(() => new Fairu().format('butter')).toThrow(/format/);
        expect(() => new Fairu().format('text')).toThrow(/format/);
    });
    it('throws error on specified invalid argument value type.', () => {
        expect(() => new Fairu().format(true)).toThrow(/format/);
        expect(() => new Fairu().format(1234)).toThrow(/format/);
        expect(() => new Fairu().format(new Date())).toThrow(/format/);
        expect(() => new Fairu().format(Infinity)).toThrow(/format/);
        expect(() => new Fairu().format(NaN)).toThrow(/format/);
    });
});

describe('#when', () => {
    it('returns a Fairu instance.', () => expect(new Fairu().when(() => true)).toBeInstanceOf(Fairu));
    it('sets the metadata "when" value.', () => {
        expect(typeof new Fairu().when(() => true).metadata.when).toBe('function');
    });
    it('sets the metadata "when" value to null when null or undefined.', () => {
        expect(new Fairu().when(() => true).when().metadata.when).toBeNull();
        expect(new Fairu().when(() => true).when(null).metadata.when).toBeNull();
    });
    it('calls multiple times overwrite previous.', () => {
        let func = () => false;
        expect(new Fairu()
            .when(() => true)
            .when(func).metadata.when).toEqual(func);
    });
    it('throws error on specified invalid argument value type.', () => {
        expect(() => new Fairu().when('hi')).toThrow(/conditions/);
        expect(() => new Fairu().when(true)).toThrow(/conditions/);
        expect(() => new Fairu().when(1234)).toThrow(/conditions/);
        expect(() => new Fairu().when(new Date())).toThrow(/conditions/);
        expect(() => new Fairu().when(Infinity)).toThrow(/conditions/);
        expect(() => new Fairu().when(NaN)).toThrow(/conditions/);
    });
});

describe('#_globFind', () => {
    it('discovers a file without a glob pattern.', async () => {
        let testPath = './test/read/sample-0.txt';
        let results = await new Fairu()._globFind(testPath);
        expect(results.length).toBe(1);
        expect(results[0]).toBe(path.resolve(testPath));
    });
    it('still returns a path that does not exist if it is not a glob and not ignored.', async () => {
        let testPath = './test/read/hello.world';
        let results = await new Fairu()._globFind(testPath);
        expect(results.length).toBe(1);
        expect(results[0]).toBe(path.resolve(testPath));
    });
    it('discovers a directory without a glob pattern.', async () => {
        let testPath = './test/read/';
        let results = await new Fairu()._globFind(testPath);
        expect(results.length).toBe(1);
        expect(results[0]).toBe(path.resolve(testPath));
    });
    it('ignores file(s) if it is excluded by ignore path/glob string(s).', async () => {
        let testPath = './test/read/sample-0.txt';
        let results = await new Fairu()._globFind(testPath, './test/**/*');
        expect(results.length).toBe(0);
        results = await new Fairu()._globFind(testPath, './test/read/sample-0.txt');
        expect(results.length).toBe(0);
        results = await new Fairu()._globFind(testPath, ['yoda', '**/*.txt']);
        expect(results.length).toBe(0);
        testPath = './test/read/sample-*.txt';
        results = await new Fairu()._globFind(testPath, ['**/*-[012].txt']);
        expect(results.length).toBe(1);
        expect(results[0]).toBe(path.resolve( './test/read/sample-3.txt'));
    });
    it('discovers files with a glob pattern.', async () => {
        let testPath = './test/read/sample-*.txt';
        let results = await new Fairu()._globFind(testPath);
        expect(results.length).toBe(4);
        for (let i = 0; i < 4; i++) {
            expect(results[i]).toBe(path.resolve(`./test/read/sample-${i}.txt`));
        }
    });
});

describe('#discover', () => {

});

describe('#read', () => {

});

describe('#write', () => {

});

describe('#append', () => {

});

describe('#touch', () => {

});

describe('#unlink', () => {

});