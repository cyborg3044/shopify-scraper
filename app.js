
const express = require('express');
const getResults = require('./scraper');
const app = express();


app.post('/schedule', function (req, res) {
  res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
});


(function() {
  getResults();
})();

app.get('/scrap', async function(req, res){
   const result =getResults();
   res.send(result)

})


const port = 9000;

app.listen(port, () => console.log('STARTING...'))

module.exports = app;