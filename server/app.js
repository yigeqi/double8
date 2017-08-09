const express = require('express')
const path = require('path')

const app = express()
//server static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')))
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

const PORT = process.env.PORT || 3000
app.listen(3000, () => {
  console.log(`app is listening on port ${PORT}.`)
})