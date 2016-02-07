"use strict" 

var fs = require('fs'); 
var md = require('./markdownparser.js'); 
var utils = require('./utils.js'); 
var os = require('os'); 
var docs = require('./posts.js'); 


var render =  function(postName) { 
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

function combinePortfolioWithData() {
    var data = require('../portfolio/data.json'); 
    return fs.readFileAsync('./portfolio/index.html', 'utf8')
    .then(function(tpl) {
        return Object.keys(data).reduce(function(ant, act) {
            console.log('REP ' + ant); 
            var parsedData = null; 
            var startTag = tpl.indexOf('{{' + act + '}}') + act.length+4; 
            var endTag = tpl.indexOf('{{/' + act + '}}') + act.length-6; 
            if (Array.isArray(data[act])) {
                // Should create multiple elements where object is found 
                var tagTpl = tpl.substr(startTag, endTag - startTag); 
                parsedData = data[act].map(function(item) {
                    return Object.keys(item).reduce(function(prev, prop) {
                        var t = prev.replace('{{'+ act +'.'+ prop + '}}', item[prop]); 
                        return t;  
                    }, tagTpl); 
                });  
                console.log(parsedData); 
            };  
            var rep = parsedData ? (ant.substr(0, startTag-startTag.length) + parsedData.join('') + ant.substr(endTag+endTag.length, ant.length-(endTag+endTag.length))) : false; 
            return (parsedData ? rep : ant.replace('{{'+act+'}}', data[act]));         
        }, tpl);          
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

module.exports = {'render' : render, 'combinePortfolioWithData' : combinePortfolioWithData} 
