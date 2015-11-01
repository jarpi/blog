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

	       });
	defaultRouter.route('/post')
                .get(function( req , res ) {
			// /blog/post/a-long-name-post 
	       });
	//************
        // Init ******
        //************
        app.use('/blog', defaultRouter);
};                  
