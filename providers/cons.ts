import { type Cons, cons, cdar, caar, cadr, car } from '../cons';

export const consProvider = {
  cons: (exp: Cons) => cons(car(exp), cdar(exp)),
  car: caar,
  cdr: cadr,
};
