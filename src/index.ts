export type TOk<T> = {
  readonly kind: "Ok";
  readonly value: T;
};

export type TErr<E> = {
  readonly kind: "Err";
  readonly error: E;
};

export type TResult<T, E> = TOk<T> | TErr<E>;

export const ok = <T>(value: T): TOk<T> => ({
  kind: "Ok",
  value,
});

export const err = <E>(error: E): TErr<E> => ({
  kind: "Err",
  error,
});

export const isOk = <T, E>(result: TResult<T, E>): result is TOk<T> =>
  result.kind === "Ok";

export const isErr = <T, E>(result: TResult<T, E>): result is TErr<E> =>
  result.kind === "Err";

export const unwrap = <T, E>(result: TResult<T, E>): T | never => {
  if (result.kind === "Ok") {
    return result.value;
  }
  throw result.error;
};

export const drain = <T, E, TReturn>(
  iter: Iterator<TResult<T, E> | _<T, E>, TReturn, T>,
): TResult<TReturn, E> => {
  let next = iter.next();
  while (!next.done) {
    const res = next.value instanceof _ ? next.value.result : next.value;
    if (isOk(res)) {
      next = iter.next(res.value);
    } else {
      if (iter.return) {
        iter.return();
      } else if (iter.throw) {
        iter.throw();
      }
      return err(res.error);
    }
  }
  return ok(next.value);
};

export const drainAsync = async <T, E, TReturn>(
  iter: AsyncIterator<TResult<T, E> | _<T, E>, TReturn, T>,
): Promise<TResult<TReturn, E>> => {
  let next = await iter.next();
  while (!next.done) {
    const res = next.value instanceof _ ? next.value.result : next.value;
    if (isOk(res)) {
      next = await iter.next(res.value);
    } else {
      if (iter.return) {
        iter.return();
      } else if (iter.throw) {
        iter.throw();
      }
      return err(res.error);
    }
  }
  return ok(next.value);
};

export const wrapFn = <T, X1 = void, X2 = void, X3 = void, X4 = void>(
  fn: (x1: X1, x2: X2, x3: X3, x4: X4) => T,
): ((x1: X1, x2: X2, x3: X3, x4: X4) => TResult<T, unknown>) => (
  x1: X1,
  x2: X2,
  x3: X3,
  x4: X4,
) => {
  try {
    const value = fn(x1, x2, x3, x4);
    return {
      kind: "Ok",
      value,
    };
  } catch (error) {
    return {
      kind: "Err",
      error,
    };
  }
};

export const wrapAsyncFn = <T, X1 = void, X2 = void, X3 = void, X4 = void>(
  fn: (x1: X1, x2: X2, x3: X3, x4: X4) => Promise<T>,
): ((x1: X1, x2: X2, x3: X3, x4: X4) => Promise<TResult<T, unknown>>) => async (
  x1,
  x2,
  x3,
  x4,
) => {
  try {
    return ok(await fn(x1, x2, x3, x4));
  } catch (error) {
    return err(error);
  }
};

export const unwrapFn = <T, E, X1 = void, X2 = void, X3 = void, X4 = void>(
  fn: (x1: X1, x2: X2, x3: X3, x4: X4) => TResult<T, E>,
): ((x1: X1, x2: X2, x3: X3, x4: X4) => T | never) => (
  x1: X1,
  x2: X2,
  x3: X3,
  x4: X4,
) => unwrap(fn(x1, x2, x3, x4));

export class _<T, E> {
  public readonly result: TResult<T, E>;

  public static Ok = <T, E>(value: T): _<T, E> => new _({ kind: "Ok", value });

  public static Err = <T, E>(error: E): _<T, E> =>
    new _({ kind: "Err", error });

  public static wrap = <T>(fn: () => T): _<T, unknown> => _.wrapFn(fn)();

  public static wrapFn = <T, X1 = void, X2 = void, X3 = void, X4 = void>(
    fn: (x1: X1, x2: X2, x3: X3, x4: X4) => T,
  ): ((x1: X1, x2: X2, x3: X3, x4: X4) => _<T, unknown>) => (
    x1: X1,
    x2: X2,
    x3: X3,
    x4: X4,
  ) => {
    try {
      return _.Ok(fn(x1, x2, x3, x4));
    } catch (error) {
      return _.Err(error);
    }
  };

  public static unwrapFn = <T, E, X1 = void, X2 = void, X3 = void, X4 = void>(
    fn: (x1: X1, x2: X2, x3: X3, x4: X4) => _<T, E>,
  ): ((x1: X1, x2: X2, x3: X3, x4: X4) => T | never) => (
    x1: X1,
    x2: X2,
    x3: X3,
    x4: X4,
  ) => {
    const next = fn(x1, x2, x3, x4);
    if (isOk(next.result)) {
      return next.result.value;
    }
    throw next.result.error;
  };

  public static drain = <T, E, TReturn>(
    iter: Iterator<TResult<T, E> | _<T, E>, TReturn, T>,
  ): _<TReturn, E> => {
    const res = drain(iter);
    if (isOk(res)) {
      return _.Ok(res.value);
    }
    return _.Err(res.error);
  };

  public static drainAsync = async <T, E, TReturn>(
    iter: AsyncIterator<TResult<T, E> | _<T, E>, TReturn, T>,
  ): Promise<_<TReturn, E>> => {
    const res = await drainAsync(iter);
    if (isOk(res)) {
      return _.Ok(res.value);
    }
    return _.Err(res.error);
  };

  private constructor(result: TResult<T, E>) {
    this.result = result;
  }

  public readonly unwrapMapOk = <S, F>(
    fn: (value: T) => TResult<S, F>,
  ): _<S, E | F> => {
    if (isErr(this.result)) {
      return _.Err(this.result.error);
    }
    const result = fn(this.result.value);
    if (result.kind === "Err") {
      return _.Err(result.error);
    }
    return _.Ok(result.value);
  };

  public readonly mapOk = <S>(fn: (value: T) => S): _<S, unknown> =>
    this.unwrapMapOk(wrapFn(fn) as (value: T) => TResult<S, unknown>);

  public readonly unwrapMapErr = <S, F>(
    fn: (error: E) => TResult<S, F>,
  ): _<S | T, F> => {
    if (isOk(this.result)) {
      return _.Ok(this.result.value);
    }
    const result = fn(this.result.error);
    if (result.kind === "Err") {
      return _.Err(result.error);
    }
    return _.Ok(result.value);
  };

  public readonly mapErr = <S>(fn: (error: E) => S): _<S | T, unknown> =>
    this.unwrapMapErr((v) => wrapFn(fn)(v));

  public readonly unwrap = (): T | never => {
    if (this.result.kind === "Ok") {
      return this.result.value;
    }
    throw this.result.error;
  };
}
