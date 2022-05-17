## Description
Fairu allows you to quickly discover files in one or multiple paths, and supports glob patterns. In the following
examples, we will presume that the following directory structure is present:

```
 | test/
 - - file1.txt
 - - file2.txt
 - - markdown.md
 - | buildings/
 - - - warehouse.html
 - | houses/
 - - - index.html
 - - - house.png
 - root.mp3
```

#### Discovering files in a specific path.

```js
let found = await Fairu
    .with('./test/')
    .discover();
```

#### Discovering files in a multiple paths.

```js
let found = await Fairu
    .with('./test/buildings/', './test/houses/')
    .discover();
```