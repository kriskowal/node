
// -- kriskowal Kris Kowal Copyright (C) 2009-2010 MIT License
// -- cadorn Christoph Dorn

var exports = require('./file');
var nodeFs = require("node/fs");
var nodeProcess = require("node/process")
var io = require("./io");

exports.SEPARATOR = '/';

exports.cwd = function () {
    return nodeProcess.cwd();
};

// TODO necessary for package loading
exports.list = function (path) {
    throw Error("list not yet implemented.");
};

exports.canonical = function (path) {
    var paths = [exports.cwd(), path];
    var outs = [];
    var prev;
    for (var i = 0, ii = paths.length; i < ii; i++) {
        var path = paths[i];
        var ins = exports.split(path);
        if (exports.isDrive(ins[0]))
            outs = [ins.shift()];
        while (ins.length) {
            var leaf = ins.shift();
            var consider = exports.join.apply(undefined, outs.concat([leaf]));

            // cycle breaker; does not throw an error since every invalid path
            // must also have an intrinsic canonical name.
            if (consider == prev) {
                ins.unshift.apply(ins, exports.split(link));
                break;
            }
            prev = consider;

            try {
                var link = nodeFs.readlink(consider);
            } catch (exception) {
                link = undefined;
            }
            if (link !== undefined) {
                ins.unshift.apply(ins, exports.split(link));
            } else {
                outs.push(leaf)
            }
        }
    }
    return exports.join.apply(undefined, outs);
};

exports.exists = function (path) {
    try {
        nodeFs.stat(String(path));
        return true;
    } catch (exception) {
        return false;
    }
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
    try {
        var stat = nodeFs.stat(String(path));
    } catch (exception) {
        return false;
    }
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

