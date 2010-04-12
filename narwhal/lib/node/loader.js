
// CommonJS
var SYSTEM = require("system");
// Narwhal
var FS = require("narwhal/fs");
var ENGINE = require("engine");
// Node
var PROCESS = require.force("process");
var EVENTS = require("events");
var PATH = require("path");

var loader = require.loader;
var root = FS.path(module.path).resolve("../../../");
var lib = root.resolve("lib/");
var memo = {
    "process": PROCESS,
    "events": EVENTS,
    "path": PATH
};

exports.global = PROCESS.global = {};

exports.require = function (baseId) {
    var path = lib.resolve(baseId + ".js");
    if (!path.isFile())
        throw new Error("Node-loader failed to find '" + baseId + "' module.");
    var text = path.read({"charset": "UTF-8"});
    var _exports = {};
    ENGINE.Module(text, path, 1)({
        "process": PROCESS,
        "global": exports.global,
        "exports": _exports,
        "require": function (id) {
            id = loader.resolve(id, baseId);
            if (memo[id])
                return memo[id];
            return exports.require(id);
        },
        "module": {
            "id": "node/" + baseId,
            "path": path.toString()
        }
    });
    return _exports;
};

