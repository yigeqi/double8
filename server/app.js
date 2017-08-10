const express = require('express')
const path = require('path')
var bodyParser = require('body-parser')

const app = express()

app.set('port', process.env.PORT || 3000);
//server static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

app.listen(app.get('port'), () => {
  console.log(`app is listening on port ${app.get('port')}.`)
})