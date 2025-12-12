# LISCT

> LISt-sCripT
> A minimalist Lisp dialect with dot-prefixed syntax, built with TypeScript for modern web applications.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)

## ✨ Features

- **Dot-prefix notation** — Clear visual distinction between code and data
- **@ syntax sugar** — First-class user references (`@alice` → `(.user alice)`)
- **Quote shorthand** — `'expr` for `(.quote expr)`
- **Cons cell foundation** — Classic Lisp data structure
- **Lexical scoping** — Proper closure support
- **TypeScript implementation** — Type-safe interpreter

## 🚀 Quick Start

```typescript
import { interpret } from '@/lib/lisct';

// Basic arithmetic
interpret('(.+ 1 2 3)');           // → 6

// Define a variable
interpret('(.define x 42)');
interpret('.x');                    // → 42

// Define a function
interpret('(.define (square n) (.* n n))');
interpret('(.square 5)');           // → 25

// List operations
interpret("(.car '(a b c))");       // → a
interpret("(.cdr '(a b c))");       // → (b c)
interpret("(.cons 'x '(y z))");     // → (x y z)
```

## 📖 Syntax Overview

### Variables & Constants

```lisp
42                      ;; literal number
hello                   ;; literal symbol
"hello world"           ;; literal string (spaces preserved)
.x                      ;; variable reference
```

### Procedures

```lisp
;; Lambda expression
(.lambda (x) (.* x 2))

;; Named function (short form)
(.define (double x) (.* x 2))

;; Equivalent long form
(.define double (.lambda (x) (.* x 2)))
```

### Conditionals

```lisp
;; if expression
(.if (.> n 0) 'positive 'non-positive)

;; cond expression
(.cond
  ((.< x 0) 'negative)
  ((.< x 10) 'small)
  (.else 'large))
```

### Quote & Eval

```lisp
'(1 2 3)                ;; → (1 2 3) - data, not evaluated
(.eval '(.+ 1 2))       ;; → 3 - evaluate quoted expression
(.apply .+ '(1 2 3))    ;; → 6 - apply procedure to list
```

---

## 🧬 Core Concepts

### Special Forms

| Form | Example | Description |
|------|---------|-------------|
| `quote` | `'x` | Return without evaluation |
| `define` | `(.define x 1)` | Create binding |
| `lambda` | `(.lambda (x) x)` | Create procedure |
| `if` | `(.if test a b)` | Conditional |
| `cond` | `(.cond (t1 e1) ...)` | Multi-branch conditional |
| `let` | `(.let ((x 1)) .x)` | Local binding |
| `eval` | `(.eval 'exp)` | Evaluate expression |
| `apply` | `(.apply .f args)` | Apply procedure |

### Built-in Functions

```lisp
;; List operations
(.cons a b)             ;; construct cons cell
(.car pair)             ;; first element
(.cdr pair)             ;; rest elements

;; Arithmetic
(.+ a b ...)            ;; addition
(.- a b)                ;; subtraction
(.* a b ...)            ;; multiplication
(./ a b)                ;; division

;; Comparison
(.> a b)  (.< a b)      ;; greater/less than
(.>= a b) (.<= a b)     ;; greater/less or equal
(.= a b)                ;; equality

;; Predicates
(.null? x)              ;; is null?
(.isLit? x)             ;; is literal?

;; I/O
(.print x)              ;; print to console
```

---

## 📚 Examples

### Factorial

```lisp
(.define (factorial n)
  (.if (.<= n 1)
    1
    (.* n (factorial (.- n 1)))))

(.factorial 5)          ;; → 120
```

### Map

```lisp
(.define (map proc items)
  (.if (.null? items)
    .null
    (.cons (proc (.car items))
           (map proc (.cdr items)))))

(.map (.lambda (x) (.* x x)) '(1 2 3 4))
;; → (1 4 9 16)
```

### Filter

```lisp
(.define (filter predicate sequence)
  (.cond
    ((.null? sequence) .null)
    ((predicate (.car sequence))
     (.cons (.car sequence)
            (filter predicate (.cdr sequence))))
    (.else (filter predicate (.cdr sequence)))))

(filter (.lambda (x) (.> x 2)) '(1 2 3 4))
;; → (3 4)
```

### Curried Function

```lisp
(((((.lambda (z) 
      (.lambda (y) 
        (.lambda (x) 
          (.- x y z)))) 
    2) 8) 15)
;; → 5
```

### Condition

```lisp
;; if expression
(.if (.> x 0) 'positive 'non-positive)

;; cond expression
(.define (classify x)
  (.cond
    ((.< x 0) 'negative)
    ((.< x 10) 'small)
    ((.< x 20) 'medium)
    (.else 'large)))

(.classify 15)               ;; → medium
```

## 🏗️ Architecture

```
src/lib/lisct/
├── index.ts           # Public API & global defines
├── interpret.ts       # Tokenizer, parser, evaluator
├── cons.ts            # Cons cell data structure
├── list.ts            # List utilities (map, reduce, filter)
├── scope.ts           # Lexical scoping implementation
├── env.ts             # Environment setup
└── providers/         # Built-in function providers
    ├── arithmetic.ts  # +, -, *, /, >, <, etc.
    ├── basic.ts       # null, t, null?, isLit?
    ├── cons.ts        # cons, car, cdr
    ├── special_form.ts # quote, define, lambda, if, cond, let
    ├── system.ts      # print
    └── reserved.ts    # Internal namespace
```

## 📄 Documentation

For a deeper understanding of Lisct's design philosophy and implementation details, see:

- [CONCEPTS.md](./src/lib/lisct/CONCEPTS.md) — Core language concepts and theory

---

## 🎯 Design Goals

1. **Minimalism** — Small set of primitives, maximum expressiveness
2. **Clarity** — Dot-prefix makes evaluation explicit
3. **Extensibility** — Easy to add domain-specific constructs
4. **Web-native** — TypeScript implementation for modern web apps

---

## 📜 License

MIT

---

*"Lisp is worth learning for the profound enlightenment experience you will have when you finally get it."* — Eric S. Raymond
