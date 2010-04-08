
// Map/Reduce with Promises on Narwhal+Node

var SYSTEM = require("system");
var EL = require("event-loop");
var Q = require("narwhal/promise");
var UTIL = require("narwhal/util");

// to simulate a long latency, promise-returning API
var delay = function (timeout) {
    var deferred = Q.defer();
    EL.setTimeout(function () {
        deferred.resolve();
    }, timeout);
    return deferred.promise;
};

// map
var sum = UTIL.range(10).map(function (n) {
    // UTIL range returns a list from 0 to 9
    return Q.when(delay(1000), function () {
        return n;
    });
// reduce
}).reduce(function (sum, n) {
    return Q.when(n, function (n) {
        return Q.when(sum, function (sum) {
            return sum + n;
        });
    });
});

return Q.when(sum, function (sum) {
    SYSTEM.print(sum);
});

// Narwhal kriskowal/narwhal/future: http://github.com/kriskowal/narwhal/commit/b32f48a3663b703407f85f9d33d9b29b4b99ef60
// Node kriskowal/node/narwhal-master: http://github.com/kriskowal/node/commit/522b28e2bc8a95effd21804bfc7d2689806bac51
// at narwhal/packages/narwhal-node (make, but install is not necessary)
// Does not yet compile on Linux due to iconv being in libc instead of libiconv

