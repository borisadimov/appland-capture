const express = require('express')
const app = express()
const port = process.env.PORT || 3131
const screenshot = require('./screenshot')
const level = require('level')
const axios = require('axios').default;
const SERVER_URL = process.env.SERVER_URL ? `${process.env.SERVER_URL}` : "localhost:3131";


const protocol = process.env.SERVER_URL ? 'https' : 'http'


const db = level('hash')

app.use(express.json());
app.set('view engine', 'pug')
app.set('views', './views')
app.use(express.static('dist'))


app.get('/', async (req, res) => {
  URL = 'https://gist.githubusercontent.com/flywithmemsl/82242a372bbc7c462c8907c1e0c6245c/raw/031be7271dfbe5ba67c6bd998a08fa26a692db80/data.json'

  const responce = await axios.get(URL, {
    headers: { 'Content-Type': 'text/plain' },
  })
  const value = JSON.stringify(responce.data);

  res.render('index', { payload: value })
})

app.get('/diagram', (req, res) => {
  db.get(req.query.key, function (err, value) {
    if (err) return console.log('Ooops!', err) // likely the key was not found
    res.render('index', { payload: value })
  })

})

app.get('/screenshot', async (req, res) => {
  const reqUrl = req.query.url;
  const responce = await axios.get(reqUrl, {
    headers: { 'Content-Type': 'text/plain' },
  })

  const key = (responce.data.source_control && responce.data.source_control.commit) || "" + Math.random() * 1000
  const value = JSON.stringify(responce.data);

  db.put(key, value, function (err) {
    if (err) return console.log('Ooops!', err)
  })

  const url = `${protocol}://${SERVER_URL}/diagram?key=${key}`;

  (async () => {
    const buffer = await screenshot(url)
    res.setHeader('Content-Disposition', 'attachment; filename="screenshot.png"')
    res.setHeader('Content-Type', 'image/png')
    res.send(buffer)
  })()

})

app.post('/screenshot', (req, res) => {

  const key = (req.body.source_control && req.body.source_control.commit) || "" + Math.random() * 1000

  db.put(key, JSON.stringify(req.body), function (err) {
    if (err) return console.log('Ooops!', err)
  })

  const url = `${protocol}://${SERVER_URL}/diagram?key=${key}`;

  (async () => {
    const buffer = await screenshot(url)
    res.setHeader('Content-Disposition', 'attachment; filename="screenshot.png"')
    res.setHeader('Content-Type', 'image/png')
    res.send(buffer)
  })()
})

app.listen(port, () => console.log(`app listening on port ${port}!`))