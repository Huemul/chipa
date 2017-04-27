# chipa 

> Easily extract code snippets from Markdown files.

## Usage

### `extractSingle`

```
Snippet :: { lang: String, meta: String, value: String }
FileResult :: { file: String, lang: String, snippets: [Snippet] }

extractSingle :: String -> String?|[String]? -> Promise(FileResult)

extractSingle(filePath: String, language?: String|[String])
```

`filePath`: file path.

`language`: the language to search for. If not provided will match every
language.

```js
const { extractSingle } = require('chipa')

extractSingle('README.md', ['js', 'javascript'])
  .then((result) => {
    // do stuff with the snippets
  })
```

### `extract`

```
extract :: String -> String?|[String]? -> Promise([FileResult])

extract(glob: String, language?: String|[String])
```

`glob`: any valid [`node-glob`](https://github.com/isaacs/node-glob) pattern.

`language`: the language to search for. If not provided will match every
language..

```js
const { extract } = require('chipa')

extract('docs/*.md', 'go')
  .then((files) => {
    // doo stuff with the snippets
  })
```
