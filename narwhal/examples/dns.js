
var DNS = require("narwhal/q-dns");
var Q = require("narwhal/promise");
var SYS = require("sys");
Q.when(DNS.getHostByName("localhost"), function (domains) {
    SYS.puts("ok: " + JSON.stringify(domains));
}, function (reason) {
    SYS.puts("failed: " + reason);
});

