# `typed-result`

`typed-result` is a typesafe implementation in idiomatic TypeScript liberally adapted from its [Rust counterpart](https://doc.rust-lang.org/std/result/) and without external dependencies.

It is useful to safely handle code that can potentially fail.

See the full [documentation](doc/API.md).

### Install

```npm install typed-result```

or

```yarn add typed-result```

### Why is it useful?

`typed-result` promotes handling errors in a declarative way instead of with exceptions. It is an alternative to `try/catch` blocks, with a syntax closer to `Promise` and `async/await` (using generators).

### Usage

#### Basics
`typed-result` provides wrapper/unwrappers to convert exception-style control flow to result-style control flow:

```ts
ok(1); // { kind: "Ok", value: 1 }
err(new Error()); // { kind: "Err", error: Error }

const divide = wrapFn((a: number, b: number) => {
  if(b === 0) {
    throw new Error("divide by 0");
  }
  return a / b;
});

divide(4, 2); // { kind: "Ok", value: 2 }
divide(1, 0); // { kind: Err", error: Error("divide by 0") }

isOk(divide(4, 2)); // true
isErr(divide(1, 0)); // false

unwrap(divide(4, 2)); // 2
unwrap(divide(1, 0)); // throws

unwrapFn(divide)(4, 2); // 2
unwrapFn(divide)(1, 0); // throws
```

#### Chainable container

A special class, `_`, is available as a wrapper to chain operations:

```ts
const divide = _.wrapFn((a: number, b: number) => {
  if(b === 0) {
    throw new Error("divide by 0");
  }
  return a / b;
});

divde(4, 2) // _.Ok(2)
  .mapOk(v => v * 3) // _.Ok(6)
  .mapErr(() => {
    throw new Error("unknown error");
  }) // _.Ok(6) (no-op)
  .mapOk(v => v + 2) // _.Ok(8)
  .unwrap(); // 6

divde(1, 0) // _.Err()
  .mapOk(v => v * 3) // _.Err() (no-op)
  .mapErr(() => {
    throw new Error("unknown error");
  }) // _.Err(Error("unknown error"))
  .mapOk(v => v + 2) // _.Err() (no-op)
  .unwrap(); // throws

divide(1, 0)
  .mapErr(() => {
    throw new Error("unknown error")
  }) // _.Err(Error("unknown error"))
  .unwrap(); // throws

```

#### Generators

To simplify the code flow, it is possible to use an `async-await`-like syntax to `yield` results and wrapped results:

```ts
unwrap(drain(function*() {
  const x = yield divide(100, 5); // 20
  const y = yield divide(x, 4); // 5
  return y + 1; // 6
})); // 6

unwrap(drain(function*() {
  const x  = yield divide(100, 5); // 20
  const y = yield divide(x, x - 20); // throws
  return y; // not reached
})); // throws

_.drain(function*() {  
  const x = yield divide(100, 5); // 20
  const y = yield divide(x, 4); // 5
  return y + 1; // 6
})
  .mapOk(n => n * 2)
  .unwrap(); // 12

_.drain(function*() {  
  const x = yield divide(100, 5); // 20
  const y = yield divide(x, x - 20); // throws
  return y; // not reached
})
  .mapOk(n => n * 2) // not called
  .mapErr(() => null) // _.Ok(null)
  .unwrap(); // null
```

#### Async and Promises

Some basic utilities are also provided to work with Promises / async-await - since it is very common to have async operations that may fail:

```ts
const fetchAndDivide = wrapAsyncFn(async (urlA: string, urlB: string) => {
  const [a, b] = await Promise.all([
    fetch(urlA).then(r => r.json()),
    fetch(urlB).then(r => r.json()),
  ]);
  if(b === 0) {
    throw new Error();
  }
  return a / b;
});

unwrap(await fetchAndDivide("/api/a", "/api/b"));
```

Async versions of `drain` and `_.drain` are also available, and they are very handy in this case:

```ts
await drainAsync(async function*() {
  const x = await yield fetchAndDivide("/api/a", "/api/b");
  const y = yield divide(x, 5);
  return y;
}).then(unwrap);

(await _.drainAsync(async function* () {
  const x = await yield fetchAndDivide("/api/a", "/api/b");
  const y = yield divide(x, 5);
  return y;
}))
  .mapOk(...)
  .mapErr(...)
  .unwrap();
```

#### Working with collections

Working with collections require no special utilities. Array and Result compose very well:

```ts
[1, 2, 5, 6, null, 0]
  .map(_.Ok) // [_.Ok(1), _.Ok(2), ...]
  .map(
    (r) =>
      r
        .mapOk((v) => {
          if (typeof v !== "number") {
            throw new TypeError();
          }
          return v;
        })
        .mapOk((v) => {
          if (v % 2 !== 0) {
            throw new Error();
          }
          return v;
        })
        .mapOk((v) => 2 * v).result,
  )
  .filter(isOk) // [_.Err(), _.Ok(4), _.Err(), _.Ok(12), ...]
  .map((r) => r.value) // [4, 12, 0]
```

### Has it anything to do with "monads"?

Yes. No. Kind of. Maybe. Who cares?