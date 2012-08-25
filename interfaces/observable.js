var DeltaStream = require("../index")
    , uuid = require("node-uuid")
    , EventEmitter = require("events").EventEmitter

Observable.from = createStream

module.exports = Observable

function Observable(stream) {
    var observable = new EventEmitter()
        , state = {}

    observable.set = set
    observable.get = get
    observable.toJSON = toJSON
    observable.createStream = createStream
    observable.sync = sync

    if (stream) {
        observable.id = stream.id
        bind(observable, stream)
    } else {
        observable.id = uuid()
    }

    return observable

    function set(key, value, source) {
        var changes = {}

        state[key] = value
        changes[key] = value

        observable.emit("change", changes, source)
        observable.emit("change:" + key, value)
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

}

function createStream(observable) {
    var stream = DeltaStream(observable.id)

    bind(observable, stream)

    return stream
}

function bind(observable, stream) {
    observable.on("change", onchange)

    stream.other.on("data", ondata)

    function ondata(data) {
        var changes = data[0]
            , source = data[2]

        Object.keys(changes).forEach(applyChanges)

        function applyChanges(key) {
            var value = changes[key]
            observable.set(key, value, source)
        }
    }

    function onchange(changes, source) {
        var ts = Date.now()
            , data = [changes, ts, source]

        stream.other.write(data)
    }
}