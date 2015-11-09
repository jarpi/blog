"use strict" 

var posts = require('../controllers/runner.js'); 

module.exports = function postsRouter( app ) {

        //****************
        // Dependecies ***
        //****************
        var express = require('express');

        //************
        // Router App*
        //************
        var defaultRouter = express.Router();

	//************
        // Routes ****
        //************
        defaultRouter.route( '/' )
                .get(function( req, res, next ) {
			// /blog/index ...
			return posts.render('') 
			.then(function(r) { 
				return res.send(r).status(200); 
			}) 
			.catch(next); 
	       });
	defaultRouter.route( '/posts/:postname' )
                .get(function( req, res, next ) {
			// /blog/post/a-long-name-post
			return posts.render('') 
			.then(function(r) { 
				return res.send(r).status(200); 
			})
			.catch(next);
	       });
	//************
        // Init ******
        //************
        app.use('/blog', defaultRouter);
};                  
