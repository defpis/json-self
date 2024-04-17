import { get, toNumber } from "lodash";
import { Token, TokenType } from "./token";

export class Scanner {
  start = 0;
  current = 0;
  source = "";
  tokens: Token[] = [];

  static keywords = {
    true: TokenType.TRUE,
    false: TokenType.FALSE,
    null: TokenType.NULL,
  };

  reset() {
    this.start = 0;
    this.current = 0;
    this.source = "";
    this.tokens = [];
  }

  scanTokens(source: string) {
    this.reset();

    this.source = source;

    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    return this.tokens;
  }

  scanToken() {
    const c = this.advance();

    switch (c) {
      case "[": {
        this.addToken(TokenType.LEFT_BRACKET);
        break;
      }
      case "]": {
        this.addToken(TokenType.RIGHT_BRACKET);
        break;
      }
      case "{": {
        this.addToken(TokenType.LEFT_BRACE);
        break;
      }
      case "}": {
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      }
      case ":": {
        this.addToken(TokenType.COLON);
        break;
      }
      case ",": {
        this.addToken(TokenType.COMMA);
        break;
      }
      case '"': {
        this.string();
        break;
      }
      case "-": {
        if (this.isDigit(this.peek())) {
          this.number();
        } else {
          throw new Error("Expected a number after minus sign.");
        }
        break;
      }
      case " ":
      case "\r":
      case "\t":
      case "\n": {
        break;
      }
      default: {
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          throw new Error("Unexpected character.");
        }
      }
    }
  }

  isAtEnd() {
    return this.current >= this.source.length;
  }

  advance() {
    return this.source.charAt(++this.current - 1);
  }

  peek() {
    if (this.isAtEnd()) return "";
    return this.source.charAt(this.current);
  }

  peekNext() {
    if (this.current + 1 >= this.source.length) return "";
    return this.source.charAt(this.current + 1);
  }

  addToken(type: TokenType, literal?: any) {
    const lexeme = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, lexeme, literal));
  }

  string() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      this.advance();
    }

    if (this.isAtEnd()) {
      throw new Error("Unterminated string.");
    }

    this.advance();

    const literal = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, literal);
  }

  isDigit(c: string) {
    return c >= "0" && c <= "9";
  }

  isAlpha(c: string) {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_";
  }

  isAlphaNumeric(c: string) {
    return this.isAlpha(c) || this.isDigit(c);
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }

    const text = this.source.substring(this.start, this.current);
    const type = get(Scanner.keywords, text);

    if (!type) {
      throw new Error("Unexpected word.");
    }

    this.addToken(type);
  }

  number() {
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    if (this.peek() === "." && this.isDigit(this.peekNext())) {
      this.advance();

      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }

    const literal = toNumber(this.source.substring(this.start, this.current));
    this.addToken(TokenType.NUMBER, literal);
  }
}
