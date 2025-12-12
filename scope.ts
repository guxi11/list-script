export class Scope {
  parent?: Scope = undefined;
  provider = {};

  constructor(parent: Scope | undefined, privider: Record<string, any>) {
    this.parent = parent;
    this.provider = privider;
  }

  get(id: string): any {
    const res = this[id] !== undefined
      ? this[id]
      : this.provider[id] !== undefined
        ? this.provider[id]
        : this.parent?.get(id);
    return res;
  }

  has(id: string): boolean {
    return this.localHas(id) || this.parent?.has(id) || false;
  }

  localHas(id: string): boolean {
    return this.hasOwnProperty(id) || this.provider.hasOwnProperty(id);
  }

  set(id: string, value: any) {
    if (!this.localHas(id) && this.parent?.has(id)) {
      this.parent.set(id, value);
    } else {
      if (this.hasOwnProperty(id)) {
        this[id] = value;
      } else {
        this.provider[id] = value;
      }
    }
    return this;
  }

  remove(id: string, recursively: boolean) {
    if (this.localHas(id)) {
      if (this.hasOwnProperty(id)) {
        delete this[id];
      } else {
        delete this.provider[id];
      }
    } else if (recursively) {
      this.parent?.remove(id, recursively);
    }
  }

  local(id: string, value: any) {
    this.provider[id] = value;
  }
}

export function newScope(parent?: Scope, provider?: Record<string, any>) {
  return new Scope(parent, provider || {});
}
