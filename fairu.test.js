import Fairu from './fairu.js';
import path from 'path';
import fs from 'fs/promises';
import PathState from './path-state.js';
import ReadPathState from './read-path-state.js';
import { constants } from 'fs';

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
            throw: false,
            format: null,
            encoding: null
        });
    });
});

describe('.stringify', () => {
    it('throws on unknown format', () => {
        expect(() => Fairu.stringify('bob', testObject)).toThrow('format');
    });
    it('stringifies to JSON.', () => {
        expect(Fairu.stringify(Fairu.Format.json, testObject)).toBe('{\n    "abc": 123,\n    "hello": "world",\n    "truth": false,\n    "zed": {\n        "ok": 3.14159\n    }\n}');
    });
    it('stringifies to JSON with different indent.', () => {
        expect(Fairu.stringify(Fairu.Format.json, testObject, 1)).toBe('{\n "abc": 123,\n "hello": "world",\n "truth": false,\n "zed": {\n  "ok": 3.14159\n }\n}');
    });
    it('stringifies to TOML.', () => {
        expect(Fairu.stringify(Fairu.Format.toml, testObject)).toBe('abc = 123\nhello = "world"\ntruth = false\n\n[zed]\nok = 3.14159\n');
    });
    it('stringifies to YAML.', () => {
        expect(Fairu.stringify(Fairu.Format.yaml, testObject)).toBe('abc: 123\nhello: world\ntruth: false\nzed:\n    ok: 3.14159\n');
    });
    it('stringifies to YAML with different indent.', () => {
        expect(Fairu.stringify(Fairu.Format.yaml, testObject, 1)).toBe('abc: 123\nhello: world\ntruth: false\nzed:\n ok: 3.14159\n');
    });
});

