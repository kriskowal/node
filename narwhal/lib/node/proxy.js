var FS = require("narwhal/fs");
var UTIL = require("narwhal/util");
var nodeRequire = require("node/loader").require;
var id = FS.base(module.path, ".js");
var engine = nodeRequire(id);
UTIL.update(exports, engine);
