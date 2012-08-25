var invert = require("invert-stream")
    , uuid = require("node-uuid")
    , partial = require("ap").partial

var Observable = require("./interfaces/observable")

DeltaStream.fromObservable = Observable.from

module.exports = DeltaStream

function DeltaStream(id) {
    var stream = invert()
    stream.id = id || uuid()

    stream.createObservable = partial(Observable, stream)

    return stream
}