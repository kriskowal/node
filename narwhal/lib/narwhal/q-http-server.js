
/**
 * A promise-based JSGI server API.
 * @module
 */

/*whatsupdoc*/

var HTTP = require("http");
var Q = require("narwhal/promise-util");

/**
 * @param {respond(request Request)} respond a JSGI responder function that
 * receives a Request object as its argument.  The JSGI responder promises to
 * return an object of the form `{status, headers, body}`.  The status and
 * headers must be fully resolved, but the body may be a promise for an object
 * with a `forEach(write(chunk String))` method, albeit an array of strings.
 * The `forEach` method may promise to resolve when all chunks have been
 * written.
 * @returns a Node Server object.
 */
exports.Server = function (respond) {
    return HTTP.createServer(function (_request, _response) {
        var request = exports.Request(_request);
        Q.when(respond(request), function (response) {
            _response.writeHead(response.status, response.headers);
            return Q.when(response.body, function (body) {
                if (
                    Array.isArray(body) &&
                    body.length === 1 &&
                    typeof body[0] === "string"
                ) {
                    _response.end(body[0]);
                } else if (body) {
                    var complete = Q.forEach(response.body, function (chunk) {
                        _response.write(chunk);
                    });
                    return Q.when(complete, function () {
                        _response.end();
                    });
                } else {
                    _response.end();
                }
            });
        });
    });
};

/**
 * Inherits the Node HTTP Request object.
 */
exports.Request = function (_request) {
    var request = Object.create(_request);

    /*** 
     * @returns a promise for a String containing the entirety of the HTTP
     * request body. */
    request.read = function () {
        var deferred = Q.Deferred();
        var accumulate = []
        _request.addListener("data", function (chunk) {
            accumulate.push(chunk);
        });
        _request.addListener("end", function () {
            deferred.resolve(accumulate.join());
        });
        return deferred.promise;
    };
    return request;
};

