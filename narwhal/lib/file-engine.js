
// -- kriskowal Kris Kowal Copyright (C) 2009-2010 MIT License
// -- cadorn Christoph Dorn

var exports = require('./file');
var nodeFs = require("node/fs");
var nodeProcess = require("node/process")
var io = require("./io");

exports.SEPARATOR = '/';

exports.cwd = function () {
    throw Error("cwd not yet implemented.");
};

// TODO necessary for package loading
exports.list = function (path) {
    throw Error("list not yet implemented.");
};

// TODO necessary for package loading
exports.canonical = function (path) {
    return path;
    throw Error("canonical not yet implemented.");
};

exports.exists = function (path) {
    throw Error("exists not yet implemented.");
};

// TODO necessary for lazy module reloading in sandboxes
exports.mtime = function (path) {
    return nodeFs.stat(String(path)).mtime;
};

exports.size = function (path) {
    throw Error("size not yet implemented.");
};

exports.stat = function (path) {
    var stat = nodeFs.stat(String(path));
    return {
        mtime: stat.mtime
    }
};

// TODO necessary for package loading
exports.isDirectory = function (path) {
    var stat = nodeFs.stat(String(path));
    return stat.mode & nodeProcess.S_ISDIR;
};

// TODO necessary for module loading
// exports.isFile = function (path) {
    //throw Error("isFile not yet implemented.");
//};

// XXX remove this if you implement isFile here
// from bootstrap system object:
/*
exports.isFile = system.fs.isFile;
*/

/*
exports.isFile = system.fs.isFile; // TEMPORARY HACK
*/

exports.isLink = function (path) {
    throw Error("isLink not yet implemented.");
};

exports.isReadable = function (path) {
    throw Error("isReadable not yet implemented.");
};

exports.isWritable = function (path) {
    throw Error("isWritable not yet implemented.");
};

exports.rename = function (source, target) {
    throw Error("rename not yet implemented.");
};

exports.move = function (source, target) {
    throw Error("move not yet implemented.");
};

exports.remove = function (path) {
    throw Error("remove not yet implemented.");
};

exports.mkdir = function (path) {
    throw Error("mkdir not yet implemented.");
};

exports.rmdir = function(path) {
    throw Error("rmdir not yet implemented.");
};

exports.touch = function (path, mtime) {
    throw Error("touch not yet implemented.");
};

// FIXME temporary hack
/*
var read = system.fs.read; // from bootstrap system object
*/

exports.FileIO = function (path, mode, permissions) {
    mode = exports.mode(mode);
    var read = mode.read,
        write = mode.write,
        append = mode.append,
        update = mode.update;

    var flags = 0;

    if (update) {
        flags = nodeProcess.O_RDWR;
    } else if (write) {
        flags = nodeProcess.O_WRONLY;
    } else if (append) {
        flags = nodeProcess.O_WRONLY | nodeProcess.O_APPEND;
    } else if (read) {
        flags = nodeProcess.O_RDONLY;
    } else {
        throw new Error("Files must be opened either for read, write, or update mode.");
    }

    return io.ByteStream(nodeFs.open(path, flags, 0644));
};

