"use strict" 

var fs = require('fs'); 
var md = require('./markdownparser.js'); 
var utils = require('./utils.js'); 
var os = require('os'); 
var docs = require('./posts.js'); 


var getCombinedPost = function(postName) { 
    return (docs.existsPostByKey(postName) ? 
                Promise.resolve(docs.getPostByKey(postName).parsedFile) :  
                parsePost(postName));
}; 

function loadTemplate() {
    return fs.readFileAsync('./content/templates/post.html', 'utf8'); 
} 

function loadPost() {
    return fs.readFileAsync('./content/posts/example-post.md', 'utf8'); 
} 

function loadPortfolio() {
    return fs.readFileAsync('./content/portfolio/index.html', 'utf8');     
}

function parsePostTags(postContent) {
    return md.parseFileContentTags(postContent); 
} 

function addContentToCache(combinedPost, postName) {
    docs.add(postName, combinedPost, 1); 
    return combinedPost;
}

function combineTemplateWithPost(parsedContent) {
    return loadTemplate()
    .then(function(postTemplate) {
        var combinedContent = postTemplate.replace('{content}', parsedContent); 
        return combinedContent; 
    })
    .catch(function(err) {
        console.dir(err); 
        return err; 
    }); 
} 

function parsePost(postName) {
    return loadPost()   
    .then(parsePostTags)
    .then(combineTemplateWithPost)      
    .then(function(combinedPost){
        return addContentToCache(combinedPost, postName); 
    }); 
}

Promise.promisify(fs, 'readFile'); 

module.exports = {'render' : getCombinedPost} 
