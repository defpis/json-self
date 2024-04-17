import { ArrayExpr, Expr, LiteralExpr, ObjectExpr } from "./expr";
import { Token, TokenType } from "./token";

export class Parser {
  tokens: Token[] = [];
  current = 0;

  reset() {
    this.tokens = [];
    this.current = 0;
  }

  parse(tokens: Token[]) {
    this.reset();

    this.tokens = tokens;

    return this.json();
  }

  json() {
    if (this.match(TokenType.LEFT_BRACE)) {
      return this.object();
    }
    if (this.match(TokenType.LEFT_BRACKET)) {
      return this.array();
    }
    return this.literal();
  }

  object() {
    const attrs: [string, Expr][] = [];
    let peeking = false;
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      if (peeking) {
        this.consume(TokenType.COMMA, "Expect ',' after object value.");
      }
      const k = this.consume(
        TokenType.STRING,
        "Expect a string as object key.",
      ).literal;
      this.consume(TokenType.COLON, "Expect ':' between object key and value.");
      const v = this.json();
      attrs.push([k, v]);
      peeking = true;
    }
    this.consume(TokenType.RIGHT_BRACE, "Expect '}' at end of object.");
    return new ObjectExpr(attrs);
  }

  array() {
    const items: Expr[] = [];
    let peeking = false;
    while (!this.check(TokenType.RIGHT_BRACKET) && !this.isAtEnd()) {
      if (peeking) {
        this.consume(TokenType.COMMA, "Expect ',' after array item.");
      }
      const item = this.json();
      items.push(item);
      peeking = true;
    }
    this.consume(TokenType.RIGHT_BRACKET, "Expect ']' at end of array.");
    return new ArrayExpr(items);
  }

  literal() {
    if (this.match(TokenType.TRUE)) {
      return new LiteralExpr(true);
    }
    if (this.match(TokenType.FALSE)) {
      return new LiteralExpr(false);
    }
    if (this.match(TokenType.NULL)) {
      return new LiteralExpr(null);
    }
    if (this.match(TokenType.STRING) || this.match(TokenType.NUMBER)) {
      return new LiteralExpr(this.peekPrev().literal);
    }
    throw new Error("Unexpected token.");
  }

  peek() {
    return this.tokens[this.current];
  }

  peekPrev() {
    return this.tokens[this.current - 1];
  }

  check(type: TokenType) {
    if (this.isAtEnd()) {
      return false;
    }
    return this.peek().type === type;
  }

  advance() {
    this.current++;
    return this.peekPrev();
  }

  match(type: TokenType) {
    if (this.check(type)) {
      this.advance();
      return true;
    }

    return false;
  }

  consume(type: TokenType, message: string) {
    if (this.check(type)) {
      return this.advance();
    }
    throw new Error(message);
  }

  isAtEnd() {
    return this.current >= this.tokens.length;
  }
}
