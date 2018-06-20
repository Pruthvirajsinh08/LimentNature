var express = require("express");
var router = express.Router();
var passport = require("passport");

// MODELS CONFIG
var User = require("../models/user");


// RESTfull ROUTES

// INDEX ROUTE
router.get("/", function(req, res){
	res.render("landing");
});


// AUTHENTICATION ROUTES

// REGISTER ROUTE
router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			res.redirect("/register");
		}
		else{
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to LimentNature " + user.username);
				res.redirect("/campgrounds");
			});
		}
	});
});

// LOGIN ROUTE
router.get("/login", function(req, res){
	res.render("login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res){});

// LOGOUT ROUTE
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Successfully Logged you out");
	res.redirect("/campgrounds");
});


module.exports = router;