"use strict" 

exports.parseFileContentTags = function( mdfile ) { 
        var mdHead = /(#)(\s*.*)/igm, 
        mdHighligth = /(`{3}\s*)([A-z]+\b)([^`]+)(`{3})/igm, 
        mdLink = /\[(.+)\]\((.+)\)/igm,  
        result = ''; 
        result = mdfile.replace(mdHead,'<h1>$2</h1>') 
                .replace(mdHighligth,'<pre>$3</pre>') 
                .replace(mdLink,'<a href=\'$2\'>$1</a>'); 
        return result;  
}; 
