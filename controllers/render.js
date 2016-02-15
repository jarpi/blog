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

function composeRepeatingBlock(portfolioData, key, ant, startIdx, endIdx) {
    var tagFromTplToRepeat = ant.substr(startIdx, endIdx - startIdx); 
    return parseArrayTpl(portfolioData, key, tagFromTplToRepeat); 
} 


function parseArrayTpl(data, key, tagFromTplToRepeat) {
    return data[key].map(function(dataToRepeat) {
        return Object.keys(dataToRepeat).reduce(function(finalString, prop) {
            return finalString.replace('{{'+ key+'.'+ prop + '}}', dataToRepeat[prop]); 
        }, tagFromTplToRepeat); 
    });  
} 

function getSearchObj(key, ant) {
    var obj = {
        startKey : '{{' + key + '}}', 
        endKey : '{{/' + key + '}}' 
    };  
    obj.startTagIdx =  ant.indexOf(obj.startKey) + obj.startKey.length; 
    obj.endTagIdx =  ant.indexOf(obj.endKey); 
    return obj; 
} 


function getParsedTemplateWithData(tpl, dataArr, portfolioData) {
    return dataArr.reduce(function(ant, key) {
            var keyValue = portfolioData[key]; 
            if (!keyValue) return ant; 
            var parsedData = null; 
            var objCoord = getSearchObj(key, ant);  
            parsedData = (Array.isArray(keyValue) && keyValue.length > 0 ? 
                composeRepeatingBlock(portfolioData, key, ant, objCoord.startTagIdx, objCoord.endTagIdx) : 
                null); 
            var preReplace = ant.substr(0, objCoord.startTagIdx-objCoord.startKey.length); 
            var postReplace = ant.substr(objCoord.endTagIdx + objCoord.endKey.length, ant.length-(objCoord.endTagIdx + objCoord.endKey.length));
            var rep = parsedData ? (preReplace + parsedData.join('') + postReplace) : null; 
            return (parsedData ? rep : ant.replace('{{'+key+'}}', keyValue));         
        }, tpl);
} 

function combinePortfolioWithData() {
    var portfolioData = require('../portfolio/data.json'); 
    var tpl = null; 
    return fs.readFileAsync('./portfolio/index.html', 'utf8')
    .then(function(indexTpl) {
        tpl = indexTpl; 
        return Object.keys(portfolioData);           
    }).then(function(dataArr){
            return getParsedTemplateWithData(tpl, dataArr, portfolioData); 
    }); 
} 


/* function combinePortfolioWithData() {
    var data = require('../portfolio/data.json'); 
    return fs.readFileAsync('./portfolio/index.html', 'utf8')
    .then(function(tpl) {
        return Object.keys(data).reduce(function(ant, key) {
            if (!data[key]) return ant; 
            var parsedData = null; 
            var startKey = '{{' + key + '}}'; 
            var endKey = '{{/' + key + '}}'; 
            var startTag = ant.indexOf(startKey) + startKey.length; 
            var endTag = ant.indexOf(endKey); 
            if (Array.isArray(data[key]) && data[key].length > 0) {
                debugger; 
                // Should create multiple elements where object is found 
                var tagFromTplToRepeat = ant.substr(startTag, endTag - startTag); 
                parsedData = data[key].map(function(dataToRepeat) {
                    return Object.keys(dataToRepeat).reduce(function(finalString, prop) {
                        return finalString.replace('{{'+ key+'.'+ prop + '}}', dataToRepeat[prop]); 
                    }, tagFromTplToRepeat); 
                });  
            };  
            var preReplace = ant.substr(0, startTag-startKey.length); 
            var postReplace = ant.substr(endTag+endKey.length, ant.length-(endTag+endKey.length));
            var rep = parsedData ? (preReplace + parsedData.join('') + postReplace) : null; 
            return (parsedData ? rep : ant.replace('{{'+key+'}}', data[key]));         
        }, tpl);          
    }); 
} */ 

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
