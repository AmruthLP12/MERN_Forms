var Dependence = require('./dependence')

/**
 * Expose Dependency class
 * param {Object} options Please see README for more information
 */
module.exports = function(options) {
	options = prepareOptions(options);
	var dependencies = new Dependence(options.shared);

	// Use node proider (default: true)
	if (options.node !== false)
		dependencies.use(require("./providers/nodeModules")());

	// Use file system provider (default: null)
	if (typeof options.src === 'string')
		dependencies.use(require("./providers/fileSystem")(options.src));

	return dependencies;
}

/**
 * Merges the user with the default options.
 */
function prepareOptions(options) {
	switch (typeof options) {
		case "string":
			options = {
				src: options
			}
			break;
		case "boolean":
			options = {
				shared: options
			}
			break;
	}
	return options || {};
}
