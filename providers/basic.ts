import { type Cons, isLit, car } from '../cons';

export const basic = {
  'isLit?': (exp: Cons) => isLit(car(exp as Cons)),
  'null?': (exp: Cons) => car(exp) === null,
  'null': null,
  't': true,
};
