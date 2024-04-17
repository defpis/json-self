export enum TokenType {
  LEFT_BRACKET = "[",
  RIGHT_BRACKET = "]",

  LEFT_BRACE = "{",
  RIGHT_BRACE = "}",

  COLON = ":",
  COMMA = ",",

  STRING = "string",
  NUMBER = "number",

  TRUE = "true",
  FALSE = "false",

  NULL = "null",
}

export class Token {
  constructor(
    public type: TokenType,
    public lexeme: string,
    public literal?: any,
  ) {}

  toString() {
    return `${this.type} | ${this.lexeme} | ${this.literal}`;
  }
}
