import { type Cons, type Literal, literal, value, cons, car, cdr, caar, cdar, cadr, cadar, isLit, eqL } from '../cons';
import { newScope } from "../scope";
import { find, travel, map } from "../list";

export const specialForm = {
  quote: (exp: Cons): Cons | Literal => car(exp),

  eval: function (exp: Cons): any {
    const { eval_, env: scope } = this as any;
    return eval_(eval_(car(exp), scope), scope);
  },

  apply: function (exp: Cons): any {
    const { eval_, env: scope } = this as any;
    return eval_(cons(car(exp), eval_(cdar(exp), scope)), scope);
  },

  define: function (exp: Cons): any {
    const { eval_, env: scope } = this as any;
    if (isLit(car(exp))) {
      scope.local(value(car(exp) as Literal), eval_(cdar(exp), scope));
    } else {
      scope.local(value(caar(exp) as Literal), specialForm.lambda.call(this, cons(cadr(exp)!, cdr(exp)), value(caar(exp) as Literal)));
    }
    // console.log(scope);
    return null;
  },

  lambda: function (exp: Cons, id?: string) {
    const { eval_, env: scope } = this as any;
    const args = car(exp) as Cons;
    const body = cdar(exp) as Cons;
    const argsWithName = id ? cons(literal(id), args) : args;
    const body_ = travel(body, (lit: Literal) => find(argsWithName, l => eqL(l, lit)) ? literal(`.${value(lit)}`) : lit, el => value(car(el) as Literal) === '.quote');

    const bind = (args: Cons, realArgs: Cons): any => ({
      ['' + value(car(args) as Literal)]: car(realArgs),
      ...(cdr(args) === null || cdr(realArgs) === null  || isLit(cdr(args)) || isLit(cdr(realArgs))
        ? {}
        : bind(cdr(args) as Cons, cdr(realArgs) as Cons))
    });

    return function (realArgs: Cons) {
      return eval_(body_, newScope(scope, bind(args, realArgs)));
    };
  },

  if: function (exp: Cons) {
    const { eval_, env: scope } = this as any;
    return eval_(car(exp), scope) ? eval_(cdar(exp), scope) : eval_(cdar(cdr(exp) as Cons), scope);
  },

  cond: function (exp: Cons) {
    const { eval_, env: scope } = this as any;

    const test = (exp: Cons): Cons | Literal => eval_(caar(exp), scope)
      ? eval_(cadar(exp), scope) : test(cdr(exp) as Cons);

    return test(exp as Cons);
  },

  let: function (exp: Cons) {
    const { eval_, env: scope } = this as any;
    const args = map(car(exp) as Cons, (pair: Cons) => car(pair) as Cons);
    const realArgExps = map(car(exp) as Cons, (pair: Cons) => cdar(pair) as Cons);
    const realArgs = map(realArgExps, (exp: Cons | Literal) => eval_(exp, scope));
    const body = cdar(exp);
    return specialForm.lambda.call(this, cons(args, cons(body!, null)) as Cons)(realArgs);
  },

  'special?': (exp: Cons) => special('' + value(car(exp) as Literal)),
};

export const special = (id: string | null) => typeof id === 'string' && Object.keys(specialForm).includes(id);
