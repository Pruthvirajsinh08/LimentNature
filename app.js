var express = require("express");
var app = express();
// process.env.PORT = 3000;

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var methodOverride = require("method-override");
app.use(methodOverride("_method"));

var flash = require("connect-flash");
app.use(flash());

// DATABASE CONFIG
var mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost/liment_nature_v1");
mongoose.connect("mongodb://Rusty:Dusty02@ds263520.mlab.com:63520/limentnature");

// MODELS CONFIG
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");


// EXPRESS - SESSION CONFIG
app.use(require("express-session")({
	secret: "Whats up with all this authentication?",
	resave: false,
	saveUninitialized: false
}));

// PASSPORT - REQUIRE
var passport = require("passport");
var LocalStrategy = require("passport-local");

// PASSPORT - CONFIG
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// REMAINING SETUPS
app.use(express.static(__dirname + "/public"));		//public directory setup
app.set("view engine", "ejs");						// file.ejs extention setup

app.use(function(req, res, next){		// pass data to every route
	res.locals.currentUser = req.user;						// local user
	res.locals.errorFlashMessage = req.flash("error");		// error flash message
	res.locals.successFlashMessage = req.flash("success");	// success flash message
	next();
});


// ROUTES - REQUIRE
var authRoutes = require("./routes/auth");
var campgorundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");

// ROUTES - CONFIG
app.use(authRoutes);
app.use("/campgrounds", campgorundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// SERVER - LISTENING
app.listen(process.env.PORT, process.env.IP, function(){
	console.log("LimentNature Server is listening at Port : " + process.env.PORT);
})