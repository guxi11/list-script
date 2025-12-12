export type Literal = { value: string | number | boolean };
export type Cons = { car: Cons | Literal, cdr: Cons | Literal | null };

export const literal = (value: string | number | boolean) => ({ value });
export const isLit = (node: Cons | Literal | null) => node?.hasOwnProperty('value');
export const value = (node: Literal | null) => node?.value ?? '';

export const eq = (cons: Cons) => car(cons) === cdr(cons);
export const eqL = (a: Literal, b: Literal) => value(a) === value(b);

export const cons = (car: Cons | Literal, cdr: Cons | Literal | null): Cons => ({ car, cdr });
export const isCons = (node: Cons | Literal | null) => node?.hasOwnProperty('car');

export const car = (cons: Cons | Literal | null) => (cons as Cons)?.car ?? null;
export const cdr = (cons: Cons | Literal | null) => (cons as Cons)?.cdr ?? null;

export const caar = (exp: Cons | Literal | null): Cons | Literal | null => car(car(exp));
export const cadr = (exp: Cons | Literal | null): Cons | Literal | null => cdr(car(exp));
export const cdar = (exp: Cons | Literal | null): Cons | Literal | null => car(cdr(exp));
export const cadar = (exp: Cons | Literal | null): Cons | Literal | null => car(cdr(car(exp)));
export const caddr = (exp: Cons | Literal | null): Cons | Literal | null => cdr(cdr(car(exp)));

export type Expression = Array<string | number | boolean>;
export type NestedExpression = Array<string|number|boolean|Expression|NestedExpression>;

export function getExpression(node: Cons | Literal | null, visited = new Set<Cons>()): NestedExpression | string | number | boolean {
  if (isLit(node)) return value(node as Literal);

  if (node === null) return [];

  if (visited.has(node as Cons)) {
    return ['...'];
  }
  visited.add(node as Cons);

  const car_ = isLit(car(node)) ? value(car(node) as Literal) : getExpression(car(node), new Set(visited));

  if (cdr(node) === null) {
    return [car_];
  } else if (isLit(cdr(node))) {
    // pressume cdr can only be literal when car is as well
    return [`${car_ as string} . ${value(cdr(node) as Literal) ?? ''}`];
  } else {
    return [car_, ...(getExpression(cdr(node), visited) as NestedExpression)];
  }
}

export const serialize = (node: Cons): string => {
  const stringify = (exp: NestedExpression): string => Array.isArray(exp) ?
    '(' + (exp as Expression).map(stringify as any).join(' ') + ')'
    : String(exp);
  return stringify(getExpression(node) as NestedExpression);
}
