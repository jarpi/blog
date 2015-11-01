"use strict" 
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
			res.send('/blog/').status(200); 
	       });
	defaultRouter.route('/post/:postname')
                .get(function( req , res ) {
			// /blog/post/a-long-name-post 
			res.send('/blog/post/').status(200); 
	       });
	//************
        // Init ******
        //************
        app.use('/blog', defaultRouter);
};                  
