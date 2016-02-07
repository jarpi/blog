"use strict" 

var postsParser = require('../controllers/render.js'); 

module.exports = function postsRouter( app ) {

        //****************
        // Dependecies ***
        //****************
        var express = require('express');

        //************
        // Router App*
        //************
        var blogRouter = express.Router();
        var portfolioRouter = express.Router();

    //************
        // Routes ****
        //************

        // Blog ****** 
        //************ 
        blogRouter.route( '/' )
                .get(function( req, res, next ) {
            // /blog/index ...
            return postsParser.render('') 
            .then(function(r) { 
                return res.send(r).status(200); 
            }) 
            .catch(next); 
           });
        blogRouter.route( '/posts/:postname' )
                .get(function( req, res, next ) {
            // /blog/post/a-long-name-post
            return postsParser.render('') 
            .then(function(r) { 
                return res.send(r).status(200); 
            })
            .catch(next);
           });
        
        // Portfolio *** 
        //************** 
        
        portfolioRouter.route( '/' )
                .get(function( req, res, next ) {
            // /blog/index ...
            return postsParser.combinePortfolioWithData() 
            .then(function(r) { 
                return res.send(r).status(200); 
            }) 
            .catch(next); 
           });

        //************
        // Init ******
        //************
        app.use('/blog', blogRouter);
        app.use('/portfolio', portfolioRouter); 
};                  

