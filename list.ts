import { type Cons, type Literal, value, cons, car, cdr, isLit } from './cons';

export const map = (pair: Cons, fn: (pair: Cons) => Cons): Cons => cons(
  fn(car(pair) as Cons),
  cdr(pair) === null || isLit(cdr(pair)) ? null : map(cdr(pair) as Cons, fn)
);

export const reduce = <T>(acc: T, pair: Cons, fn: (a: T, b: T) => T): T => cdr(pair) === null || isLit(cdr(pair))
  ? fn(acc, value(car(pair) as Literal) as T)
  : reduce(fn(acc, value(car(pair) as Literal) as T), cdr(pair) as Cons, fn);

export const find = (pair: Cons, fn: (lit: Literal) => boolean): Cons | null => fn(car(pair) as Literal)
  ? pair
  : cdr(pair) === null || isLit(cdr(pair)) ? null : find(cdr(pair) as Cons, fn);

export const travel = (el: Cons | Literal, fn: (lit: Literal) => Literal, skip: (el: Cons) => boolean): Cons | Literal => isLit(el)
  ? fn(el as Literal)
  : skip(el as Cons)
    ? el
    : cons(travel(car(el), fn, skip), cdr(el) === null ? null : travel(cdr(el)!, fn, skip));

export const join = (cons: Cons) => reduce<string>('', cons, (a, b) => a + (a ? ' ' : '') + b);
