var Scuttlebutt = require("scuttlebutt")
    , updateIsRecent = Scuttlebutt.updateIsRecent
    , reduce = require("iterators").reduceSync

module.exports = Delta

/*
    Protocol is [key, value, source, timestamp]
*/
function Delta(id) {
    var scutt = Scuttlebutt(id)
        , updates = {}
        , state = { id: scutt.id }

    scutt.applyUpdate = applyUpdate
    // history is a global variable -.-
    scutt.history = $history
    scutt.set = set
    scutt.get = get
    scutt.has = has
    // stupid tokens
    scutt.delete = $delete
    scutt.toJSON = toJSON

    return scutt

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

        scutt.emit("change", key, value)
        scutt.emit("change:" + key, value)

        return true
    }

    function $history(sources) {
        return reduce(updates, isRecent, sources, []).sort(byTimestamp)
    }

    function set(key, value) {
        if (key === "id" && value !== scutt.id) {
            throw Error("id cannot be changed")
        }

        scutt.localUpdate(key, value)
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
    return a[2] - b[2]
}