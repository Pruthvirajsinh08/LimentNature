var express = require("express");
var router = express.Router();
var middleware = require("../middleware");

// MODELS CONFIG
var Campground = require("../models/campground");
var campgroundList = [];


// RESTfull ROUTES

// INDEX ROUTE
router.get("/", function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
	var newCampground = req.body.campground;
	newCampground.author = {
		id: req.user._id,
		username: req.user.username
	};

	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			req.flash("success", "New Campground added");
			res.redirect("/campgrounds");
		}
	});
});

// SHOW ROUTE
router.get("/:id", function(req, res){
	campgroundList.pop();
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			campgroundList = allCampgrounds;
		}
	});
	
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/show", {campground: foundCampground, campgroundList: campgroundList});
		}
	});
});

// EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	});
});

// UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			console.log(err);
		}
		else{
			req.flash("success", "Updated campground details");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DELETE ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}
		else{
			req.flash("success", "Successfully deleted campground");
			res.redirect("/campgrounds");
		}
	});
});


module.exports = router;