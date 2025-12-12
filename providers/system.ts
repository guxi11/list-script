import { type Cons, serialize } from '../cons';

export const system = {
  print: (cons: Cons) => {
    const s = serialize(cons);
    console.log(s);
    return s;
  },
};
