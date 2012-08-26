var DeltaStream = require("../index")
    , uuid = require("node-uuid")
    , EventEmitter = require("events").EventEmitter

Delta.from = createStream

module.exports = Delta

function Delta(stream) {
    var delta = new EventEmitter()
        , state = {}

    delta.set = set
    delta.get = get
    delta.toJSON = toJSON
    delta.createStream = returnStream
    delta.sync = sync

    if (stream) {
        delta.id = stream.id
        bind(delta, stream)
    } else {
        delta.id = uuid()
        stream = createStream(delta)
    }

    return delta

    function set(key, value, source) {
        var changes = {}

        state[key] = value
        changes[key] = value

        delta.emit("change", changes, source)
        delta.emit("change:" + key, value)
    }

    function get(key) {
        if (key) {
            return state[key]
        }

        return state
    }

    function toJSON() {
        return state
    }

    function sync(other) {
        Object.keys(state).forEach(callSet)

        function callSet(key) {
            other.set(key, state[key])
        }
    }

    function returnStream() {
        return stream
    }
}

function createStream(delta) {
    var stream = DeltaStream(delta.id)

    bind(delta, stream)

    return stream
}

function bind(delta, stream) {
    delta.on("change", onchange)

    stream.other.on("data", ondata)

    function ondata(data) {
        var changes = data[0]
            , source = data[2]

        Object.keys(changes).forEach(applyChanges)

        function applyChanges(key) {
            var value = changes[key]
            delta.set(key, value, source)
        }
    }

    function onchange(changes, source) {
        var ts = Date.now()
            , data = [changes, ts, source]

        stream.other.write(data)
    }
}