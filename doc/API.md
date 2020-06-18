[typed-result](README.md)

# typed-result

## Index

### Classes

* [_](classes/_.md)

### Type aliases

* [TErr](README.md#terr)
* [TOk](README.md#tok)
* [TResult](README.md#tresult)

### Functions

* [drain](README.md#const-drain)
* [drainAsync](README.md#const-drainasync)
* [err](README.md#const-err)
* [isErr](README.md#const-iserr)
* [isOk](README.md#const-isok)
* [ok](README.md#const-ok)
* [unwrap](README.md#const-unwrap)
* [unwrapFn](README.md#const-unwrapfn)
* [wrapAsyncFn](README.md#const-wrapasyncfn)
* [wrapFn](README.md#const-wrapfn)

## Type aliases

###  TErr

Ƭ **TErr**: *object*

*Defined in [index.ts:6](https://github.com/elierotenberg/typed-result/blob/master/src/index.ts#L6)*

#### Type declaration:

* **error**: *E*

* **kind**: *"Err"*

___

###  TOk

Ƭ **TOk**: *object*

*Defined in [index.ts:1](https://github.com/elierotenberg/typed-result/blob/master/src/index.ts#L1)*

#### Type declaration:

* **kind**: *"Ok"*

* **value**: *T*

___

###  TResult

Ƭ **TResult**: *[TOk](README.md#tok)‹T› | [TErr](README.md#terr)‹E›*

*Defined in [index.ts:11](https://github.com/elierotenberg/typed-result/blob/master/src/index.ts#L11)*

## Functions

### `Const` drain

▸ **drain**‹**T**, **E**, **TReturn**›(`iter`: Iterator‹[TResult](README.md#tresult)‹T, E› | [_](classes/_.md)‹T, E›, TReturn, T›): *[TResult](README.md#tresult)‹TReturn, E›*

*Defined in [index.ts:36](https://github.com/elierotenberg/typed-result/blob/master/src/index.ts#L36)*

**Type parameters:**

▪ **T**

▪ **E**

▪ **TReturn**

**Parameters:**

Name | Type |
------ | ------ |
`iter` | Iterator‹[TResult](README.md#tresult)‹T, E› &#124; [_](classes/_.md)‹T, E›, TReturn, T› |

**Returns:** *[TResult](README.md#tresult)‹TReturn, E›*

___

### `Const` drainAsync

▸ **drainAsync**‹**T**, **E**, **TReturn**›(`iter`: AsyncIterator‹[TResult](README.md#tresult)‹T, E› | [_](classes/_.md)‹T, E›, TReturn, T›): *Promise‹[TResult](README.md#tresult)‹TReturn, E››*

*Defined in [index.ts:56](https://github.com/elierotenberg/typed-result/blob/master/src/index.ts#L56)*

**Type parameters:**

▪ **T**

▪ **E**

▪ **TReturn**

**Parameters:**

Name | Type |
------ | ------ |
`iter` | AsyncIterator‹[TResult](README.md#tresult)‹T, E› &#124; [_](classes/_.md)‹T, E›, TReturn, T› |

**Returns:** *Promise‹[TResult](README.md#tresult)‹TReturn, E››*

___

### `Const` err

▸ **err**‹**E**›(`error`: E): *[TErr](README.md#terr)‹E›*

*Defined in [index.ts:18](https://github.com/elierotenberg/typed-result/blob/master/src/index.ts#L18)*

**Type parameters:**

▪ **E**

**Parameters:**

Name | Type |
------ | ------ |
`error` | E |

**Returns:** *[TErr](README.md#terr)‹E›*

___

### `Const` isErr

▸ **isErr**‹**T**, **E**›(`result`: [TResult](README.md#tresult)‹T, E›): *result is TErr<E>*

*Defined in [index.ts:26](https://github.com/elierotenberg/typed-result/blob/master/src/index.ts#L26)*

**Type parameters:**

▪ **T**

▪ **E**

**Parameters:**

Name | Type |
------ | ------ |
`result` | [TResult](README.md#tresult)‹T, E› |

**Returns:** *result is TErr<E>*

___

### `Const` isOk

▸ **isOk**‹**T**, **E**›(`result`: [TResult](README.md#tresult)‹T, E›): *result is TOk<T>*

*Defined in [index.ts:23](https://github.com/elierotenberg/typed-result/blob/master/src/index.ts#L23)*

**Type parameters:**

▪ **T**

▪ **E**

**Parameters:**

Name | Type |
------ | ------ |
`result` | [TResult](README.md#tresult)‹T, E› |

**Returns:** *result is TOk<T>*

___

### `Const` ok

▸ **ok**‹**T**›(`value`: T): *[TOk](README.md#tok)‹T›*

*Defined in [index.ts:13](https://github.com/elierotenberg/typed-result/blob/master/src/index.ts#L13)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |

**Returns:** *[TOk](README.md#tok)‹T›*

___

### `Const` unwrap

▸ **unwrap**‹**T**, **E**›(`result`: [TResult](README.md#tresult)‹T, E›): *T | never*

*Defined in [index.ts:29](https://github.com/elierotenberg/typed-result/blob/master/src/index.ts#L29)*

**Type parameters:**

▪ **T**

▪ **E**

**Parameters:**

Name | Type |
------ | ------ |
`result` | [TResult](README.md#tresult)‹T, E› |

**Returns:** *T | never*

___

### `Const` unwrapFn

▸ **unwrapFn**‹**T**, **E**, **X1**, **X2**, **X3**, **X4**›(`fn`: function): *function*

*Defined in [index.ts:113](https://github.com/elierotenberg/typed-result/blob/master/src/index.ts#L113)*

**Type parameters:**

▪ **T**

▪ **E**

▪ **X1**

▪ **X2**

▪ **X3**

▪ **X4**

**Parameters:**

▪ **fn**: *function*

▸ (`x1`: X1, `x2`: X2, `x3`: X3, `x4`: X4): *[TResult](README.md#tresult)‹T, E›*

**Parameters:**

Name | Type |
------ | ------ |
`x1` | X1 |
`x2` | X2 |
`x3` | X3 |
`x4` | X4 |

**Returns:** *function*

▸ (`x1`: X1, `x2`: X2, `x3`: X3, `x4`: X4): *T | never*

**Parameters:**

Name | Type |
------ | ------ |
`x1` | X1 |
`x2` | X2 |
`x3` | X3 |
`x4` | X4 |

___

### `Const` wrapAsyncFn

▸ **wrapAsyncFn**‹**T**, **X1**, **X2**, **X3**, **X4**›(`fn`: function): *function*

*Defined in [index.ts:98](https://github.com/elierotenberg/typed-result/blob/master/src/index.ts#L98)*

**Type parameters:**

▪ **T**

▪ **X1**

▪ **X2**

▪ **X3**

▪ **X4**

**Parameters:**

▪ **fn**: *function*

▸ (`x1`: X1, `x2`: X2, `x3`: X3, `x4`: X4): *Promise‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`x1` | X1 |
`x2` | X2 |
`x3` | X3 |
`x4` | X4 |

**Returns:** *function*

▸ (`x1`: X1, `x2`: X2, `x3`: X3, `x4`: X4): *Promise‹[TResult](README.md#tresult)‹T, unknown››*

**Parameters:**

Name | Type |
------ | ------ |
`x1` | X1 |
`x2` | X2 |
`x3` | X3 |
`x4` | X4 |

___

### `Const` wrapFn

▸ **wrapFn**‹**T**, **X1**, **X2**, **X3**, **X4**›(`fn`: function): *function*

*Defined in [index.ts:76](https://github.com/elierotenberg/typed-result/blob/master/src/index.ts#L76)*

**Type parameters:**

▪ **T**

▪ **X1**

▪ **X2**

▪ **X3**

▪ **X4**

**Parameters:**

▪ **fn**: *function*

▸ (`x1`: X1, `x2`: X2, `x3`: X3, `x4`: X4): *T*

**Parameters:**

Name | Type |
------ | ------ |
`x1` | X1 |
`x2` | X2 |
`x3` | X3 |
`x4` | X4 |

**Returns:** *function*

▸ (`x1`: X1, `x2`: X2, `x3`: X3, `x4`: X4): *[TResult](README.md#tresult)‹T, unknown›*

**Parameters:**

Name | Type |
------ | ------ |
`x1` | X1 |
`x2` | X2 |
`x3` | X3 |
`x4` | X4 |
