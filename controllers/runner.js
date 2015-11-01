"use strict" 

var fs = require('fs'); 
var md = require('./markdownparser.js'); 
var utils = require('./utils.js'); 

var findAndParsePost = function(postName) { 
	return fs.readFileAsync('./content/templates/post.html', 'utf8'); 
}; 

Promise.promisify(fs, 'readFile'); 

module.exports = {'findAndParsePost' : findAndParsePost}; 
