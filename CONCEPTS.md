# Lisct Concepts

> *Lisct* — A minimalist Lisp dialect with dot-prefixed syntax, designed for structured data and social interactions.

---

## Philosophy

Lisct inherits the elegance of Lisp while introducing a distinctive **dot-prefix notation** that makes the boundary between data and code visually clear. The beauty of Lisct lies in its simplicity: only a handful of special forms, combined with three syntactic constructs — variables, constants, and procedure calls — form a complete and expressive language.

---

## Core Syntax

### The Dot Prefix `.`

In Lisct, the dot prefix `.` serves as the universal marker for **evaluation**:

- `.var` — Reference a variable
- `(.proc args...)` — Call a procedure
- `.t` — The truth value
- `.null` — The empty value (nil)

Without the dot, expressions are treated as **literal data**.

```lisp
12          ;; → 12 (literal number)
hello       ;; → hello (literal symbol)
.x          ;; → (value of x)
(.+ 1 2)    ;; → 3 (procedure call)
```

### Quote `'`

The quote syntax prevents evaluation, returning the expression as data:

```lisp
'(1 2 3)           ;; → (1 2 3)
'(.+ 1 2)          ;; → (.+ 1 2) - not evaluated
(.quote hello)     ;; → hello
```

### User Reference `@`

The `@` syntax is syntactic sugar for user references:

```lisp
@alice              ;; → (.user alice)
@bob                ;; → (.user bob)
```

---

## Special Forms

Lisct requires only **seven special forms** to achieve Turing completeness:

| Form | Syntax | Description |
|------|--------|-------------|
| **quote** | `(.quote exp)` or `'exp` | Return exp literally without evaluation |
| **eval** | `(.eval exp)` | Evaluate a quoted expression |
| **apply** | `(.apply proc args)` | Apply a procedure to a list of arguments |
| **define** | `(.define var exp)` | Bind a value to a variable |
| **lambda** | `(.lambda (params...) body)` | Create an anonymous procedure |
| **if** | `(.if test conseq alt)` | Conditional branching |
| **cond** | `(.cond (p1 e1) (p2 e2) ...)` | Multi-way conditional |
| **let** | `(.let ((var val) ...) body)` | Local bindings |

### Definition Examples

```lisp
;; Simple binding
(.define answer 42)
.answer                       ;; → 42

;; Procedure definition (short form)
(.define (square x) (.* x x))
(.square 5)                   ;; → 25

;; Equivalent long form
(.define square (.lambda (x) (.* x x)))
```

### Conditional Examples

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

---

## The Seven Axioms

Lisct preserves the **seven fundamental operations** of Lisp:

| Axiom | Syntax | Description |
|-------|--------|-------------|
| **quote** | `'x` | Return x literally |
| **atom** | `(.isLit? x)` | True if x is a literal (not a cons) |
| **eq** | `(.= x y)` | True if x equals y |
| **car** | `(.car list)` | First element of a cons cell |
| **cdr** | `(.cdr list)` | Rest of a cons cell |
| **cons** | `(.cons x y)` | Construct a new cons cell |
| **cond** | `(.cond ...)` | Conditional expression |

```lisp
(.car '(a b c))              ;; → a
(.cdr '(a b c))              ;; → (b c)
(.cons 'a '(b c))            ;; → (a b c)
(.cons '(1 2) '(3 4))        ;; → ((1 2) 3 4)
```

---

## Cons Cells

At the heart of Lisct lies the **cons cell**, the fundamental building block:

```
     ┌───┬───┐
     │car│cdr│
     └───┴───┘
       ↓   ↓
      data next
```

### S-Expression Rules

Cons cells are serialized to strings following these rules:

1. The car and cdr of a cons cell are joined by a dot and wrapped in parentheses
2. If cdr is a list, omit its outer parentheses
3. If the final cdr is null, omit it

```lisp
(.cons 'a null)              ;; → (a)
(.cons 'a (.cons 'b null))   ;; → (a b)
(.cons 'a 'b)                ;; → (a . b)  -- dotted pair
```

---

## Built-in Procedures

### Arithmetic

```lisp
(.+ 1 2 3)                   ;; → 6
(.- 10 3)                    ;; → 7
(.* 2 3 4)                   ;; → 24
(./ 20 4)                    ;; → 5
```

### Comparison

```lisp
(.> 5 3)                     ;; → true
(.< 5 3)                     ;; → false
(.>= 5 5)                    ;; → true
(.<= 5 5)                    ;; → true
(.= 'a 'a)                   ;; → true
```

### Predicates

```lisp
(.null? .null)               ;; → true
(.null? '(1))                ;; → false
(.isLit? 42)                 ;; → true
(.isLit? '(1 2))             ;; → false
```

---

## Higher-Order Functions

Lisct supports powerful list processing through higher-order functions:

### map

```lisp
(.define (map proc items)
  (.if (.null? items)
    .null
    (.cons (proc (.car items))
           (map proc (.cdr items)))))

(map (.lambda (x) (.* x x)) '(1 2 3 4))
;; → (1 4 9 16)
```

### filter

```lisp
(.define (filter pred seq)
  (.cond
    ((.null? seq) .null)
    ((pred (.car seq))
     (.cons (.car seq) (filter pred (.cdr seq))))
    (.else (filter pred (.cdr seq)))))

(filter (.lambda (x) (.> x 2)) '(1 2 3 4))
;; → (3 4)
```

---

## Lexical Scoping

Lisct uses **lexical scoping** with nested environments:

```lisp
(.define x 10)

(.define (outer)
  (.define y 20)
  (.define (inner)
    (.+ .x .y))  ;; inner sees x from global, y from outer
  (inner))

(outer)                      ;; → 30
```

---

## Domain-Specific Extensions

Lisct is designed for social and collaborative applications, with built-in support for:

### User Types

```lisp
(.define (user name)
  (.cons 'user (.cons name .null)))

@alice                       ;; Creates a user reference
```

---

## Reserved Namespace

The `.lisct.int.` namespace is reserved for internal system identifiers, ensuring clean separation between user-defined and system-level constructs.

---

*"The most profound technologies are those that disappear. They weave themselves into the fabric of everyday life until they are indistinguishable from it."* — Mark Weiser

Lisct aims to be such a technology: invisible in its simplicity, yet powerful in its expressiveness.
