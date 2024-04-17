import { Scanner } from "./scanner";
import { Parser } from "./parser";
import { Formatter } from "./formatter";
import { Generator } from "./generator";

const scanner = new Scanner();
const parser = new Parser();
const generator = new Generator();
const formatter = new Formatter();

export function parse(source: string): any {
  const tokens = scanner.scanTokens(source);
  const expr = parser.parse(tokens);
  return generator.gen(expr);
}

export function stringify(value: any): string | undefined {
  return formatter.fmt(value);
}
