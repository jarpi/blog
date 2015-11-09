var md = require('../../controllers/markdownparser.js'); 
var chai = require('chai');
var expect = chai.expect; 

describe('Markdown parser', function(){
	
	describe('Parse header tags', function() {
		it('# header', function(done) {
			var headerTag = md.combineTemplateWithMarkdown('# header'); 
			expect(headerTag).equals('<h1> header</h1>'); 
			done(); 	
		});
		it('#header', function(done) {
			var headerTag = md.combineTemplateWithMarkdown('#header'); 
			expect(headerTag).equals('<h1>header</h1>'); 
			done(); 	
		});
		it('blabla #header \'\\n\' blabla', function(done) {
			var headerTag = md.combineTemplateWithMarkdown('blabla #header\n blabla'); 
			expect(headerTag).equals('blabla <h1>header</h1>\n blabla'); 
			done(); 	
		});


	}); 
	describe('Parse link tags', function() {
		it('[Link](http://www.google.es)', function(done) {
		var linkTag= md.combineTemplateWithMarkdown('[Link](http://www.google.es)'); 
                         expect(linkTag).equals('<a href=\'http://www.google.es\'>Link</a>');
                         done();  	
		}); 
	}); 

	describe('Parse pre tags', function() {
		it('\'```\' name \\n bla bla \\n \'```\'', function(done) {
			var preTag= md.combineTemplateWithMarkdown('``` Syntax highlighting. \nand a <b>Tag</b> ```\n'); 
			 expect(preTag).equals('<pre> highlighting. \nand a <b>Tag</b> </pre>\n');
			 done();
		}); 
	}); 
});  
