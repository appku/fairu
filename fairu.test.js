import Fairu, { FairuFormat } from './fairu.js';
import path from 'path';
import PathState from './path-state.js';
import ReadPathState from './read-path-state.js';

const testObject = {
    abc: 123,
    hello: 'world',
    truth: false,
    zed: { ok: 3.14159 }
};

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

describe('.stringify', () => {
    it('throws on unknown format.', () => {
        expect(() => Fairu.stringify('bob', testObject)).toThrow('format');
    });
    it('stringifies to JSON.', () => {
        expect(Fairu.stringify(FairuFormat.json, testObject)).toBe('{\n    "abc": 123,\n    "hello": "world",\n    "truth": false,\n    "zed": {\n        "ok": 3.14159\n    }\n}');
    });
    it('stringifies to JSON with different indent.', () => {
        expect(Fairu.stringify(FairuFormat.json, testObject, 1)).toBe('{\n "abc": 123,\n "hello": "world",\n "truth": false,\n "zed": {\n  "ok": 3.14159\n }\n}');
    });
    it('stringifies to TOML.', () => {
        expect(Fairu.stringify(FairuFormat.toml, testObject)).toBe('abc = 123\nhello = "world"\ntruth = false\n\n[zed]\nok = 3.14159\n');
    });
    it('stringifies to YAML.', () => {
        expect(Fairu.stringify(FairuFormat.yaml, testObject)).toBe('abc: 123\nhello: world\ntruth: false\nzed:\n    ok: 3.14159\n');
    });
    it('stringifies to YAML with different indent.', () => {
        expect(Fairu.stringify(FairuFormat.yaml, testObject, 1)).toBe('abc: 123\nhello: world\ntruth: false\nzed:\n ok: 3.14159\n');
    });
});

describe('.parse', () => {
    it('throws on unknown format.', () => {
        expect(() => Fairu.parse('bob', '')).toThrow('format');
    });
    it('throws on bad parse.', () => {
        expect(() => Fairu.parse(FairuFormat.json, '{][][[--++')).toThrow();
        expect(() => Fairu.parse(FairuFormat.toml, '{][][[--++')).toThrow();
        expect(() => Fairu.parse(FairuFormat.yaml, '{][][[--++')).toThrow();
    });
    it('parses JSON.', () => {
        expect(Fairu.parse(FairuFormat.json, '{\n    "abc": 123,\n    "hello": "world",\n    "truth": false,\n    "zed": {\n        "ok": 3.14159\n    }\n}')).toMatchObject(testObject);
    });
    it('parses TOML.', () => {
        expect(Fairu.parse(FairuFormat.toml, 'abc = 123\nhello = "world"\ntruth = false\n\n[zed]\nok = 3.14159\n')).toMatchObject(testObject);
    });
    it('parses YAML.', () => {
        expect(Fairu.parse(FairuFormat.yaml, 'abc: 123\nhello: world\ntruth: false\nzed:\n    ok: 3.14159\n')).toMatchObject(testObject);
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
        expect(results[0]).toBe(path.resolve('./test/read/sample-3.txt'));
    });
    it('discovers files with a glob pattern.', async () => {
        let testPath = './test/read/sample-*.txt';
        let results = await new Fairu()._globFind(testPath);
        expect(results.length).toBe(4);
        for (let i = 0; i < results.length; i++) {
            expect(results[i]).toBe(path.resolve(`./test/read/sample-${i}.txt`));
        }
    });
});

