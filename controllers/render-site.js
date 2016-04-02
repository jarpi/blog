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

function loadPortfolio() {
    return fs.readFileAsync('./portfolio/index.html', 'utf8');     
}

function addContentToCache(combinedPost, postName) {
    docs.add(postName, combinedPost, 1); 
    return combinedPost;
}

function getParsedTemplate( tplData, contentData ) {
    return Object.keys(contentData).reduce(function( tplData, contentDataKey ) {
        var contentDataValue = contentData[contentDataKey]; 
        var contentDataTagKey = '{{' + contentDataKey + '}}'; 
        var dataType = getJsonDataType( contentDataValue ); 

        if ( !contentDataValue ) return tplData; 

        if (dataType === 'val') {
            tplData = tplData.replace( contentDataTagKey, contentDataValue ); 
        } 

        else if (dataType === 'arr' || dataType === 'valArr') {
           var replacedContent = getArrReplacedContent( contentDataKey, 
                                contentDataTagKey, 
                                contentDataValue,  
                                tplData 
                                );   
            tplData = replacedContent; 
        } 

        return tplData; 
    }, tplData ); 
} 


function getJsonDataType( value ) { 
    return ( !Array.isArray(value) ? 
        'val' : 
        Object(value[0]) === value[0] ? 
            'valArr' : 
            'arr' ); 
} 

function getArrReplacedContent( contentDataKey, contentDataTagKey, contentDataValue, tplData ) {
    var contentDataTagKeyEnd = '{{/' + contentDataKey + '}}'; 
    var tagBeginPosition = tplData.indexOf(contentDataTagKey) + contentDataTagKey.length; 
    var tagEndPosition = tplData.indexOf(contentDataTagKeyEnd); 
    var tagRange = tplData.indexOf(contentDataTagKeyEnd) - tagBeginPosition; 
    var tplTag = tplData.substr( tagBeginPosition, 
                                 tagRange ); 
    var replacedContent = ''; 
    contentDataValue.forEach(
        function(item) { 
            replacedContent += getParsedTemplate( tplTag, Object(item) !== item ? {value: item} : item )
        } 
    );  
    var preReplace = tplData.substr( 0, 
                                     tagBeginPosition - contentDataTagKey.length ); 
    var postReplace = tplData.substr( tagEndPosition  + contentDataTagKeyEnd.length ); 
    return preReplace + replacedContent + postReplace; 
} 

function parsePost(postName) {
    return loadPortfolio()
    .then(function( tplData ) {
        var contentData = require('../portfolio/data.json'); 
        return getParsedTemplate( tplData, contentData ); 
    })
    .then(function(parsedPost) {
        return addContentToCache(parsedPost, postName); 
    }); 
}

Promise.promisify(fs, 'readFile'); 

module.exports = {'render' : render} 
