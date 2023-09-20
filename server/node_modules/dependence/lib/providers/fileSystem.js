var path = require('path');
var glob = require('glob');

/**
 * Creates a dependency provider that creates dependencies of .js files on the fly.
 * Please see unit tests for a better understanding.
 */
module.exports = function(globPath) {
	var dependencyPaths = {};

	// Add files to the dependencies
	if (typeof globPath !== 'string')
		throw "'globPath' should be of type string!";

	// Get file paths using glob
	var paths = glob.sync(globPath);

	// Make paths work with 'require'
	for (var i = 0; i < paths.length; i++) {
		var filePath = paths[i];
		var name = path.basename(filePath, '.js');

		dependencyPaths[name] = filePath.replace(/.js$/, '');
	}

	return function(name, callback) {
		var filePath = dependencyPaths[name];
		var result;

		if (!filePath)
			return callback(undefined);

		try {
			result = require(filePath);

			// Handle angular style
			if (result && result.length && result.slice) {
				var required = result.slice(0, result.length - 1);
				result = result[result.length - 1];
				result.require = required;
			}

		} catch (e) {
			console.error('[dependence] Error requiring file: ' + filePath + '.js');
			console.error(e.stack);
		}

		callback(result);
	}
}
