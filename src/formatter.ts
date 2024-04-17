import {
  isArray,
  isBoolean,
  isNull,
  isNumber,
  isObject,
  isString,
  isUndefined,
} from "lodash";
import { ArrayExpr, Expr, ExprVisitor, LiteralExpr, ObjectExpr } from "./expr";

export class Formatter implements ExprVisitor<string> {
  fmt(value: any) {
    if (isUndefined(value)) {
      return undefined;
    }

    const expr = this.expression(value);
    return this.format(expr);
  }

  format(expr: Expr) {
    return expr.accept(this);
  }

  expression(value: any, parents = []) {
    if (
      isNull(value) ||
      isBoolean(value) ||
      isNumber(value) ||
      isString(value)
    ) {
      return new LiteralExpr(value);
    }

    if (isArray(value)) {
      return this.array(value, [...parents, value]);
    }

    if (isObject(value)) {
      return this.object(value, [...parents, value]);
    }

    throw new Error("Unexpected type.");
  }

  array(value: any, parents: any[]) {
    const items: Expr[] = [];
    for (const item of value) {
      if (parents.includes(item)) {
        throw new Error("Circular dependency.");
      }
      // 数组中的 undefined 会被替换为 null
      if (isUndefined(item)) {
        items.push(new LiteralExpr(null));
      } else {
        items.push(this.expression(item));
      }
    }
    return new ArrayExpr(items);
  }

  object(value: any, parents: any[]) {
    const attrs: [string, Expr][] = [];
    for (const [k, v] of Object.entries(value)) {
      if (parents.includes(v)) {
        throw new Error("Circular dependency.");
      }
      // 对象中的 undefined 会被忽略
      if (!isUndefined(v)) {
        attrs.push([k, this.expression(v)]);
      }
    }
    return new ObjectExpr(attrs);
  }

  visitObjectExpr(expr: ObjectExpr): string {
    let s = "";
    s += "{";
    for (let i = 0; i < expr.attrs.length; i++) {
      const [k, v] = expr.attrs[i];
      s += `"${k}":${v.accept(this)}`;
      if (i < expr.attrs.length - 1) {
        s += ",";
      }
    }
    s += "}";
    return s;
  }

  visitArrayExpr(expr: ArrayExpr): string {
    let s = "";
    s += "[";
    for (let i = 0; i < expr.items.length; i++) {
      const item = expr.items[i];
      s += item.accept(this);
      if (i < expr.items.length - 1) {
        s += ",";
      }
    }
    s += "]";
    return s;
  }

  visitLiteralExpr(expr: LiteralExpr): string {
    return isString(expr.value) ? `"${expr.value}"` : expr.value; // 隐式转换自动处理 null/true/false
  }
}
