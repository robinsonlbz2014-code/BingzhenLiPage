// Pure operations shared by the UI and tests. No eval / Function constructor.
export function calculate(source, degrees = false) {
  if (source.length > 1000) throw Error("Expression is too long.");
  const tokens =
    source.match(
      /(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|[A-Za-z]+|\*\*|[^\s]/g,
    ) || [];
  let i = 0;
  const trig = (f) => (x) => f(degrees ? (x * Math.PI) / 180 : x);
  const inv = (f) => (x) => f(x) * (degrees ? 180 / Math.PI : 1);
  const fns = {
    sin: trig(Math.sin),
    cos: trig(Math.cos),
    tan: trig(Math.tan),
    asin: inv(Math.asin),
    acos: inv(Math.acos),
    atan: inv(Math.atan),
    sqrt: Math.sqrt,
    abs: Math.abs,
    ln: Math.log,
    log: Math.log10,
    exp: Math.exp,
    floor: Math.floor,
    ceil: Math.ceil,
  };
  function atom() {
    const t = tokens[i++];
    let v;
    if (t === "+" || t === "-") return (t === "-" ? -1 : 1) * expr(3);
    if (t === "(") {
      v = expr(0);
      if (tokens[i++] !== ")") throw Error("Missing closing parenthesis.");
    } else if (t === "pi") v = Math.PI;
    else if (t === "e") v = Math.E;
    else if (Object.hasOwn(fns, t)) {
      if (tokens[i++] !== "(") throw Error("Use parentheses after functions.");
      v = fns[t](expr(0));
      if (tokens[i++] !== ")") throw Error("Missing closing parenthesis.");
    } else if (t && /^(?:\d|\.)/.test(t)) v = Number(t);
    else throw Error("Unexpected token: " + (t ?? "end of expression"));
    while (tokens[i] === "!" || tokens[i] === "%") {
      if (tokens[i++] === "%") {
        v /= 100;
        continue;
      }
      if (!Number.isInteger(v) || v < 0 || v > 170)
        throw Error("Factorial requires an integer from 0 to 170.");
      let n = 1;
      for (let k = 2; k <= v; k++) n *= k;
      v = n;
    }
    return v;
  }
  function expr(min) {
    let a = atom();
    while (i < tokens.length) {
      const op = tokens[i],
        p = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 4, "**": 4 }[op];
      if (!p || p < min) break;
      i++;
      const b = expr(p + (p === 4 ? 0 : 1));
      a =
        op === "+"
          ? a + b
          : op === "-"
            ? a - b
            : op === "*"
              ? a * b
              : op === "/"
                ? a / b
                : a ** b;
    }
    return a;
  }
  const result = expr(0);
  if (i !== tokens.length)
    throw Error(
      "Unexpected token: " + tokens[i] + ". Use * for multiplication.",
    );
  if (!Number.isFinite(result))
    throw Error("Result is undefined or outside the supported numeric range.");
  return result;
}
export function camelCase(text) {
  const words =
    text
      .replace(/([a-z\d])([A-Z])/g, "$1 $2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
      .match(/[\p{L}\p{N}]+/gu) || [];
  return words
    .map((w, i) => {
      w = w.toLowerCase();
      return i ? w.charAt(0).toUpperCase() + w.slice(1) : w;
    })
    .join("");
}
export function countText(text) {
  const words =
    typeof Intl.Segmenter === "function"
      ? [
          ...new Intl.Segmenter(undefined, { granularity: "word" }).segment(
            text,
          ),
        ].filter((x) => x.isWordLike).length
      : (text.trim().match(/\S+/gu) || []).length;
  return {
    Words: words,
    Characters: [...text].length,
    "Characters without whitespace": [...text.replace(/\s/gu, "")].length,
    Lines: text ? text.split(/\r\n|\r|\n/).length : 0,
    Paragraphs: text.trim() ? text.trim().split(/\n\s*\n/).length : 0,
    "Reading time (minutes, 200 words/min)": Math.ceil(words / 200),
  };
}
export function base64Encode(text) {
  let binary = "";
  for (const b of new TextEncoder().encode(text))
    binary += String.fromCharCode(b);
  return btoa(binary);
}
export function base64Decode(text, url = false) {
  let s = text.replace(/\s/g, "");
  if (url) s = s.replace(/-/g, "+").replace(/_/g, "/");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(s) || s.length % 4 === 1)
    throw Error("Invalid Base64 input.");
  const data = atob(s);
  return new TextDecoder("utf-8", { fatal: true }).decode(
    Uint8Array.from(data, (c) => c.charCodeAt(0)),
  );
}
export function decodeJWT(token) {
  const parts = token.trim().split(".");
  if (parts.length !== 3)
    throw Error("Expected a three-part JWT (header.payload.signature).");
  const header = JSON.parse(base64Decode(parts[0], true)),
    payload = JSON.parse(base64Decode(parts[1], true));
  const dates = {};
  for (const k of ["iat", "nbf", "exp"])
    if (typeof payload[k] === "number")
      dates[k] = new Date(payload[k] * 1000).toISOString();
  return {
    header,
    payload,
    dates,
    signature: parts[2],
    verification:
      "NOT VERIFIED. Decoding does not validate the signature or trust these claims.",
  };
}
export function randomInt(max) {
  if (!Number.isInteger(max) || max < 1 || max > 0x100000000)
    throw Error("Invalid random range.");
  const limit = Math.floor(0x100000000 / max) * max;
  const a = new Uint32Array(1);
  do {
    crypto.getRandomValues(a);
  } while (a[0] >= limit);
  return a[0] % max;
}
export function password(length, groups) {
  if (!Number.isInteger(length) || length < 4 || length > 256)
    throw Error("Choose a length from 4 to 256.");
  if (!groups.length) throw Error("Select at least one character group.");
  const alphabet = groups.join("");
  let result;
  do {
    result = Array.from(
      { length },
      () => alphabet[randomInt(alphabet.length)],
    ).join("");
  } while (!groups.every((g) => [...result].some((c) => g.includes(c))));
  return result;
}
export function token(bytes, encoding) {
  if (!Number.isInteger(bytes) || bytes < 16 || bytes > 512)
    throw Error("Choose 16–512 random bytes.");
  const a = crypto.getRandomValues(new Uint8Array(bytes));
  if (encoding === "hex")
    return [...a].map((b) => b.toString(16).padStart(2, "0")).join("");
  return btoa(String.fromCharCode(...a))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
export function pageRanges(text, total) {
  if (!text.trim()) throw Error("Enter page numbers, for example 1-3, 5.");
  let out = [];
  for (const part of text.split(",")) {
    const m = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) throw Error("Invalid page range: " + part);
    const start = Number(m[1]),
      end = Number(m[2] || m[1]);
    if (start < 1 || end < start || end > total)
      throw Error(
        "Pages must be between 1 and " + total + "; ranges must ascend.",
      );
    for (let i = start; i <= end; i++) {
      out.push(i - 1);
      if (out.length > 10000) throw Error("Too many selected pages.");
    }
  }
  return out;
}
export function domainName(value) {
  let s = value.trim().replace(/\.$/, "");
  if (/[\s/:?#@]/.test(s))
    throw Error("Enter a domain only, such as example.com.");
  try {
    s = new URL("https://" + s).hostname;
  } catch {
    throw Error("Invalid domain name.");
  }
  if (
    s.length > 253 ||
    !s.includes(".") ||
    !s
      .split(".")
      .every((x) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(x))
  )
    throw Error("Invalid domain name.");
  return s;
}
