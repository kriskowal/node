
if (typeof setTimeout !== "undefined") {

    exports.enqueue = function (task) {
        setTimeout(task, 0);
    };

    exports.setTimeout = setTimeout;
    exports.clearTimeout = clearTimeout;
    exports.setInterval = setInterval;
    exports.clearInterval = clearInterval;

} else {

    var EL = require("narwhal/event-loop-engine");

    exports.enqueue = function (task) {
        EL.setTimeout(task, 0);
    };

    exports.setTimeout = EL.setTimeout;
    exports.clearTimeout = EL.clearTimeout;
    exports.setInterval = EL.setInterval;
    exports.clearInterval = EL.clearInterval;

}


