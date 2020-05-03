//
// // createGameRome
// // joinGameRome
// //
// // drawCards
// // initGame
// // saveState
// //
// // getHistoryByUserIds()

const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(bodyParser.json())
app.use('/api', require('./routes'));

module.exports = app