describe('.parse', () => {
    it('throws on unknown format.', () => {
        expect(() => Fairu.parse('bob', '')).toThrow('format');
    });
    it('throws on bad parse.', () => {
        expect(() => Fairu.parse(Fairu.Format.json, '{][][[--++')).toThrow();
        expect(() => Fairu.parse(Fairu.Format.toml, '{][][[--++')).toThrow();
        expect(() => Fairu.parse(Fairu.Format.yaml, '{][][[--++')).toThrow();
    });
    it('parses JSON.', () => {
        expect(Fairu.parse(Fairu.Format.json, '{\n    "abc": 123,\n    "hello": "world",\n    "truth": false,\n    "zed": {\n        "ok": 3.14159\n    }\n}')).toMatchObject(testObject);
    });
    it('parses TOML.', () => {
        expect(Fairu.parse(Fairu.Format.toml, 'abc = 123\nhello = "world"\ntruth = false\n\n[zed]\nok = 3.14159\n')).toMatchObject(testObject);
    });
    it('parses YAML.', () => {
        expect(Fairu.parse(Fairu.Format.yaml, 'abc: 123\nhello: world\ntruth: false\nzed:\n    ok: 3.14159\n')).toMatchObject(testObject);
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
    it('throws error on unsupported Fairu.Format.', () => {
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
    it('discovers a directory without a glob pattern and keeps the trailing slash.', async () => {
        let testPath = './test/read/';
        let results = await new Fairu()._globFind(testPath);
        expect(results.length).toBe(1);
        expect(results[0]).toBe(path.resolve(testPath) + path.sep);
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
        expect(results[6].error).toBeNull();
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
    it('throws an error if the flag to throw is set.', () => {
        expect(Fairu
            .with('./test/read/**/*.txt', './test/doesntexist')
            .throw()
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
        let formats = Object.keys(Fairu.Format);
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
        let formats = Object.keys(Fairu.Format);
        for (let f of formats) {
            expect(Fairu
                .with(`./test/read/format/invalid.${f}`)
                .throw(true)
                .format(f)
                .read()).rejects.toThrow();
        }
    });
    it('does not throw an error if the "throw" flag is disabled.', async () => {
        let formats = Object.keys(Fairu.Format);
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
    beforeAll((done) => {
        fs.mkdir('./test/write/')
            .then(() => fs.writeFile('./test/write/existing.txt', 'I exist. Only write me if you want to overwrite.'))
            .then(done);
    });
    afterAll((done) => {
        fs.rm('./test/write/', { recursive: true }).then(done);
    });
    it('writes file contents to a file that already exists.', async () => {
        let results = await Fairu.with('./test/write/existing.txt').write('mars');
        expect(results.length).toBe(1);
        expect(results[0]).toBeInstanceOf(PathState);
        let written = await fs.readFile('./test/write/existing.txt');
        expect(written.toString()).toBe('mars');
    });
    it('writes file contents to a file that does not exist.', async () => {
        let results = await Fairu
            .with('./test/write/bonkers.txt')
            .write('hello world');
        expect(results.length).toBe(1);
        expect(results[0]).toBeInstanceOf(PathState);
        let written = await fs.readFile('./test/write/bonkers.txt');
        expect(written.toString()).toBe('hello world');
    });
    it('creates a directory path if does not exist.', async () => {
        let results = await Fairu
            .with('./test/write/subdir/test/dir/')
            .write();
        expect(results.length).toBe(1);
        expect(results[0]).toBeInstanceOf(PathState);
        let stat = await fs.stat('./test/write/subdir/test/dir/');
        expect(stat.isDirectory()).toBe(true);
    });
    it('writes an object, stringified to json, toml, and yaml to path.', async () => {
        let formats = Object.keys(Fairu.Format);
        for (let f of formats) {
            let results = await Fairu
                .with(`./test/write/obj.${f}`)
                .format(f)
                .write(testObject);
            expect(results.length).toBe(1);
            expect(results[0]).toBeInstanceOf(PathState);
            let written = await fs.readFile(`./test/write/obj.${f}`);
            expect(written.toString()).toBe(Fairu.stringify(f, testObject));
        }
    });
});

describe('#append', () => {
    beforeAll((done) => {
        fs.mkdir('./test/append/')
            .then(() => fs.writeFile('./test/append/existing.txt', 'hello'))
            .then(() => fs.writeFile('./test/append/obj.json', '//append me\n'))
            .then(() => fs.writeFile('./test/append/obj.toml', '//append me\n'))
            .then(() => fs.writeFile('./test/append/obj.yaml', '//append me\n'))
            .then(done);
    });
    afterAll((done) => {
        fs.rm('./test/append/', { recursive: true }).then(done);
    });
    it('appends file contents to a file that already exists.', async () => {
        let results = await Fairu.with('./test/append/existing.txt').append(' jupiter');
        expect(results.length).toBe(1);
        expect(results[0]).toBeInstanceOf(PathState);
        let written = await fs.readFile('./test/append/existing.txt');
        expect(written.toString()).toBe('hello jupiter');
    });
    it('appends file contents to a file that does not exist.', async () => {
        let results = await Fairu
            .with('./test/append/kiwis.txt')
            .append('jumping kiwis');
        expect(results.length).toBe(1);
        expect(results[0]).toBeInstanceOf(PathState);
        let written = await fs.readFile('./test/append/kiwis.txt');
        expect(written.toString()).toBe('jumping kiwis');
    });
    it('creates a directory path if does not exist.', async () => {
        let results = await Fairu
            .with('./test/append/subdir/test/dir/')
            .append();
        expect(results.length).toBe(1);
        expect(results[0]).toBeInstanceOf(PathState);
        let stat = await fs.stat('./test/append/subdir/test/dir/');
        expect(stat.isDirectory()).toBe(true);
    });
    it('appends an object, stringified to json, toml, and yaml to path.', async () => {
        let formats = Object.keys(Fairu.Format);
        for (let f of formats) {
            let results = await Fairu
                .with(`./test/append/obj.${f}`)
                .format(f)
                .append(testObject);
            expect(results.length).toBe(1);
            expect(results[0]).toBeInstanceOf(PathState);
            let written = await fs.readFile(`./test/append/obj.${f}`);
            expect(written.toString()).toBe('//append me\n' + Fairu.stringify(f, testObject));
        }
    });
});

describe('#touch', () => {
    beforeAll((done) => {
        fs.mkdir('./test/touch/')
            .then(() => fs.writeFile('./test/touch/existing.txt', 'I exist. Don\'t touch me!'))
            .then(done);
    });
    afterAll((done) => {
        fs.rm('./test/touch/', { recursive: true }).then(done);
    });
    it('touches a new file into existence.', async () => {
        let results = await Fairu.with('./test/touch/new.txt').touch();
        expect(results.length).toBe(1);
        expect(results[0]).toBeInstanceOf(PathState);
        expect(fs.access('./test/touch/new.txt', constants.R_OK)).resolves.toBeUndefined();
    });
    it('touches an existing file and marks modified time.', async () => {
        let now = new Date().getTime();
        let results = await Fairu.with('./test/touch/existing.txt').touch();
        expect(results.length).toBe(1);
        expect(results[0]).toBeInstanceOf(PathState);
        let written = await fs.readFile('./test/touch/existing.txt');
        expect(written.toString()).toBe('I exist. Don\'t touch me!');
        let stat = await fs.stat('./test/touch/existing.txt');
        expect(Math.round(stat.atimeMs) + 1).toBeGreaterThan(now - 1);
    });
    it('touches an existing directory and marks modified time.', async () => {
        await fs.mkdir('./test/touch/dir/');
        let now = new Date().getTime();
        let results = await Fairu.with('./test/touch/dir').touch();
        expect(results.length).toBe(1);
        expect(results[0]).toBeInstanceOf(PathState);
        let stat = await fs.stat('./test/touch/dir/');
        expect(Math.round(stat.atimeMs) + 1).toBeGreaterThan(now - 1);
    });
});

describe('#unlink', () => {
    beforeAll((done) => {
        fs.mkdir('./test/unlink/empty', { recursive: true })
            .then(() => fs.mkdir('./test/unlink/subdir/dir', { recursive: true }))
            .then(() => fs.mkdir('./test/unlink/recurse/dir', { recursive: true }))
            .then(() => fs.writeFile('./test/unlink/sample-0.txt', 'lots of 00000s'))
            .then(() => fs.writeFile('./test/unlink/sample-1.txt', 'lots of 11111s'))
            .then(() => fs.writeFile('./test/unlink/sample-2.txt', 'lots of 22222s'))
            .then(() => fs.writeFile('./test/unlink/subdir/nada.json', '{}'))
            .then(() => fs.writeFile('./test/unlink/subdir/nada.yaml', ''))
            .then(() => fs.writeFile('./test/unlink/subdir/dir/1.yaml', ''))
            .then(() => fs.writeFile('./test/unlink/subdir/dir/2.toml', ''))
            .then(() => fs.writeFile('./test/unlink/recurse/sample.txt', 'i am toast'))
            .then(() => fs.writeFile('./test/unlink/recurse/dir/toast', 'no i am'))
            .then(done);
    });
    afterAll((done) => {
        fs.rm('./test/unlink/', { recursive: true }).then(done);
    });
    it('deletes a single file that exists.', async () => {
        await Fairu.with('./test/unlink/sample-0.txt').unlink();
        expect(fs.stat('./test/unlink/sample-0.txt')).rejects.toThrow(/ENOENT/);
    });
    it('deletes files using a glob pattern.', async () => {
        await Fairu.with('./test/unlink/**/*.yaml').unlink();
        expect(fs.stat('./test/unlink/subdir/nada.json')).resolves.toBeTruthy();
        expect(fs.stat('./test/unlink/subdir/nada.yaml')).rejects.toThrow(/ENOENT/);
        expect(fs.stat('./test/unlink/subdir/dir/1.yaml')).rejects.toThrow(/ENOENT/);
        expect(fs.stat('./test/unlink/subdir/dir/2.toml')).resolves.toBeTruthy();
    });
    it('deletes an empty directory.', async () => {
        await Fairu.with('./test/unlink/empty').unlink();
        expect(fs.stat('./test/unlink/empty')).rejects.toThrow(/ENOENT/);
    });
    it('deletes a directory recursively.', async () => {
        await Fairu.with('./test/unlink/recurse').unlink();
        expect(fs.stat('./test/unlink/recurse/sample.txt')).rejects.toThrow(/ENOENT/);
        expect(fs.stat('./test/unlink/recurse/dir/toast')).rejects.toThrow(/ENOENT/);
    });
});

describe('.cp', () => {
    beforeAll((done) => {
        fs.mkdir('./test/cp/subdir/dir', { recursive: true })
            .then(() => fs.writeFile('./test/cp/sample.txt', 'lots of 00000s'))
            .then(() => fs.writeFile('./test/cp/subdir/nada.json', '{}'))
            .then(() => fs.writeFile('./test/cp/subdir/dir/1.yaml', ''))
            .then(() => fs.writeFile('./test/cp/subdir/dir/2.toml', ''))
            .then(done);
    });
    afterAll((done) => {
        fs.rm('./test/cp/', { recursive: true }).then(done);
    });
    it('copies a single file that exists.', async () => {
        await fs.mkdir('./test/cp/target1');
        await Fairu.cp('./test/cp/sample.txt', './test/cp/target1/sample.txt');
        expect(fs.stat('./test/cp/target1/sample.txt')).resolves.toBeTruthy();
    });
    it('copies a directory recursively.', async () => {
        await fs.mkdir('./test/cp/target2');
        await Fairu.cp('./test/cp/subdir', './test/cp/target2/subdir');
        expect(fs.stat('./test/cp/target2/subdir/nada.json')).resolves.toBeTruthy();
        expect(fs.stat('./test/cp/target2/subdir/dir/1.yaml')).resolves.toBeTruthy();
        expect(fs.stat('./test/cp/target2/subdir/dir/2.toml')).resolves.toBeTruthy();
    });
});

describe('.mv', () => {
    beforeAll((done) => {
        fs.mkdir('./test/mv/subdir/dir', { recursive: true })
            .then(() => fs.writeFile('./test/mv/sample.txt', 'lots of 00000s'))
            .then(() => fs.writeFile('./test/mv/subdir/nada.json', '{}'))
            .then(() => fs.writeFile('./test/mv/subdir/dir/1.yaml', ''))
            .then(() => fs.writeFile('./test/mv/subdir/dir/2.toml', ''))
            .then(done);
    });
    afterAll((done) => {
        fs.rm('./test/mv/', { recursive: true }).then(done);
    });
    it('moves a single file that exists.', async () => {
        await Fairu.mv('./test/mv/sample.txt', './test/mv/moved.txt');
        expect(fs.stat('./test/mv/moved.txt')).resolves.toBeTruthy();
        expect(fs.stat('./test/mv/sample.txt')).rejects.toThrow();
    });
    it('moves a directory.', async () => {
        await Fairu.mv('./test/mv/subdir', './test/mv/target/subdir');
        expect(fs.stat('./test/mv/target/subdir/nada.json')).resolves.toBeTruthy();
        expect(fs.stat('./test/mv/target/subdir/dir/1.yaml')).resolves.toBeTruthy();
        expect(fs.stat('./test/mv/target/subdir/dir/2.toml')).resolves.toBeTruthy();
    });
});