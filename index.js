// Our initial setup (package requires, port number setup)
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '.env')});
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes')
const p = path.join(path.dirname(require.main.filename), '.env');
console.log(p);
const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000

const app = express();

app.use(express.static(path.join(__dirname, 'public')))
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs')
   .use(bodyParser.urlencoded({extended: false})) // For parsing the body of a POST
   .use('/', routes)
   .listen(PORT, () => console.log(`Listening on ${ PORT }`));