const express = require('express')
const app = express()
const port = process.env.PORT || 2999

app.use(express.static(__dirname + '/dist'));

app.get('/', (req, res) => {
  res.render('index.html')
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
