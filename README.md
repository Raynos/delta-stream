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

## Docs
 
### `delta.set`

`delta.set` sets a key value pair on a delta

```
var delta = Delta()

delta.set("foo", "bar")

assert.equal(delta.get("foo"), "bar")
```

If you set a value to undefined it will be deleted from the internal state 
object.

### `delta.get`

`delta.get` get's a value by it's key

```
var delta = Delta()

delta.set("foo", "bar")

assert.equal(delta.get("foo"), "bar")
```

### `delta.has`

`delta.has` returns true or false based on whether the the key is set

```
var delta = Delta()

assert.equal(delta.has("foo"), false)
```

### `delta.delete`

`delta.delete` deletes the value attached to a key. Internally this is the 
same as setting a value to `undefined`.

```
var delta = Delta()

delta.set("foo", "bar")
delta.delete("foo")

assert.equal(delta.has("foo"), false)
```

### `delta.toJSON`

Returns the entire internal state as an object

### `delta.createStream`

Create a scuttlebutt stream of the delta. See [scuttlebutt][7]

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
  [7]: https://github.com/dominictarr/scuttlebutt