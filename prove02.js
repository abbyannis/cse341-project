const path = require('path');

const express = require('Express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'prove02/views');

const bookData = require('./prove02/routes/prove02-routes');

app.use(bodyParser({extended: false}));
app.use(express.static(path.join(__dirname, 'prove02/public')));

app.use(bookData.routes);

app.use((req, res, next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found', path: '404'});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));