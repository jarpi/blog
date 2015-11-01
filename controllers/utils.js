exports.polyfill = function(){ 
	Promise.prototype.constructor.promisify = Promise.promisify || function(object, method) {
		object[method+'Async'] = function() {
			var args = Array.prototype.slice.call(arguments);	
			return new Promise(function(resolve, reject) {
				args[args.length] = function(err, v) {
					if (err) reject(err);
					resolve(v);
				};
				object[method].apply(object, args);
			});
		};
	}; 
}(); 
