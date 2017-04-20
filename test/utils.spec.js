const { readFile } = require('../utils')

describe('readFile', () => {
  it('resolves with the content of a file', () => {
    return readFile('./test/no-code.md')
      .then(content => {
        expect(content).toMatchSnapshot()
      })
  })

  it('rejects with the ENOET error', () => {
    return readFile('./test/non-existent.txt')
      .catch(error => {
        expect(error).toMatchSnapshot()
      })
  })
})

