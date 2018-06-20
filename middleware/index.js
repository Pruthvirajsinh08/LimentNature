// MODELS CONFIG
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

// CHECK USER LOGIN
middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("/login");
	}
};

// CHECK CAMPGROUND OWNERSHIP
middlewareObj.checkCampgroundOwnership = function(req, res, next){
	// is user logged in?
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "Campground not found!!");
				console.log(err);
			}
			else{
				// does user own the campground?
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}
				else{
					req.flash("error", "You don't have permission to do that");
					res.redirect(req.originalUrl + "/..");
				}
			}
		});
	}
	else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect(req.originalUrl + "/..");
	}
};

// CHECK COMMENT OWNERSHIP
middlewareObj.checkCommentOwnership = function(req, res, next){
	// is user logged in?
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", "Comment not found!!");
				console.log(err);
			}
			else{
				// does user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}
				else{
					req.flash("error", "You don't have permission to do that");
					res.redirect(req.originalUrl + "/..");
				}
			}
		});
	}
	else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect(req.originalUrl + "/..");
	}
};


module.exports = middlewareObj;