describe('#discover', () => {
    it('returns path states for every path specified, including invalid ones.', async () => {
        let results = await Fairu
            .with('./test/read/**/*.txt', './test/doesntexist')
            .throw(false)
            .discover();
        expect(results.length).toBe(7);
        for (let i = 0; i < 6; i++) {
            expect(results[i].path).toMatch(/sample-[0-9].txt$/);
            expect(results[i].exists).toBe(true);
            expect(results[i].readable).toBe(true);
            expect(results[i].writable).toBe(true);
            expect(results[i].operation).toBe('discover');
            expect(results[i].error).toBeNull();
            expect(results[i].stats).toBeTruthy();
        }
        expect(results[6].path).toMatch(/doesntexist$/);
        expect(results[6].exists).toBe(false);
        expect(results[6].readable).toBe(false);
        expect(results[6].writable).toBe(false);
        expect(results[6].operation).toBe('discover');
        expect(results[6].error).not.toBeNull();
        expect(results[6].stats).toBeNull();
    });
    it('applies "when" conditions to limit results.', async () => {
        let results = await Fairu
            .with('./test/read/**/*.txt', './test/nothing')
            .when(s => s.exists && s.stats.size < 150)
            .throw(false)
            .discover();
        expect(results.length).toBe(2);
        for (let i = 0; i < results.length; i++) {
            expect(results[i].exists).toBe(true);
            expect(results[i].stats.size).toBeLessThan(150);
        }
    });
    it('allows a caller to create a path state by providing a callback.', async () => {
        let results = await Fairu
            .with('./test/read/sample-0.txt')
            .discover(tp => {
                let ps = new PathState(tp);
                ps.operation = 'monkeys';
                return ps;
            });
        expect(results.length).toBe(1);
        expect(results[0].operation).toBe('monkeys');
    });
    it('throws an error if the flag to throw is set (default).', () => {
        expect(Fairu
            .with('./test/read/**/*.txt', './test/doesntexist')
            .discover()).rejects.toThrow(/ENOENT/);
        expect(Fairu
            .with('./test/read/**/*.txt', './test/doesntexist')
            .throw(true)
            .discover()).rejects.toThrow(/ENOENT/);
    });
    it('throws an error if the when condition fails to return a boolean.', () => {
        expect(Fairu
            .with('./test/read/sample*.txt')
            .when(c => 'hello world')
            .discover()).rejects.toThrow(/boolean/);
    });
});

describe('#read', () => {
    it('reads file contents to a buffer.', async () => {
        let results = await Fairu.with('./test/read/sample-0.txt').read();
        expect(results.length).toBe(1);
        expect(results[0]).toBeInstanceOf(ReadPathState);
        expect(Buffer.isBuffer(results[0].data)).toBe(true);
        expect(results[0].data.length).toBe(116);
        expect(results[0].data.toString()).toMatch(/lorem ipsum/i);
    });
    it('reads a directory listing.', async () => {
        let results = await Fairu.with('./test/read/').read();
        expect(results.length).toBe(1);
        expect(results[0]).toBeInstanceOf(ReadPathState);
        expect(results[0].data.length).toBe(6);
        for (let i = 0; i < results[0].data.length; i++) {
            expect(results[0].data[i]).toMatch(/(sample|format|subdir)/);
        }
    });
    it('reads a json, yaml, and toml formatted file to an object.', async () => {
        let formats = Object.keys(FairuFormat);
        for (let f of formats) {
            let results = await Fairu
                .with(`./test/read/format/valid.${f}`)
                .format(f)
                .read();
            expect(results.length).toBe(1);
            expect(results[0]).toBeInstanceOf(ReadPathState);
            expect(results[0].data).toMatchObject(testObject);
        }
    });
    it('throws an error when trying to read and parse an invalid json, yaml, and toml formatted file to an object.', () => {
        let formats = Object.keys(FairuFormat);
        for (let f of formats) {
            expect(Fairu
                .with(`./test/read/format/invalid.${f}`)
                .format(f)
                .read()).rejects.toThrow();
        }
    });
    it('does not throw an error if the "throw" flag is disabled.', async () => {
        let formats = Object.keys(FairuFormat);
        for (let f of formats) {
            let results = await Fairu
                .with(`./test/read/format/invalid.${f}`)
                .format(f)
                .throw(false)
                .read();
            expect(results.length).toBe(1);
            expect(results[0].error).toBeTruthy();
        }
    });
});

describe('#write', () => {

});

describe('#append', () => {

});

describe('#touch', () => {

});

describe('#unlink', () => {

});