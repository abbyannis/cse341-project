// Our initial setup (package requires, port number setup)
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes')
const User = require('./models/user');
const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000

const app = express();

app.use(express.static(path.join(__dirname, 'public')))
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs')
   .use(bodyParser.urlencoded({extended: false})) // For parsing the body of a POST
   .use('/', routes)
   .listen(PORT, () => console.log(`Listening on ${ PORT }`));

// mongoose
//    .connect(
//       'mongodb+srv://abbyannis:2JoxKnRiQhaFn0kY@cluster0.epw8q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
//    )
//    .then(result => {
//       // const user = new User({
//       //    name: 'abbyannis',
//       //    email: 'abbyannis@gmail.com',
//       //    cart: {
//       //       items: []
//       //    }
//       // });
//       // user.save();
//       app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
//    })
//    .catch(err => {
//       console.log(err);
//    });
