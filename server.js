const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
//mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/exercise-track' )
//to check if DB is properly loaded
mongoose.connect(process.env.MONGO_URI);
mongoose.connection
  .once('open', () => console.log('Connection Established'))
  .on('error', (error) => console.warn('Warning', error));



app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//attaching html
app.get('/', (req, res) => {
  res.sendFile(/*__dirname*/process.cwd() + '/views/index.html')//__dirname==process.cwd()==/app
  });
//attaching css in /public folder
app.use(express.static('public'))//option #1- requires just style.css in html
//app.use('/public', express.static(process.cwd() + '/public'));//option#2- requires stating path to .css in html

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
