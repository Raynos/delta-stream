# delta-stream

Emit deltas in change over a stream

## Data protocol

`[key, value, sourceIdentifier, timestamp]`

A delta-stream emits an array, where the first value is the key that has changed and the second value is the new value. This represents the delta in change on the object.

The third value is a source identifier. It's used to identify who created this delta

The fourth value is a time stamp which can be used for clever synchronization. 

## Example

Create deltas that handle changes in state. Then create stream reprensentations of deltas

``` js
var Delta = require("delta-stream")

var delta1 = Delta()
    , delta2 = Delta()

var stream1 = delta1.createStream()
    , stream2 = delta2.createStream()

delta1.on("change:delta1", function (value) {
    console.log("[CHANGE:DELTA1]", value)
})

delta2.on("change:delta2", function (value) {
    console.log("[CHANGE:DELTA2]", value)
})

stream1.pipe(stream2).pipe(stream1)

delta1.set("delta2", "hello")
delta2.set("delta1", "world")
```

## Almost Compatible modules [NEED TO BE REFACTORED]

 - [text-node][2]
 - [arrow-keys][3]
 - [attribute][4]
 - [form-stream][6]

## Installation

`npm install delta-stream`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://lh6.googleusercontent.com/-OXMjXDcB6VM/UDltmdpD5pI/AAAAAAAAAIw/CEIrnD6k3v8/s408/12+-+1
  [2]: https://github.com/Raynos/text-node
  [3]: https://github.com/Raynos/arrow-keys
  [4]: https://github.com/Raynos/attribute
  [6]: https://github.com/Raynos/form-stream