const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const app =express();
const flash= require('connect-flash')
const session = require('express-session')
const passport = require('passport');

//passport config

require('./config/passport')(passport);
 //Connect to Mongo
 
// DB Config

const mongoDB =
"mongodb://127.0.0.1:27017/fullStack";

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
console.log('We are connected to database');
});

//ejs

app.use(expressLayouts);
app.set('view engine','ejs');

//bodyparser
app.use(express.urlencoded({extended:false}));
//express-session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());


//connect flash
app.use(flash());

//global vars

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/',require('./routes/index'));


app.use('/users',require('./routes/users')); 

const PORT =process.env.PORT || 5000;

app.listen(PORT,console.log(`server started on port ${PORT}`)); 