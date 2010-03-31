
// -- tlrobinson Tom Robinson
// -- kriskowal Kris Kowal Copyright (C) 2009-2010 MIT License

/**
 * @module
 * @extends narwhal/io-boot
 */

var BINARY = require("binary");
var NODE_FS = require("node/process").fs;
var TRANSCODE = require("transcode");
var Buffer = require("narwhal/buffer").Buffer;
var BOOT = require("narwhal/io-boot");
var UTIL = require("narwhal/util");

UTIL.update(exports, BOOT);

/**
 * @returns a raw byte stream, supporting both reading and writing
 * APIs.
 * @param {Number} fd file descriptor
 * @constructor
 * @extends io-boot#Reader
 */
var FdIO = exports.openFd = function (fd) {
    var self = Object.create(FdIO.prototype);

    /*** */
    self.fd = fd;

    /*** */
    self.readMax = function (max) {
        // read some
        max = max || 1024;
        var binary = new BINARY.ByteArray(max);
        var buffer = binary._bytes;
        var actual = NODE_FS.readInto(fd, buffer, 0, max, 0);
        return binary.slice(0, actual).toByteString();
    };

    /*** */
    self.readInto = function (buffer, start, stop) {
        return NODE_FS.readInto(fd, buffer, start, stop);
    };

    /*** */
    self.write = function (binary, start, stop) {
        binary = binary._bytes || binary;
        if (!(binary instanceof Buffer))
            throw new Error("openFd::write(0) must be a Buffer");
        if (start === undefined)
            start = 0;
        if (stop === undefined)
            stop = binary.length;
        while (start < stop) {
            start += NODE_FS.writeFrom(fd, binary, start, stop, 0);
        }
    };

    /*** */
    self.isTty = function () {
        // TODO
        //NODE_FS.isatty(fd);
        return false;
    };

    /*** */
    self.flush = function () {
        // NODE_FS.fsync(fd);
    };

    /*** */
    self.close = function () {
        NODE_FS.close(fd);
    };

    return self;
};

FdIO.prototype = Object.create(BOOT.Reader.prototype);
FdIO.prototype.constructor = FdIO;


/* ByteIO */

// FIXME: this doesn't read/write the same stream

var ByteIO = exports.ByteIO = function(binary) {
    throw new Error("Not yet implemented");

    /* rhino impl
    this.inputStream = binary ? new java.io.ByteArrayInputStream(binary._bytes, binary._offset, binary._length) : null;
    this.outputStream = new java.io.ByteArrayOutputStream();
    
    var stream = (this.inStream, this.outStream);
    
    this.length = binary ? binary.length : 0;
    */
};

ByteIO.prototype = Object.create(exports.IO.prototype);

ByteIO.prototype.toByteString = function() {
    throw new Error("Not yet implemented");

    /* rhino impl
    var bytes = this.outputStream.toByteArray();
    var ByteString = require("binary").ByteString;
    return new ByteString(bytes, 0, bytes.length);
    */
};

ByteIO.prototype.decodeToString = function(charset) {
    return String(charset ? this.outputStream.toString(charset) : this.outputStream.toString());
};

var StringIO = exports.StringIO = function (initial, delimiter) {
    throw new Error("Not yet implemented");

    /* rhino impl
    var buffer = new java.lang.StringBuffer();
    if (!delimiter)
        delimiter = "\n";
    if (initial)
        buffer.append(initial);

    function length() {
        return buffer.length();
    }

    function read(length) {
        if (arguments.length == 0) { 
            var result = String(buffer);
            buffer['delete'](0, buffer.length());
            return result;
        } else {
            if (!length || length < 1)
                length = 1024;
            length = Math.min(buffer.length(), length);
            var result = String(buffer.substring(0, length));
            buffer['delete'](0, length);
            return result;
        }
    }

    function write(text) {
        buffer.append(text);
        return self;
    }

    function copy(output) {
        output.write(read()).flush();
        return self;
    }

    function next() {
        if (buffer.length() == 0)
            throw StopIteration;
        var pos = buffer.indexOf(delimiter);
        if (pos == -1)
            pos = buffer.length();
        var result = read(pos);
        read(1);
        return result;
    }

    var self = {
        get length() {
            return length();
        },
        read: read,
        write: write,
        copy: copy,
        close: function () {
            return self;
        },
        flush: function () {
            return self;
        },
        iterator: function () {
            return self;
        },
        forEach: function (block) {
            while (true) {
                try {
                    block.call(this, next());
                } catch (exception) {
                    if (exception instanceof StopIteration)
                        break;
                    throw exception;
                }
            }
        },
        readLine: function () {
            var pos = buffer.indexOf(delimiter);
            if (pos == -1)
                pos = buffer.length();
            return read(pos + 1);
        },
        readLines: function () {
            var lines = [];
            do {
                var line = self.readLine();
                if (line.length)
                    lines.push(line);
            } while (line.length);
            return lines;
        },
        next: next,
        print: function (line) {
            return write(line + delimiter).flush();
        },
        toString: function() {
            return String(buffer);
        },
        substring: function () {
            var string = String(buffer);
            return string.substring.apply(string, arguments);
        },
        slice: function () {
            var string = String(buffer);
            return string.slice.apply(string, arguments);
        },
        substr: function () {
            var string = String(buffer);
            return string.substr.apply(string, arguments);
        }
    };
    return Object.create(self);
    */
};

