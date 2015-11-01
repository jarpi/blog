"use strict" 

module.exports = function( app ) {
        
        //*****************
        // Dependencies ***
        //*****************     
        
        //**************** 
        // Middleware **** 
        //**************** 
        app.all('*', function( req , res , next ) {
                var logRequest = new Object({
                         request : req.url 
                        ,params : req.body  
                        ,type : req.method
                        ,ip : req.ip 
                });             
                /* logRequestCtrl.addLog(logRequest, function( err , log ) {
                        if (err) throw(err); 
                        // console.dir(logRequest); 
                }); */  
                next();  
        });  
	
	app.use(function(err, req, res, next){
		// Uncaught exception 
		console.error("Hey! An error was thrown!" + err.stack || err.message); 
		res.send('Oops! that\'s embarassing :$').status(500); 
	});
 	
        //****************
        // Routes init ***
        //**************** 
        require('./postsroutes.js')( app ); 

	//********************
	// Catch all *********
	//******************** 
	app.use(function(req, res) {
		res.send('Catch all').status(404); 	
	});
}; 
