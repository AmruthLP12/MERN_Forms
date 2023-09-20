/**
 * Project specific helper functions
 */
var helpers = module.exports = {

   /**
    * Extracts the method argument names of a named or anonymous function
    * param {Function} func Named or anonymous function
    */
    extractFunctionParameters: function(func) {
        if (func.__parameters)
            return func.__parameters;

        var match = func.toString().match(/function.*?\(([\s\S]*?)\)/);
        if (!(match != null)) {
            throw new Error("Could not get function arguments: " + func.toString());
        }
        return func.__argumentNames = match[1].split(",")
            .filter(function(str) {
                return !!str;
            })
            .map(function(str) {
                return str.trim();
            });
    }
}
