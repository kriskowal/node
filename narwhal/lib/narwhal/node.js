
var Q = require("narwhal/promise");
var UTIL = require("narwhal/util");

/**
 */
exports.nodify = function (exports, imports) {
    UTIL.forEachApply(imports, function (key, value) {
        if (typeof value === "function") {
            exports[key] = nodifyFunction(value);
        } else {
            exports[key] = value;
        }
    });
};

/**
 */
var nodifyFunction = exports.nodifyFunction = function (decorated) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        var deferred = Q.defer();
        args[decorated.length - 1] = function (reason, value) {
            if (reason)
                return Q.reject(reason);
            else
                return deferred.resolve(value);
        };
        decorated.apply(this, args);
        return deferred.promise;
    };
};

