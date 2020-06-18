import {
  ok,
  err,
  isOk,
  isErr,
  wrapFn,
  unwrap,
  unwrapFn,
  drain,
  _,
  TResult,
  wrapAsyncFn,
  drainAsync,
} from "..";

class CustomError extends Error {}

const values = [true, "", null, undefined, 10] as const;
const errors = [new Error(), new TypeError(), new CustomError()] as const;

describe("TResult", () => {
  test("ok, err, isOk, isErr, unwrap, wrapFn, unwrapFn", () => {
    for (const value of values) {
      for (const error of errors) {
        const o = ok(value);
        const e = err(error);

        expect(o).toEqual({ kind: "Ok", value });
        expect(isOk(o)).toBeTruthy();
        expect(isErr(o)).toBeFalsy();

        expect(e).toEqual({ kind: "Err", error });
        expect(isOk(e)).toBeFalsy();
        expect(isErr(e)).toBeTruthy();

        expect(unwrap(o)).toEqual(value);
        expect(() => unwrap(e)).toThrowError(error);

        const fnOk = (): typeof value => value;
        const fnErr = (): never => {
          throw error;
        };

        const wrappedFnOk = wrapFn(fnOk);
        const wrappedFnErr = wrapFn(fnErr);

        expect(wrappedFnOk()).toEqual(o);
        expect(wrappedFnErr()).toEqual(e);

        const unwrappedWrappedFnOk = unwrapFn(wrappedFnOk);
        const unwrappedWrappedFnErr = unwrapFn(wrappedFnErr);

        expect(unwrappedWrappedFnOk()).toEqual(value);
        expect(() => unwrappedWrappedFnErr()).toThrowError(error);
      }
    }
  });
});

describe("_", () => {
  test("Ok, Err, wrapFn, unwrapFn, mapOk, mapErr", () => {
    for (const value of values) {
      for (const error of errors) {
        const result0 = ok(0);
        const result1 = ok(1);
        const o = _.Ok(value);
        const e = _.Err(error);

        expect(o.result).toEqual({
          kind: "Ok",
          value,
        });

        expect(e.result).toEqual({
          kind: "Err",
          error,
        });

        const fnOk = _.wrapFn(() => value);
        const fnErr = _.wrapFn(() => {
          throw error;
        });

        expect(fnOk().result).toEqual(o.result);
        expect(fnErr().result).toEqual(e.result);

        const unwrappedWrappedFnOk = _.unwrapFn(fnOk);
        const unwrappedWrappedFnErr = _.unwrapFn(fnErr);

        expect(unwrappedWrappedFnOk()).toEqual(value);
        expect(() => unwrappedWrappedFnErr()).toThrowError(error);

        expect(
          o.unwrapMapOk(() => result0).unwrapMapErr(() => result1).result,
        ).toEqual(result0);

        expect(
          e
            .unwrapMapOk(() => result0)
            .unwrapMapErr(() => result1)
            .unwrap(),
        ).toEqual(result1.value);
      }
    }

    expect(
      _.Ok(1)
        .unwrapMapOk((n) => ok(n + 1))
        .unwrapMapErr(() => ok(0))
        .mapOk((n) => 2 * n)
        .unwrapMapOk((n) => ok(n + 1))
        .unwrap(),
    ).toEqual(5);

    expect(
      _.Ok(1)
        .mapOk(() => {
          throw errors[0];
        })
        .mapOk((n) => 2 * n)
        .mapErr(() => 12)
        .unwrap(),
    ).toEqual(12);

    expect(() =>
      _.Ok(1)
        .mapOk(() => {
          throw errors[1];
        })
        .unwrap(),
    ).toThrowError(errors[1]);

    expect(
      _.Ok(3)
        .mapOk((n) => "abc".repeat(n))
        .mapOk((s) => s.toUpperCase())
        .unwrap(),
    ).toEqual("ABCABCABC");

    expect(
      _.wrap(() => {
        return 3;
      })
        .mapOk((n) => 2 * n)
        .unwrap(),
    ).toEqual(6);

    expect(
      _.wrap(() => {
        throw errors[1];
      })
        .mapOk(() => 1)
        .mapErr(() => 0)
        .mapOk((n) => n + 1)
        .unwrap(),
    ).toEqual(1);

    expect(
      [1, 2, 5, 6, null, 0]
        .map(_.Ok)
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
        .filter(isOk)
        .map((r) => r.value),
    ).toEqual([4, 12, 0]);
  });
});

