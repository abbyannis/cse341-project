// Our initial setup (package requires, port number setup)
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '.env')});
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes')
const favicon = require('serve-favicon');
const multer = require('multer');
const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000

const app = express();

// const http = require('http');
// const socket = require('./public/scripts/socket');
// const server = http.createServer(app);
// // const { Server } = require('socket.io');
// const io = require('./public/scripts/socket').init(server);

const fileStorage = multer.diskStorage( {
   destination: (req, file, cb) => {
      cb(null, 'images');
   },
   filename: (req, file, cb) => {
      cb(null, /*file.filename + '-' +*/ file.originalname);
   }
});
const fileFilter = (req, file, cb) => {
   if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      cb(null, true);
   } else {
      cb(null, false);
   }
}
app.use(favicon(__dirname + '/public/images/favicon.png'));

app.use(express.static(path.join(__dirname, 'public')))
   .use('/images', express.static(path.join(__dirname, 'images')))
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs')
   .use(bodyParser.urlencoded({extended: false})) // For parsing the body of a POST
   .use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))
   .use('/', routes);

const server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = require('socket.io')(server);

io.on('connection', (socket) => {
   console.log('Client Connected');
   socket.on('disconnect', () => {
      console.log('user disconnected');
   })
   socket.on('newSuper', () => {
      console.log('made it here dumb'); 
      socket.broadcast.emit('update-list');
   })
})



