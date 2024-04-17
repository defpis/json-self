/*
- json = object | array | literal
- object = { ...(string: json) }
- array = [ ...json ]
- literal = string | number | true | false | null
*/

export interface Expr {
  accept<R>(visitor: ExprVisitor<R>): R;
}

export interface ExprVisitor<R> {
  visitObjectExpr(expr: ObjectExpr): R;
  visitArrayExpr(expr: ArrayExpr): R;
  visitLiteralExpr(expr: LiteralExpr): R;
}

export class ObjectExpr implements Expr {
  constructor(public attrs: [string, Expr][]) {}

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitObjectExpr(this);
  }
}

export class ArrayExpr implements Expr {
  constructor(public items: Expr[]) {}

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitArrayExpr(this);
  }
}

export class LiteralExpr implements Expr {
  constructor(public value: any) {}

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitLiteralExpr(this);
  }
}
