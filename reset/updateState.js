const fs = require('fs')
updateState = function (params) {
  fs.readFile('./state.json', 'utf8', function (err, filedata) {
    if (err) {
      console.log("Error:::", err)
    }
    filedata = JSON.parse(filedata)

    Object.keys(params).forEach( function(key) {
      filedata[key] = params[key]
    })

    fs.writeFile('./state.json', JSON.stringify(filedata), function (err) {
      if (err) {
        console.log(err)
      }
      console.log("State updated!")
    })
  })
}
module.exports = updateState
