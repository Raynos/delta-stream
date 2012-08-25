# delta-stream

Emit deltas in change over a stream

## Example

Create streams that emit deltas in changes. Then create reprensentations of deltas as other objects which are connected to the underlying streams.

``` js
var DeltaStream = require("../index")

var stream1 = DeltaStream()
    , stream2 = DeltaStream()

var observable1 = stream1.createObservable()
    , observable2 = stream2.createObservable()

observable1.on("change", function (changes) {
    // foo, bar
    // other, thing
    console.log("[CHANGE]", changes)
})

observable2.on("change:foo", function (value) {
    // bar
    console.log("[CHANGE:FOO]", value)
})

stream2.pipe(stream1).pipe(stream2)

observable1.set("foo", "bar")
observable2.set("other", "thing")
```

## Installation

`npm install delta-stream`

## Contributors

 - Raynos

## MIT Licenced