# dependence [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

`dependence` brings dependency injection to node.js.

Manage your functions, variables and classes easily by turning them into dependencies. Get your modules under control.

## Install

```sh
$ npm install dependence --save
```

## Benefits

* **Faster code producing** by simply require dependencies in the constuctor parameter list.
* **Better unit testing** by easily mockup dependencies.

Example using `dependence`:

```js
// Resolves the standard modules 'fs' and 'path' automatically
module.exports = function(fs, path) {
	return function(dirName, fileName) {
      return fs.readFileSync(path.join(dirName, fileName));
   }
};
```
Default way:
```js
// No way to mock up those modules ...
var fs = require('fs');
var path = require('path');

module.exports = function(dirName, fileName) {
   return fs.readFileSync(path.join(dirName, fileName));
};
```

## Usage

### Shared dependency

```js
var dependencies = require('dependence')();
var assert = require('assert');

dependencies.register('level', 1);

dependencies.register('nextLevel', function(level) {
   return level + 1 // level equals 1
});

dependencies.resolve(function(nextLevel) {
   assert.equal(nextLevel, 2);
});
```

### Unshared dependency

```js
var dependencies = require('dependence')();
var assert = require('assert');

var i = 0;
function counterDependecy() {
   return ++i;
}
counterDependecy.shared = false; // Default: true

dependencies.register('counter', counterDependecy);

dependencies.resolve(function(counter) {
   assert.equal(counter, 1);
});

dependencies.resolve(function(counter) {
   assert.equal(counter, 2); // would be 1 if 'shared' was true or undefined
});
```

### Require explicitly

```js
var dependencies = require('dependence')();
var assert = require('assert');

dependencies.register("Who is there?", "John");

function talkToJohn(whoIsThere) {
	assert.equal(whoIsThere, "John");
	done();
};

talkToJohn.require = ['Who is there?'];

dependencies.resolve(talkToJohn);
```

### Options

* `shared (default: true)` - Defines the default value for sharing dependencies. Each dependency can overwrite this value by setting its own 'shared' attriute.
* `node (default: true)` - Set whether `dependence` should automatically try to require node modules if no dependency was found or not.
* `src (default: undefined)` - Creates a dependency provider that returns dependencies of .js files on the fly.

```js
var dependencies = require('dependence')({
	shared: false, // default: true
   node: true, // default: true
   src: __dirname + "/lib/**/*.js" // default: null
});
```

This equals `shared: false` ...
```js
var dependencies = require('dependence')(false);
```

Following equals `src: __dirname + "/lib/**/*.js"` ...
```js
var dependencies = require('dependence')(__dirname + "/lib/*.js");
```

If using `src`: `lib/nextLevel.js`
```js
module.exports = function(level) {
	return level + 1;
};
```

You can also write this angular style:
```js
module.exports = ['level', function(level) {
	return level + 1;
}];
```


## License

MIT © Alexander Löhn


[npm-image]: https://badge.fury.io/js/dependence.svg
[npm-url]: https://npmjs.org/package/dependence
[travis-image]: https://travis-ci.org/loehx/dependence.svg?branch=master
[travis-url]: https://travis-ci.org/loehx/dependence
[daviddm-image]: https://david-dm.org/loehx/dependence.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/loehx/dependence
[coveralls-image]: https://coveralls.io/repos/loehx/dependence/badge.svg
[coveralls-url]: https://coveralls.io/r/loehx/dependence
