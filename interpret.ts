/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Cons, type Literal, literal, value, cons, car, cdr, isLit, serialize } from './cons';
import { map, join } from './list';
import { special } from './providers/special_form';

export const tokenize = (input: string): string[] => input
  .replaceAll('\n', '')
  .replace(/".*?"/g, match => match.replace(' ', '_WHITESPACE_'))
  .replace(/@/g, '_AT_ ')
  .replace(/'/g, '\' ')
  .replace(/(\(|\))/g, " $1 ")
  .split(' ').filter(Boolean)
  .map(x => x.replace('_WHITESPACE_', ' ').replace(/^_AT_/, '@'));

export function parse(tokens: string[]): Cons | Literal | null {
  function parseIter(skipCdr?: boolean): Cons | Literal | null {
    const token: string | undefined = tokens.shift();
    if (token === undefined) {
      return null;
    } else if (token === '(') {
      return cons(parseIter()!, skipCdr ? null : parseIter());
    } else if (token === ')') {
      return null;
    } else if (token === '@') {
      return cons(cons(literal('.user'), parseIter(true)), parseIter());
    } else if (token === '\'') {
      return cons(cons(literal('.quote'), parseIter(true)), parseIter());
    } else {
      return cons(literal(token), skipCdr ? null : parseIter());
    }
  }
  const parsed = parseIter();
  if (isLit(car(parsed))) { // special logic
    return literal(join(parsed as Cons));
  }
  return car(parsed as Cons);
}

export const id = (node: Cons | Literal) => isLit(node) && /^\./.exec('' + value(node as Literal)) && (('' + value(node as Literal)).slice(1) ?? null);

export function eval_(exp: Cons | Literal, env: any): Cons | Literal | null {
  if (isLit(exp)) {
    const id_ = id(exp);
    return !id_
      ? exp as Literal
      : env.get(id_) ?? (env.get(id_) === null ? null : literal(`${id_} not defined`));
  }

  if (special(id(car(exp)))) {
    return env.get(id(car(exp))).call(({ eval_, env }), cdr(exp));
  }

  const subExp = map(exp as Cons, (exp: Cons | Literal) => eval_(exp, env) as any);

  return typeof car(subExp) !== 'function'
    ? subExp
    : (car(subExp) as any as Function).call({ eval_, env }, cdr(subExp));
}

export function interpret(input: string, env: any): Cons {
  const tokens = tokenize(input);
  const exp = parse(tokens.length ? tokens : ['']);
  const evaled = eval_(exp!, env);
  return evaled;
}
