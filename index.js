var Scuttlebutt = require("scuttlebutt")
    , updateIsRecent = Scuttlebutt.updateIsRecent
    , reduce = require("iterators").reduceSync

module.exports = Delta

/*
    Protocol is [key, value, source, timestamp]
*/
function Delta() {
    var stream = Scuttlebutt()
        , localUpdate = stream.localUpdate.bind(stream)
        , updates = {}
        , state = {}

    stream.applyUpdate = applyUpdate
    // history is a global variable -.-
    stream.history = $history
    stream.set = localUpdate
    stream.get = get
    stream.has = has
    // stupid tokens
    stream.delete = $delete
    stream.toJSON = toJSON

    return stream

    function applyUpdate(update) {
        var key = update[0]
            , value = update[1]
            , recentUpdate = updates[key]

        // If the most recent update for that key is newer then the incoming
        // update. Then ignore it
        if (recentUpdate && recentUpdate[3] > update[3]) {
            return
        }

        updates[key] = update

        if (value === undefined) {
            delete state[key]
        } else {
            state[key] = value
        }

        stream.emit("change", key, value)
        stream.emit("change:" + key, value)

        return true
    }

    function $history(sources) {
        return reduce(updates, isRecent, sources, []).sort(byTimestamp)
    }

    function get(key) {
        return state[key]
    }

    function has(key) {
        return key in state
    }

    function $delete(key) {
        localUpdate(key, undefined)
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
    return a[3] - b[3]
}