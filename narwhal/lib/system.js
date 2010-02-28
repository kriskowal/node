
// -- tlrobinson Tom Robinson
// -- kriskowal Kris Kowal

var io = require("./io");
var fs = require("./file");

exports.print = function () {
    exports.stdout.write(Array.prototype.join.call(arguments, ' ') + "\n").flush();
};

var rawStdin =  io.ByteStream(0);
var rawStdout = io.ByteStream(1);
var rawStderr = io.ByteStream(2);

exports.stdin  = new io.TextInputStream(new io.IO(rawStdin, null));
exports.stdout = new io.TextOutputStream(new io.IO(null, rawStdout));
exports.stderr = new io.TextOutputStream(new io.IO(null, rawStderr));

exports.originalArgs = exports.args.slice(0);

exports.env = {};

exports.fs = fs;

// default logger
var Logger = require("./logger").Logger;
exports.log = new Logger(exports.stderr);

