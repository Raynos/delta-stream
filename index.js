var Source = require("source-stream")
    , Delta = require("./interfaces/delta")

DeltaStream.fromDelta = Delta.createStream
DeltaStream.Delta = Delta

module.exports = DeltaStream

function DeltaStream(id) {
    var stream = Source()
        , delta = Delta(stream)

    stream.createDelta = returnDelta

    return stream

    function returnDelta() {
        return delta
    }
}