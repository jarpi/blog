var postsParser = require('../../controllers/render.js'); 
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised'); 
var expect = chai.expect;
var should = chai.should();  
chai.use(chaiAsPromised); 

describe('Render', function(){
	
	it('Should return HTML from MD', function(done) {
		return postsParser.render('') 
		.should.be.fulfilled
		.should.notify(done); 	
	});
});  
