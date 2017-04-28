const { readFile } = require('../lib/utils')
const path = require('path')

describe('readFile', () => {
  it('resolves with the content of a file', () => {
    process.chdir(__dirname)
    const file = 'no-code.md'

    return readFile(file).then(content => {
      expect(content).toMatchSnapshot()
    })
  })

  it('rejects with the ENOET error', () => {
    process.chdir(__dirname)
    const file = 'non-existent.txt'

    return readFile(file).catch(error => {
      expect(error).toMatchSnapshot()
    })
  })
})
