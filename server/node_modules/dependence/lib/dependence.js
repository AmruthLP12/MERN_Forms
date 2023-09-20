var async = require('async');
var helpers = require('./helpers');

/**
 * TODO: Add discription here ...
 *
 */
var Dependence = module.exports = function(shared) {
	this.shareDependencies = shared === undefined ? true : !!shared;

	this.dependencies = {};
	this.shared = {};
	this.providers = [];

	this.use = Dependence.prototype.use.bind(this);
	this.register = Dependence.prototype.register.bind(this);
	this.resolve = Dependence.prototype.resolve.bind(this);
}

Dependence.prototype = {

	/**
	 * Use a provider to resolve dependencies by name.
	 * param {Function} provider Provider to resolve a dependency by name.
	 */
	use: function(provider) {
		switch (typeof provider) {
			case 'function':
				this.providers.unshift(provider);
				break;
			case 'string':
				this.registerFiles(provider);
				break;
			default:
				throw "'provider' must be either of string or function! Actual type: " + typeof provider;
		}
	},

	/**
	 * Register a dependency directly without using a provider.
	 * You can also overwrite dependencies here!
	 * param {String} name Name of the dependency. Should be the same as the parameter name of the resolving function.
	 * param {Function} dependency Dependency that can also have multiple dependencies in its parameters.
	 */
	register: function(name, dependency) {
		if (typeof dependency === 'function')
			return this.dependencies[name] = dependency;

		this.shared[name] = dependency;
	},

	/**
	 * Resolves all dependencies defined in the parameters of a function
	 * or just a single dependency by passing the specific name.
	 * param {Function|String} arg Either the name or a function to resolve.
	 * param {Function(err, dependency)} callback Function to receive either an error and a dependency (if resolving directly by name) or the return value of the resolved function.
	 */
	resolve: function(arg, callback) {
		switch (typeof arg) {
			case 'string':
				this.resolveDependency(arg, callback);
				break;
			case 'function':
				this.resolveFunction(arg, callback);
				break;
			default:
				throw "'arg' must be either string or function! It was: " + typeof arg;
		}
	},

	/**
	 * Resolves all dependencies defined in the parameters of a function
	 * param {Function} func Function that can have multiple dependencies in its parameters.
	 * param {Function} callback Receives the result of func.
	 */
	resolveFunction: function(func, callback, history) {
		var self = this;

		// Extract dependency names
		var dependencyNames = func.require || helpers.extractFunctionParameters(func);

		// If there is nothing to resolve -> just call func
		if (dependencyNames.length == 0)
			return callback(func());

		if (!history)
			history = [];

		// Resolve dependencies and call func
		async.map(dependencyNames, function(name, callback) {
			// Resolve dependency pasing the cloned history.
			self.resolveDependency(name, function(dependency) {
				callback(null, dependency);
			}, history.slice());
		}, function done(err, dependencies) {
			callFunc(dependencies);
		});

		function callFunc(dependencies) {
			var result = func.apply(self, dependencies); // Calls the dependency constructor passing the dependencies
			if (callback) callback(result); // Provide the result of func to callback
		}
	},

	/**
	 * Tries to resolve a dependency directly by name
	 * param {String} name Dependency name
	 * param {Function(dependency)} callback Provides the resolved dependency
	 */
	resolveDependency: function(name, callback, history) {
		var self = this;
		if (!history) history = [];

		// Check circular dependency
		if (history.indexOf(name) !== -1) {
			history.push("[" + name + "]");
			console.error("Circular dependency found!\n" + history.join("\n -> "));
			return callback(null);
		}
		else {
			history.push(name);
		}

		// If dependency was resolved already -> return the result
		var shared = this.shared[name];
		if (shared) return callback(shared);

		// If dependency was found already -> resolve it and return result
		var dependency = this.dependencies[name];
		if (dependency)
			return done(dependency);

		// Walk through the providers until one of them gives back a dependency
		async.eachSeries(self.providers, function(provider, callback) {
			provider(name, function(dependency) {
				if (!dependency) return callback();
				if (typeof dependency !== 'function') {
					callback();
					throw "Provider returned an invalid dependency of type: " + typeof dependency;
				}

				callback(dependency);
			});
		}, done);

		// Resolve the dependencies of the dependency and return the result
		function done(dependency) {
			// Could not be resolved
			if (!dependency) {
				return callback(undefined);
			}

			// Ensure dependency is a function
			if (typeof dependency !== 'function') {
				return callback(undefined);
			}

			// Save dependency
			self.dependencies[name] = dependency;

			// Resolve dependency
			self.resolveFunction(dependency, function(resolved) {
				var saveToShared = dependency.shared !== undefined ? dependency.shared : self.shareDependencies;
				if (saveToShared)
					self.shared[name] = resolved;

				callback(resolved);
			}, history || [])
		}
	}
}
