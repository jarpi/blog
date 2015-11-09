"use strict" 

var fs = require('fs'); 
var md = require('./markdownparser.js'); 
var utils = require('./utils.js'); 

var render =  function(postName) { 
	var promises = []; 
	return fs.readFileAsync('./content/templates/post.html', 'utf8') 
	.then(function(postTemplate) {
		return fs.readFileAsync('./content/posts/example-post.md', 'utf8') 
		.then(function(postContent) {
			return md.combineTemplateWithMarkdown(postContent); 
		})
		.then(function(parsedContent) {
			return postTemplate.replace('{content}', parsedContent); 
		});    
	});  
}; 


Promise.promisify(fs, 'readFile'); 

module.exports = {'render' : render}; 
