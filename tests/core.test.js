import test from "node:test";
import assert from "node:assert/strict";
import {
  calculate,
  camelCase,
  countText,
  base64Encode,
  base64Decode,
  decodeJWT,
  password,
  token,
  pageRanges,
  domainName,
} from "../core.js";
test("calculator precedence, scientific notation, angles, factorial and invalid input", () => {
  assert.equal(calculate("-2^2"), -4);
  assert.equal(calculate("2^3^2"), 512);
  assert.equal(calculate("1e-3 + 5!"), 120.001);
  assert.ok(Math.abs(calculate("sin(30)", true) - 0.5) < 1e-12);
  assert.equal(calculate("sqrt(144)"), 12);
  assert.throws(() => calculate("1/0"));
  assert.throws(() => calculate("alert(1)"));
  assert.throws(() => calculate("2(3)"));
});
test("Unicode text and case", () => {
  assert.equal(camelCase("HTTP response-code"), "httpResponseCode");
  assert.equal(countText("Hello 世界").Characters, 8);
  assert.equal(countText("").Words, 0);
  assert.equal(base64Decode(base64Encode("Hello 世界 🌊")), "Hello 世界 🌊");
  assert.throws(() => base64Decode("***"));
});
test("JWT payload uses base64url", () => {
  const b = (s) =>
    base64Encode(JSON.stringify(s))
      .replaceAll("+", "-")
      .replaceAll("/", "_")
      .replace(/=+$/, "");
  assert.equal(
    decodeJWT(b({ alg: "none" }) + "." + b({ sub: "abc" }) + ".").payload.sub,
    "abc",
  );
  assert.throws(() => decodeJWT("bad"));
});
test("password character groups and tokens", () => {
  for (let i = 0; i < 20; i++) {
    const p = password(20, ["ABC", "xyz", "123"]);
    assert.equal(p.length, 20);
    assert.match(p, /[ABC]/);
    assert.match(p, /[xyz]/);
    assert.match(p, /[123]/);
  }
  assert.throws(() => password(20, []));
  assert.match(token(32, "hex"), /^[0-9a-f]{64}$/);
  assert.match(token(32, "base64url"), /^[\w-]{43}$/);
});
test("page ordering and domain validation", () => {
  assert.deepEqual(pageRanges("3,1-2,3", 3), [2, 0, 1, 2]);
  assert.throws(() => pageRanges("0,2", 3));
  assert.throws(() => pageRanges("3-1", 3));
  assert.equal(domainName("EXAMPLE.com."), "example.com");
  assert.throws(() => domainName("https://example.com"));
  assert.throws(() => domainName("a..com"));
});
