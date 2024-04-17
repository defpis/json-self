import { ArrayExpr, Expr, ExprVisitor, LiteralExpr, ObjectExpr } from "./expr";

export class Generator implements ExprVisitor<any> {
  gen(expr: Expr) {
    return expr.accept(this);
  }

  visitObjectExpr(expr: ObjectExpr) {
    const object: any = {};
    for (const [k, v] of expr.attrs) {
      object[k] = v.accept(this);
    }
    return object;
  }

  visitArrayExpr(expr: ArrayExpr) {
    const array: any = [];
    for (const item of expr.items) {
      array.push(item.accept(this));
    }
    return array;
  }

  visitLiteralExpr(expr: LiteralExpr) {
    return expr.value;
  }
}
