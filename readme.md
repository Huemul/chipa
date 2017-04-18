# chipa 

> Easily extract code snippets from Markdown files.

## Usage

```js
const { parseFile, parsePath } = require('extractor')

parseFile('README.md', ['js', 'javascript'])
  .then((res) => {
    res.snippets // an array of snippets
    res.file     // the filename
    res.lang     // the the language 

    // ...
  })

parsePath('docs/*.md', ['js', 'javascript'])
  .then((res) => {
    res // an array with an object per file

    // ...
  })
```
