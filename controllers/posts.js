"use strict" 

var posts = {}; 
var dict = { 
	add: function(name, value, hits) {
		posts[name] = {parsedFile: value, hitted: hits};  
	}, 

	getPosts:  function() { return posts; }  
 }; 

module.exports = dict;  
