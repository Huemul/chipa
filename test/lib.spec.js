const { parseFile, parsePath } = require('../lib')

describe('parseFile', () => {

  describe('when no second argument is passed', () => {
    it('extracts ALL the snippets from a file', () => {
      // glob uses process.cwd()
      // since jest is being run at the home of the project
      // the path has to be relative to that
      return parseFile('./test/snippets.md')
        .then(result => {
          expect(result).toMatchSnapshot()
        })
    })

  })

  describe('when a language is provided', () => {
    it('extracts the corresponding snippets from a file', () => {
      const ps = [
        parseFile('./test/snippets.md', ['js', 'javascript']),
        parseFile('./test/snippets.md', 'bash'),
        parseFile('./test/snippets.md', 'go'),
      ]
      return Promise.all(ps)
        .then(([js, bash, go]) => {
          expect(js).toMatchSnapshot()
          expect(bash).toMatchSnapshot()
          expect(go).toMatchSnapshot()
        })
    })
  })

  describe('when the file has no snippets', () => {
    it('resolves with empty snippets', () => {
      return parseFile('./test/no-code.md')
        .then(result => {
          expect(result.snippets.length).toBe(0)
        })
    })
  })

})

describe('parsePath', () => {

  describe('for a provided glob', () => {
    it('resolves with the snippets for each files & skips empty ones', () => {
      return parsePath('./test/*.md')
        .then(files => {
          expect(files).toMatchSnapshot()
        })
    })
  })

})

