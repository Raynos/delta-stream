var Scuttlebutt = require("scuttlebutt")
    , updateIsRecent = Scuttlebutt.updateIsRecent
    , EventEmitter = require("events").EventEmitter
    , iterators = require("iterators")
    , reduce = iterators.reduceSync
    , forEach = iterators.forEachSync

module.exports = Delta

/*
    Protocol is [key, value, source, timestamp]
*/
function Delta(id, silent) {
    var scutt = Scuttlebutt(id)
        , delta = new EventEmitter()
        , updates = {}
        , state = { id: (id = scutt.id) }
        , log = silent ? noop : error

    scutt.applyUpdate = applyUpdate
    // history is a global variable -.-
    scutt.history = $history

    delta.validate = validate
    delta.set = set
    delta.get = get
    delta.has = has
    // stupid tokens
    delta.delete = $delete
    delta.toJSON = toJSON
    delta.createStream = scutt.createStream.bind(scutt)

    return delta

    function applyUpdate(update) {
        var key = update[0]
            , value = update[1]
            , recentUpdate = updates[key]

        // If the most recent update for that key is newer then the incoming
        // update. Then ignore it
        if (recentUpdate && recentUpdate[2] > update[2]) {
            return
        }

        updates[key] = update

        if (value === undefined) {
            delete state[key]
        } else {
            state[key] = value
        }

        delta.emit("change", key, value)
        delta.emit("change:" + key, value)

        return true
    }

    function $history(sources) {
        return reduce(updates, isRecent, sources, []).sort(byTimestamp)
    }

    function validate(changes) {
        try {
            delta.emit("validate", changes)
            return true
        } catch (e) {
            log("[DELTA-STREAM]: validation", e.message, e)
            return false
        }
    }

    function set(key, value) {
        if (key === "id" && value !== id) {
            throw Error("id cannot be changed")
        }

        if (typeof key === "string") {
            scutt.localUpdate(key, value)
        } else {
            forEach(key, setKeyValue)
        }
    }

    function setKeyValue(value, key) {
        set(key, value)
    }

    function get(key) {
        return state[key]
    }

    function has(key) {
        return key in state
    }

    function $delete(key) {
        set(key, undefined)
    }

    function toJSON() {
        return state
    }
}

function isRecent(acc, update) {
    var sources = this

    if (updateIsRecent(update, sources)) {
        acc.push(update)
    }

    return acc
}

function byTimestamp(a, b) {
    return a[2] - b[2]
}

function noop() {}

function error() {
    console.error.apply(console, arguments)
}