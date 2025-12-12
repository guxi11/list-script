import { type Cons, type Literal, literal, value, car, cdar } from '../cons';
import { reduce } from '../list';

function num(val: string | number | boolean) {
  if (typeof val === 'boolean') return val ? 1 : 0;
  return !isNaN(Number(val)) ? Number(val) : val;
}

const float = (val: string | number): number => typeof val === 'number' ? val : parseFloat(val);

export const arithmetic = {
  '+': (pair: Cons): Literal => literal(reduce(0, pair, (a, b) => float(a) + float(b))),
  '-': (pair: Cons): Literal => literal(reduce(2 * float('' + value(car(pair) as Literal)), pair, (a, b) => a - b)),
  '*': (pair: Cons): Literal => literal(reduce(1, pair, (a, b) => a * b)),
  '/': (pair: Cons): Literal => literal(reduce(float('' + value(car(pair) as Literal)) * float('' + value(car(pair) as Literal)), pair, (a, b) => a / b)),
  '>': (pair: Cons): Literal => literal(num(value(car(pair) as Literal)) > num(value(cdar(pair) as Literal))),
  '<': (pair: Cons): Literal => literal(num(value(car(pair) as Literal)) < num(value(cdar(pair) as Literal))),
  '<=': (pair: Cons): Literal => literal(num(value(car(pair) as Literal)) <= num(value(cdar(pair) as Literal))),
  '>=': (pair: Cons): Literal => literal(num(value(car(pair) as Literal)) >= num(value(cdar(pair) as Literal))),
  '=': (pair: Cons): Literal => literal(value(car(pair) as Literal) === value(cdar(pair) as Literal)),
};
