var Source = require("source-stream")
    , Delta = require("./interfaces/delta")

DeltaStream.fromDelta = Delta.createStream
DeltaStream.Delta = Delta

module.exports = DeltaStream

function DeltaStream(id) {
    var stream = Source()
        , delta

    stream.createDelta = returnDelta

    return stream

    function returnDelta() {
        if (!delta) {
            delta = Delta(stream)
        }

        return delta
    }
}