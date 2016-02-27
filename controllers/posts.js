"use strict" 

var posts = {}; 
var dict = { 
	add: function(name, value, hits) {
		posts[name] = {parsedFile: value, hitted: hits};  
	}, 

	getPosts:  function() { return posts; }, 
    getPostByKey: function(postName) { return posts[postName]; }, 
    existsPostByKey: function(postName) { return postName && posts[postName]; } 
 }; 

module.exports = dict;  