describe("Generator", () => {
  test("drain, _.drain", () => {
    const divide = wrapFn((p: number, q: number) => {
      if (q === 0) {
        throw new Error("divide by zero");
      }
      return p / q;
    });

    function* g(
      a: number,
      b: number,
      c: number,
    ): Generator<TResult<unknown, unknown>, unknown, number> {
      const x = yield divide(a, b);
      const y = yield divide(x, c);
      return y;
    }

    function* h(
      a: number,
      b: number,
      c: number,
      d: number,
    ): Generator<TResult<unknown, unknown>, unknown, number> {
      const x = yield drain(g(a, b, c));
      const y = yield drain(
        (function* () {
          return yield divide(x, d);
        })(),
      );
      return y;
    }

    const i = drain(g(1, 3, 0));

    expect(i.kind).toEqual("Err");

    const j = drain(g(1, 0, 5));
    expect(j.kind).toEqual("Err");

    const k = unwrap(drain(g(10, 5, 2)));
    expect(k).toEqual(1);

    expect(unwrap(drain(h(100, 5, 5, 2)))).toEqual(2);

    expect(
      _.drain(
        (function* (): Generator<TResult<number, unknown>, number, number> {
          const x = yield divide(4, 2);
          return x;
        })(),
      )
        .mapOk((n) => n * 10)
        .unwrap(),
    ).toEqual(20);

    expect(
      _.drain(
        (function* (): Generator<TResult<number, unknown>, number, number> {
          const x = yield divide(4, 0);
          return x;
        })(),
      ).mapOk((n) => n * 10).unwrap,
    ).toThrow();
  });

  test("drainAsync, _.drainAsync", async () => {
    const divideAsync = wrapAsyncFn(async (p: number, q: number) => {
      if (q === 0) {
        throw new Error("divide by zero");
      }
      return p / q;
    });

    async function* g(
      a: number,
      b: number,
      c: number,
    ): AsyncGenerator<TResult<unknown, unknown>, unknown, number> {
      const x = yield divideAsync(a, b);
      const y = yield divideAsync(x, c);
      return y;
    }

    async function* h(
      a: number,
      b: number,
      c: number,
      d: number,
    ): AsyncGenerator<TResult<unknown, unknown>, unknown, number> {
      const x = yield drainAsync(g(a, b, c));
      const y = yield drainAsync(
        (async function* () {
          return yield divideAsync(x, d);
        })(),
      );
      return y;
    }

    const i = await drainAsync(g(1, 3, 0));

    expect(i.kind).toEqual("Err");

    const j = await drainAsync(g(1, 0, 5));
    expect(j.kind).toEqual("Err");

    const k = unwrap(await drainAsync(g(10, 5, 2)));
    expect(k).toEqual(1);

    expect(unwrap(await drainAsync(h(100, 5, 5, 2)))).toEqual(2);

    expect(
      (
        await _.drainAsync(
          (async function* (): AsyncGenerator<
            TResult<number, unknown>,
            number,
            number
          > {
            const x = yield divideAsync(4, 2);
            return x;
          })(),
        )
      )
        .mapOk((n) => n * 10)
        .unwrap(),
    ).toEqual(20);

    expect(
      (
        await _.drainAsync(
          (async function* (): AsyncGenerator<
            TResult<number, unknown>,
            number,
            number
          > {
            const x = yield divideAsync(4, 0);
            return x;
          })(),
        )
      ).mapOk((n) => n * 10).unwrap,
    ).toThrow();
  });
});

export {};
