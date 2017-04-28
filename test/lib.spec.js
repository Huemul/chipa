const { extractSingle, extract } = require('../lib')

describe('extractSingle', () => {
  describe('when no second argument is passed', () => {
    it('extracts ALL the snippets from a file', () => {
      // paths must be relative to the current directory
      process.chdir(__dirname)
      const file = 'snippets.md'

      return extractSingle(file).then(result => {
        expect(result).toMatchSnapshot()
      })
    })
  })

  describe('when a language is provided', () => {
    it('extracts the corresponding snippets from a file', () => {
      process.chdir(__dirname)
      const file = 'snippets.md'

      const ps = [
        extractSingle(file, ['js', 'javascript']),
        extractSingle(file, 'bash'),
        extractSingle(file, 'go'),
      ]
      return Promise.all(ps).then(([js, bash, go]) => {
        expect(js).toMatchSnapshot()
        expect(bash).toMatchSnapshot()
        expect(go).toMatchSnapshot()
      })
    })
  })

  describe('when the file has no snippets', () => {
    it('resolves with empty snippets', () => {
      process.chdir(__dirname)
      const file = 'no-code.md'

      return extractSingle(file).then(result => {
        expect(result.snippets.length).toBe(0)
      })
    })
  })
})

describe('extract', () => {
  describe('for a provided glob', () => {
    it('resolves with the snippets for each files & skips empty ones', () => {
      process.chdir(__dirname)
      const glob = '*.md'

      return extract(glob).then(files => {
        expect(files).toMatchSnapshot()
      })
    })
  })
})
