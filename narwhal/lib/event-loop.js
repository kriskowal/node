
exports.enqueue = function (task) {
    setTimeout(task, 0);
};

exports.setTimeout = setTimeout;
exports.clearTimeout = clearTimeout;
exports.setInterval = setInterval;
exports.clearInterval = clearInterval;

