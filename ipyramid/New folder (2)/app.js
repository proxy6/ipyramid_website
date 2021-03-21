const express = require("express");
const ejs = require('ejs');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const cors = require("cors");
const multer = require('multer')
const { storage } = require('./cloudinary')
const upload = multer({ storage: storage });
app.set('view engine', 'ejs');
const ejsEngine = require('ejs-mate');
app.engine('ejs', ejsEngine);
const User = require('./models/User')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const sessionConfig = {
  secret: 'thisisasecretkey',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now * 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//set up flash message
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next();
})


//Body paser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//set up PUT and DELETE method overide
app.use(methodOverride('_method'));

//Middle Wares
/** For Cross Origin Resource Sharing (CORS)*/
app.use(cors());

//set up mongoose
mongoose.connect('mongodb://localhost:27017/ipyramid', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('db connected')
});

//routes
const blogRoutes = require('./routes/blog');
const userRoutes = require('./routes/user');


app.use('/blogs', blogRoutes);
app.use('/user', userRoutes)

const PORT = 3200 || process.env.PORT;

app.listen(PORT, () => {
    console.log('server started at port ' + PORT);
})