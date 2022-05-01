import Util from './util.js';

const testObject = {
    abc: 123,
    hello: 'world',
    truth: false,
    zed: { ok: 3.14159 }
};

describe('.stringify', () => {
    it('throws on unknown format.', () => {
        expect(() => Util.stringify('bob', testObject)).toThrow('format');
    });
    it('stringifies to JSON.', () => {
        expect(Util.stringify(Util.format.JSON, testObject)).toBe('{\n    "abc": 123,\n    "hello": "world",\n    "truth": false,\n    "zed": {\n        "ok": 3.14159\n    }\n}');
    });
    it('stringifies to JSON with different indent.', () => {
        expect(Util.stringify(Util.format.JSON, testObject, 1)).toBe('{\n "abc": 123,\n "hello": "world",\n "truth": false,\n "zed": {\n  "ok": 3.14159\n }\n}');
    });
    it('stringifies to TOML.', () => {
        expect(Util.stringify(Util.format.TOML, testObject)).toBe('abc = 123\nhello = "world"\ntruth = false\n\n[zed]\nok = 3.14159\n');
    });
    it('stringifies to YAML.', () => {
        expect(Util.stringify(Util.format.YAML, testObject)).toBe('abc: 123\nhello: world\ntruth: false\nzed:\n    ok: 3.14159\n');
    });
    it('stringifies to YAML with different indent.', () => {
        expect(Util.stringify(Util.format.YAML, testObject, 1)).toBe('abc: 123\nhello: world\ntruth: false\nzed:\n ok: 3.14159\n');
    });
});

describe('.parse', () => {
    it('throws on unknown format.', () => {
        expect(() => Util.parse('bob', '')).toThrow('format');
    });
    it('throws on bad parse.', () => {
        expect(() => Util.parse(Util.format.JSON, '{][][[--++')).toThrow();
        expect(() => Util.parse(Util.format.TOML, '{][][[--++')).toThrow();
        expect(() => Util.parse(Util.format.YAML, '{][][[--++')).toThrow();
    });
    it('parses JSON.', () => {
        expect(Util.parse(Util.format.JSON, '{\n    "abc": 123,\n    "hello": "world",\n    "truth": false,\n    "zed": {\n        "ok": 3.14159\n    }\n}')).toMatchObject(testObject);
    });
    it('parses TOML.', () => {
        expect(Util.parse(Util.format.TOML, 'abc = 123\nhello = "world"\ntruth = false\n\n[zed]\nok = 3.14159\n')).toMatchObject(testObject);
    });
    it('parses YAML.', () => {
        expect(Util.parse(Util.format.YAML, 'abc: 123\nhello: world\ntruth: false\nzed:\n    ok: 3.14159\n')).toMatchObject(testObject);
    });
});