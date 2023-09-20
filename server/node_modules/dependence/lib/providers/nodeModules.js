/**
 * Creates a dependency provider that tries to find a local node module. (e.g. 'fs' or 'path')
 * Please see unit tests for a better understanding.
 */
module.exports = function() {
	return function(name, callback) {
		var nodeModule;

		try {
			nodeModule = require(name);
		} catch (e) {
			console.error('[dependence] Node module could not be required (' + name + '): ' + e.stack);
		}

		function dependency() {
			return nodeModule;
		};

		dependency.shared = false;

		callback(dependency);
	}
}
