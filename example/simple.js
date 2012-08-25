var DeltaStream = require("../index")

var stream1 = DeltaStream()
    , stream2 = DeltaStream()

var observable1 = stream1.createObservable()
    , observable2 = stream2.createObservable()

observable1.on("change", function (changes) {
    console.log("[CHANGE]", changes)
})

observable2.on("change:foo", function (value) {
    console.log("[CHANGE:FOO]", value)
})

stream2.pipe(stream1).pipe(stream2)

observable1.set("foo", "bar")
observable2.set("other", "thing")