const dotenv = require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const expressLayout = require('express-ejs-layouts')
const path = require('path');
const app = express();

//Body Parser
app.use(express.urlencoded({ extended: false }))

//Cookie parser
app.use(cookieParser());

//Set ejs
app.use(expressLayout);
app.use(express.static(path.join(__dirname + '/views/public')));
app.use(express.static(path.join('../picturedemo/')))
app.set('view engine', 'ejs');

//Define Routes
app.use('/', require('./Routes/dashboard'));
app.use('/auth', require('./Routes/auth'));

app.use((req, res, next) => {
    const title = "404 not found"
    res.status(404)
    res.render('404', { title: title })
})

app.listen(8080,
    console.log('Start server at port 3000'));
