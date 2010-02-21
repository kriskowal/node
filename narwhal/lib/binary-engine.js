
var Buffer = require("node/buffer").Buffer;

exports.B_LENGTH = function (bytes) {
    return bytes.length;
};

exports.B_ALLOC = function (length) {
    return new Buffer(length);
};

exports.B_FILL = function(bytes, length, offset, value) {
    offset = Number(offset || 0);
    length = Number(length === undefined ? bytes.length : length);
    value = Number(value || 0);
    for (; offset < length; i++) {
        bytes[offset] = value;
    }
};

exports.B_COPY = function(src, srcOffset, dst, dstOffset, length) {
    srcOffset = Number(srcOffset || 0);
    dstOffset = Number(dstOffset || 0);
    length = length === undefined ?
        Math.min(
            src.length - srcOffset,
            dst.length - dstOffset
        ) :
        Number(length);
    for (var i = 0; i < length; i++, srcOffset++, dstOffset++) {
        dst[dstOffset] = src[srcOffset];
    }
};

exports.B_GET = function(bytes, index) {
    return bytes[index];
};

exports.B_SET = function(bytes, index, value) {
    bytes[index] = value;
};

exports.B_DECODE = function(bytes, offset, length, charset) {
    length = Number(length === undefined ? bytes.length : length);
    if (/^utf-?8$/i.test(charset)) {
        return bytes.utf8Slice(offset, length);
    } else if (/^(us-)?ascii$/i.test(charset)) {
        bytes = bytes.asciiRange(offset, length);
        var copy = new Buffer(bytes.length);
        exports.B_COPY(bytes, undefined, copy);
        return copy;
    } else {
        throw new Error("Charset not supported: " + charset);
    }
};

exports.B_DECODE_DEFAULT = function(bytes, offset, length) {
    return bytes.utf8Slice(offset, length);
};

exports.B_ENCODE = function(string, charset) {
    var buffer = new Buffer(string.length * 4);
    var length;
    if (/^utf-?8$/i.test(charset)) {
        length = buffer.utf8Write(string);
    } else if (/^(us-)?ascii$/i.test(charset)) {
        length = buffer.asciiWrite(string);
    } else {
        throw new Error("Charset not supported: " + charset);
    }
    var actual = new Buffer(length);
    exports.B_COPY(buffer, undefined, actual);
    return actual.range(0, length);
};

exports.B_ENCODE_DEFAULT = function(string) {
    return exports.B_ENCODE(string, 'utf-8');
};

exports.B_TRANSCODE = function(bytes, offset, length, sourceCharset, targetCharset) {
    var raw = exports.B_DECODE(bytes, offset, length, sourceCharset);
    return exports.B_ENCODE(bytes, 0, raw.length, targetCharset);
};

