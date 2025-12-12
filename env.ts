import { arithmetic } from './providers/arithmetic';
import { specialForm } from './providers/special_form';
import { basic } from './providers/basic';
import { consProvider } from './providers/cons';
import { system } from './providers/system';
import { reserved } from './providers/reserved';
import { newScope } from './scope';

const systemScope = [basic, consProvider, arithmetic, system, reserved]
  .reduce(
    (parent, provider) => newScope(parent, provider),
    newScope(undefined, specialForm)
  );

const defaultScope = newScope(systemScope, {});

export const env = defaultScope;
