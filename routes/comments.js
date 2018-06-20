var express = require("express");
var router = express.Router({mergeParams: true});
var middleware = require("../middleware");

// MODELS CONFIG
var Campground = require("../models/campground");
var Comment = require("../models/comment");


// RESTfull ROUTES

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new", {campground: campground});
		}
	});
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}
		else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}
				else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();

					campground.comments.push(comment);
					campground.save();
					
					req.flash("success", "New Comment added");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

// EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

// UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			console.log(err);
		}
		else{
			req.flash("success", "Updated comment");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DELETE ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			console.log(err);
		}
		else{
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


module.exports = router;