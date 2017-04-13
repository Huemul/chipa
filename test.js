const { parsePath } = require('./lib')

const log = (...arg) => console.log(...arg)

parsePath('examples/*.md')
  .then(o => JSON.stringify(o, null, '\t'))
  .then(log, log)

