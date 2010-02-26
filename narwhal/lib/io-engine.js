
// -- tlrobinson Tom Robinson
// -- kriskowal Kris Kowal Copyright (C) 2009-2010 MIT License

var BINARY = require("binary");
var nodeFs = require("node/fs");

var IO = exports.IO = function(inputStream, outputStream) {
    this.inputStream = inputStream;
    this.outputStream = outputStream;
};

IO.prototype.readInto = function(buffer, length, from) {

    var bytes = buffer._bytes; // Node Buffer

    var offset = buffer._offset;
    if (typeof from === "number")
        offset += from;

    if (length > bytes.length + offset)
        throw "FIXME: Buffer too small. Throw or truncate?";

    var total = 0,
        bytesRead = 0;

    while (total < length) {
        bytesRead = this.inputStream.read(bytes, offset + total, length - total);
        if (bytesRead < 0)
            break;
        total += bytesRead;
    }

    return total;
};

IO.prototype.writeInto = function(buffer, from, to) {
    return this.outputStream.write(buffer, buffer._offset + from, to - from);
};

IO.prototype.copy = function (output, mode, options) {
    while (true) {
        var buffer = this.read(null);
        if (!buffer.length)
            break;
        output.write(buffer);
    }
    output.flush();
    return this;
};

IO.prototype.flush = function() {
    this.outputStream.flush();
    return this;
};

IO.prototype.close = function() {
    if (this.inputStream)
        this.inputStream.close();
    if (this.outputStream)
        this.outputStream.close();
};

IO.prototype.isatty = function () {
    return false;
};

exports.ByteStream = function (fd) {
    return {
        "read": function (max) {
            if (arguments.length == 0) {
                throw new Error("Read all not supported directly by ByteStream");
            } else {
                // read some
                max = max || 1024;
                var binary = new BINARY.ByteArray(max);
                var buffer = binary._bytes;
                var actual = nodeFs.readInto(fd, buffer, 0, max, 0);
                return binary.slice(0, actual).toByteString();
            }
        },
        "readInto": function (buffer, start, stop) {
            return nodeFs.readInto(fd, buffer._bytes, start, stop, 0);
        },
        "write": function (binary, start, stop) {
            nodeFs.writeFrom(fd, binary._bytes, start, stop, 0);
        },
        "flush": function () {
            //nodeFs.flush(fd);
        },
        "close": function () {
            nodeFs.close(fd);
        }
    };
};

exports.TextInputStream = function (raw, lineBuffering, buffering, charset, options) {

    var bytes = new BINARY.ByteArray(1024);
    var chars = "";
    var end = 0;

    var self = this;

    self.raw = raw;

    self.readLine = function () {
        do {
            var actual = raw.readInto(bytes, end, 1024 * 16);
            end += actual;
            for (var i = 0; i < 4; i++) {
                try {
                    chars += bytes.slice(0, end - i).toString(charset);
                } catch (exception) {
                }
            }
            end = 0;
            var pos;
            if ((pos = chars.indexOf("\n")) >= 0) {
                try {
                    return chars.slice(0, pos + 1);
                } finally {
                    chars = "";
                }
            }
        } while (actual > 0);
        return chars + bytes.toString(charset);
    };

    self.next = function () {
        return self.readLine().replace(/\n$/, '');
    };

    self.iterator = function () {
        return self;
    };

    self.forEach = function (block, context) {
        var line;
        while (true) {
            try {
                line = self.next();
            } catch (exception) {
                break;
            }
            block.call(context, line);
        }
    };

    self.readLines = function () {
        var lines = [];
        do {
            var line = self.readLine();
            if (line.length)
                lines.push(line);
        } while (line.length);
        return lines;
    };

    self.read = function () {
        return self.readLines().join('');
    };

    self.copy = function (output, mode, options) {
        do {
            var line = self.readLine();
            output.write(line).flush();
        } while (line.length);
        return self;
    };

    self.close = function () {
        raw.close();
    };

    return Object.create(self);
};

exports.TextOutputStream = function (raw, lineBuffering, buffering, charset, options) {

    var self = this;

    self.raw = raw;

    self.write = function (string) {
        raw.write(string.toByteString(charset));
        return self;
    };

    self.writeLine = function (line) {
        raw.write(string.toByteString(charset) + "\n");
        return self;
    };

    self.writeLines = function (lines) {
        lines.forEach(self.writeLine);
        return self;
    };

    self.print = function () {
        self.write(Array.prototype.join.call(arguments, " ") + "\n");
        self.flush();
        // todo recordSeparator, fieldSeparator
        return self;
    };

    self.flush = function () {
        raw.flush();
        return self;
    };

    self.close = function () {
        raw.close();
        return self;
    };

    return Object.create(self);
};

exports.TextIOWrapper = function (raw, mode, lineBuffering, buffering, charset, options) {
    if (mode.update) {
        return new exports.TextIOStream(raw, lineBuffering, buffering, charset, options);
    } else if (mode.write || mode.append) {
        return new exports.TextOutputStream(raw, lineBuffering, buffering, charset, options);
    } else if (mode.read) {
        return new exports.TextInputStream(raw, lineBuffering, buffering, charset, options);
    } else {
        throw new Error("file must be opened for read, write, or append mode.");
    }
}; 


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

ByteIO.prototype = new exports.IO();

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

