var DeltaStream = require("../index")

var stream1 = DeltaStream()
    , stream2 = DeltaStream()

var delta1 = stream1.createDelta()
    , delta2 = stream2.createDelta()

delta1.on("change:other", function (changes) {
    console.log("[CHANGE:OTHER]", changes)
})

delta2.on("change:foo", function (value) {
    console.log("[CHANGE:FOO]", value)
})

stream2.pipe(stream1).pipe(stream2)

delta1.set("foo", "bar")
delta2.set("other", "thing")