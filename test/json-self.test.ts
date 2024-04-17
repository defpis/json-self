import { it, expect } from "vitest";
import { parse, stringify } from "../src/json-self";

const obj = {
  a: 1,
  b: true,
  c: false,
  d: null,
  e: "xxx",
  f: {
    a: -1,
    b: true,
    c: false,
    d: null,
    e: "xxx",
    f: [
      1,
      -1,
      -0.1,
      true,
      false,
      null,
      "xxx",
      { a: 1, b: true, c: false, d: null, e: "xxx" },
      [1, true, false, null, "xxx"],
    ],
  },
};

it("parse.1", () => {
  expect(parse(JSON.stringify(obj))).toEqual(obj);
});

it("parse.2", () => {
  expect(parse(JSON.stringify({ a: undefined }))).toEqual({});
});

it("parse.3", () => {
  expect(parse(JSON.stringify([undefined]))).toEqual([null]);
});

it("stringify.1", () => {
  expect(stringify(obj)).toEqual(JSON.stringify(obj));
});

it("stringify.2", () => {
  expect(stringify({ a: undefined })).toEqual(JSON.stringify({}));
});

it("stringify.3", () => {
  expect(stringify([undefined])).toEqual(JSON.stringify([null]));
});

it("stringify.4", () => {
  var a = { b: a }; // => {}
  expect(stringify(a)).toEqual(JSON.stringify(a));
});

it("stringify.5", () => {
  const a: any = {};
  a.b = a;
  expect(() => stringify(a)).toThrowError();
});
