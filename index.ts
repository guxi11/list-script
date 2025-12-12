import { env } from './env';
import { interpret as interpret_ } from './interpret';

export { env };
export const interpret = (input: string) => interpret_(input, env);

// global defines
const defines = [
"(.define (user name) (.cons 'user (.cons name .null)))",

'(.define else .t)',

`(.define (map proc items)
   (.if (.null? items)
     .null
     (.cons (proc (.car items))
            (map proc (.cdr items)))))`,

`(.define (filter predicate sequence)
  (.cond ((.null? sequence) .null)
        ((predicate (.car sequence))
         (.cons (.car sequence)
               (filter predicate
                       (.cdr sequence))))
        (.else  (filter predicate
                       (.cdr sequence)))))`,
];
defines.map(interpret);
