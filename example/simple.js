var Delta = require("../index")
    , json = require("stream-serializer").json
    , net = require("net")
    , log = require("event-stream").log

var server = net.createServer(function listen(stream) {
    var delta = Delta()
        , networkStream = delta.createStream()

    delta.on("change:local", function (value) {
        console.log("[CHANGE:LOCAL]", value)
    })

    delta.set("remote", "local")

    stream.pipe(json(networkStream)).pipe(stream)

    setTimeout(function () {
        stream.end()
        server.close()
    }, 500)
}).listen(12503, function connect() {
    var stream = net.connect(12503)

    var delta1 = Delta()
        , delta2 = Delta()

    var stream1 = delta1.createStream()
        , stream2 = delta2.createStream()

    stream1.pipe(stream2).pipe(stream1)

    delta1.on("change:delta1", function (value) {
        console.log("[CHANGE:DELTA1]", value)
    })

    delta2.on("change:delta2", function (value) {
        console.log("[CHANGE:DELTA2]", value)
    })

    delta1.set("delta2", "hello")
    delta2.set("delta1", "world")

    delta1.on("change:remote", function (value) {
        console.log("[CHANGE:REMOTE]", value)
    })

    delta1.set("local", "remote")

    // This is scuttlebutt stream
    var networkStream = delta1.createStream()
    stream.pipe(json(networkStream)).pipe(stream)
})