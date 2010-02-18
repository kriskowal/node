(function (modules) {

    // -- kriskowal Kris Kowal Copyright (C) 2009-2010 MIT License

    // This file is an anonymous function expression.  The file is executed in
    // node_narwhal.cc to produce a Function.  The function is called in
    // node_narwhal.cc with a module memo that has been "primed" with native
    // modules to avoid communicating dependencies through the transitive
    // globals.

    function main () {
        var text = fs.read(system.prefix + "/narwhal.js");
        var factory = process.compile(text, "narwhal.js", 1);
        factory(modules);
    }

    // module "system"
    (function (exports) {

        // exports.env = // node_narwhal.cc

        exports.global = this;
        exports.engine = "node";
        exports.engines = ["node", "v8", "default"];
        exports.debug = +exports.env["NARWHAL_DEBUG"];
        exports.verbose = +exports.env["NARWHAL_VERBOSE"];

        exports.os = "macosx";
        exports.enginePrefix = exports.env["NARWHAL_ENGINE_HOME"];
        exports.prefix = exports.env["NARWHAL_HOME"];
        exports.prefixes = [exports.prefix];

        exports.evaluate = function (text, fileName, lineNo) {
            var factory = function (inject) {
                var names = [];
                for (var name in inject)
                    if (Object.prototype.hasOwnProperty.call(inject, name))
                        names.push(name);
                return exports.compile(
                    Array(lineNo).join("\n") +
                    "(function(" + names.join(",") + "){" + text + "\n})",
                    fileName
                ).apply(null, names.map(function (name) {
                    return inject[name];
                }));
            };
            return factory;
        };

        exports.print = function () {
            modules['node/process'].stdio.writeError(
                Array.prototype.join.call(arguments, " ") + "\n"
            );
            return exports;
        };

    }).call(this, modules.system);

    // module "file"
    (function (exports) {
        var k = modules['node/process'];
        var fs = modules['node/fs'];

        exports.isFile = function (path) {
            try {
                return (fs.stat(path).mode & k.S_IFREG) === k.S_IFREG;
            } catch (e) {
                return false;
            }
        };

        exports.read = function (path) {
            try {
                var fd = fs.open(path, k.O_RDONLY, 0666);
            } catch (exception) {
                throw new Error("Failed to open " + path);
            }
            try {
                var chunks = [];
                var pos = 0;
                do {
                    var chunkPair = fs.read(fd, 1024, pos, "utf8");
                    var chunk = chunkPair[0];
                    if (chunk === null)
                        chunk = "";
                    chunks.push(chunk);
                    pos += chunkPair[1];
                } while (chunk.length);
                return chunks.join("");
            } finally {
                fs.close(fd);
            }
        };

    })(modules.file = {});

    var process = modules['node/process'];
    var fs = modules['file'];
    var system = modules['system'];

    main();

})
