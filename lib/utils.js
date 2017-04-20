const fs = require('fs')

// readFile :: String -> Promise(String)
const readFile = filePath =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })

module.exports = {
  readFile,
}
