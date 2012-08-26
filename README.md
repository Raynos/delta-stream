# delta-stream

Emit deltas in change over a stream

## Example

Create streams that emit deltas in changes. Then create reprensentations of deltas as other objects which are connected to the underlying streams.

``` js
var DeltaStream = require("delta-stream")

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
```

## Diagram

![Diagram][1]

## Compatible modules

 - [databind][2]
 - [arrow-keys][3]
 - [attribute][4]

### Compatible minus one issue

 - [crdt][5]
 - [sorta][6]

## Installation

`npm install delta-stream`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://lh6.googleusercontent.com/-OXMjXDcB6VM/UDltmdpD5pI/AAAAAAAAAIw/CEIrnD6k3v8/s408/12+-+1
  [2]: https://github.com/Raynos/databind
  [3]: https://github.com/Raynos/arrow-keys
  [4]: https://github.com/Raynos/attribute
  [5]: https://github.com/dominictarr/crdt/pull/2
  [6]: https://github.com/substack/sorta/issues/1