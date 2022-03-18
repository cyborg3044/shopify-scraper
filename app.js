const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const getResults = require('./scraper');
const app = express();


app.post('/schedule', function (req, res) {
  res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
});

// self executing func to trigger the scraper
// can also trigger
(function() {
  getResults();
})();

app.get('/scrap', async function(req, res){
   const result =getResults();
   res.send(result)

})

app.get('/', (req, res) => {
  res.send('hello world')
})


const port = 9000;
app.listen(port, () => console.log('STARTING...'))
module.exports = app;