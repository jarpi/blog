"use strict" 

var parser = require('../controllers/runner.js'); 

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
        defaultRouter.route('/')
                .get(function( req , res ) {
			// /blog/index ...
			var result = parser.findAndParsePost(''); 
			result.then(function(r) { 
				return res.send(r).status(200); 
			}); 
	       });
	defaultRouter.route('/post/:postname')
                .get(function( req , res ) {
			// /blog/post/a-long-name-post 
			var result = parser.findAndParsePost(''); 
			result.then(function(r) { 
				return res.send(r).status(200); 
			}); 
	       });
	//************
        // Init ******
        //************
        app.use('/blog', defaultRouter);
};                  
