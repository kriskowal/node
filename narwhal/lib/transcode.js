
var Buffer = require("node/buffer").Buffer;
var Transcoder = require("node/encodings").Transcoder;

// reads bytes, returns chars
exports.EncoderReader = function (raw, charset, length) {
    var self = Object.create(exports.EncoderReader.prototype);
    var transcoder = new Transcoder(charset, "UTF-8");
    var source = new Buffer(length || 1024);
    var target = new Buffer(length || 1024);
    var stop = 0; // end of unused source bytes
    var state = {}; // transcoder state of previous run
    var accumulator = "";

    function read(max) {
        max = Math.min(max, length);
        if (state.error) {
            state = {};
            stop = 0;
            throw new Error(state.error);
        }
        // get more bytes
        stop += raw.readInto(source, stop);
        if (stop === 0)
            return undefined;
        state = transcoder.transcode(
            source,
            target,
            0, stop, // source
            0, max // target
        );
        // shift the unused bytes to the beginning
        // of the buffer
        source.range(state.source, stop).copy(source);
        stop = stop - state.source;
        return target.range(0, state.target).toString("UTF-8");
    }

    self.read = function (max) {
        if (max === undefined)
            return self.readAll();
        else
            return self.readMax(max);
    };

    self.readMax = function (max) {
        if (accumulator.length) {
            var result = accumulator.slice(0, max);
            accumulator = accumulator.slice(max);
            return result;
        }
        while (true) {
            var chunk = read(max);
            if (chunk === undefined)
                return "";
            if (chunk.length)
                return chunk;
        }
    };

    self.readAll = function () {
        var chunks = [accumulator];
        accumulator = "";
        while (true) {
            var chunk = read();
            if (chunk === undefined)
                break;
            chunks.push(chunk);
        }
        return chunks.join('');
    };

    self.readLine = function () {
        while (true) {
            var chunk = read();
            if (chunk === undefined)
                break;
            accumulator += chunk;
            var pos = accumulator.indexOf("\n");
            if (pos >= 0) {
                var result = accumulator.slice(0, pos + 1);
                accumulator = accumulator.slice(pos + 1);
                return result;
            }
        }
        return accumulator;
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

// accepts bytes, writes chars
exports.EncoderWriter = function (stream, soruce, target) {
    throw new Error("NYI");

    var self = Object.create(exports.EncoderReader.prototype);
    var transcoder = new Transcoder(source, target);

    self.write = function () {
        throw new Error("NYI");
    };

    self.writeFrom = function () {
        throw new Error("NYI");
    };

    self.flush = function () {
        throw new Error("NYI");
    };

    return Object.create(self);
};

// reads bytes, returns strings
exports.DecoderReader = function (stream, source, target) {
    throw new Error("NYI");

    var self = Object.create(exports.EncoderReader.prototype);
    var transcoder = new Transcoder(source, target);

    self.read = function () {
        throw new Error("NYI");
    };

    self.readInto = function () {
        throw new Error("NYI");
    };

    return Object.create(self);
};

// accepts bytes, writes strings
exports.DecoderWriter = function (stream, source, target) {
    throw new Error("NYI");

    var self = Object.create(exports.EncoderReader.prototype);
    var transcoder = new Transcoder(source, target);

    self.write = function () {
        throw new Error("NYI");
    };

    self.writeFrom = function () {
        throw new Error("NYI");
    };

    self.print = function () {
        throw new Error("NYI");
    };

    self.flush = function () {
        throw new Error("NYI");
    };

    return Object.create(self);
};

exports.TranscoderReader = function (source, target) {
    throw new Error("NYI");

    var self = Object.create(exports.EncoderReader.prototype);
    var transcoder = new Transcoder(source, target);

    self.read = function () {
        throw new Error("NYI");
    };

    self.readInto = function () {
        throw new Error("NYI");
    };

    self.write = function () {
        throw new Error("NYI");
    };

    self.writeFrom = function () {
        throw new Error("NYI");
    };

    self.flush = function () {
        throw new Error("NYI");
    };

    return Object.create(self);
};

exports.TranscoderWriter = function (source, target) {
    throw new Error("NYI");

    var self = Object.create(exports.EncoderReader.prototype);
    var transcoder = new Transcoder(source, target);

    self.read = function () {
        throw new Error("NYI");
    };

    self.readInto = function () {
        throw new Error("NYI");
    };

    self.write = function () {
        throw new Error("NYI");
    };

    self.writeFrom = function () {
        throw new Error("NYI");
    };

    self.flush = function () {
        throw new Error("NYI");
    };

    return Object.create(self);
};

