const fs = require('fs')

const readFile = filePath => new Promise((resolve, reject) => {
 fs.readFile(filePath, 'utf8', (err, data) => {
   if (err) {
     reject({ path: filePath, err })
   } else {
     resolve(data)
   }
 })
})

module.exports = {
  readFile,
}

