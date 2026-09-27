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
} from "./core.js";
const $ = (id) => document.getElementById(id);
const tools = [
  [
    "calculator",
    "Everyday",
    "Scientific calculator",
    "±",
    "Arithmetic, powers, trigonometry, and more.",
  ],
  [
    "timer",
    "Everyday",
    "Timer",
    "◷",
    "Set a countdown and keep it running while you use other tools.",
  ],
  [
    "words",
    "Text",
    "Word counter",
    "Aa",
    "Count words, characters, lines, and paragraphs as you type.",
  ],
  [
    "case",
    "Text",
    "Text case",
    "aA",
    "Convert text to uppercase, lowercase, or camelCase.",
  ],
  [
    "json",
    "Developer",
    "JSON formatter",
    "{}",
    "Validate, format, or minify JSON.",
  ],
  [
    "base64",
    "Developer",
    "Base64",
    "64",
    "Encode and decode UTF-8 text. Base64 is encoding, not encryption.",
  ],
  [
    "jwt",
    "Developer",
    "JWT decoder",
    "jwt",
    "Inspect a token’s header and payload. Signatures are not verified.",
  ],
  [
    "regex",
    "Developer",
    "RegEx tester",
    ".*",
    "Test JavaScript regular expressions with match positions and capture groups.",
  ],
  [
    "yaml",
    "Developer",
    "YAML → JSON",
    "y:",
    "Convert a single YAML document to JSON.",
  ],
  [
    "password",
    "Security",
    "Password generator",
    "✳",
    "Generate random passwords with your chosen character groups.",
  ],
  [
    "token",
    "Security",
    "Token generator",
    "#",
    "Generate cryptographically random bytes as hex or Base64URL.",
  ],
  [
    "hash",
    "Security",
    "Hash generator",
    "≋",
    "Calculate MD5 or SHA-256 for UTF-8 text.",
  ],
  [
    "crop",
    "Files & images",
    "Image cropper",
    "⊡",
    "Drag a selection or enter exact pixel coordinates to crop an image.",
  ],
  [
    "svg",
    "Files & images",
    "SVG → PNG",
    "▧",
    "Rasterize an SVG and optionally reduce PNG colors for a smaller file.",
  ],
  [
    "qr",
    "Files & images",
    "QR generator",
    "▦",
    "Create a downloadable QR code from text or a URL.",
  ],
  [
    "pdf",
    "Files & images",
    "PDF utilities",
    "▤",
    "Merge PDFs in your chosen order, extract pages, or split into individual files.",
  ],
  [
    "network",
    "Network",
    "DNS, IP & WHOIS",
    "◎",
    "Look up DNS records, discover your public IP, and inspect domain registration data.",
  ],
];
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const input = (id, label, value = "", type = "text", attrs = "") =>
  `<label class="field"><span>${label}</span><input id="${id}" type="${type}" value="${esc(value)}" ${attrs}></label>`;
const area = (id, label, value = "", placeholder = "Paste or type here…") =>
  `<label class="field"><span>${label}</span><textarea id="${id}" placeholder="${esc(placeholder)}" spellcheck="false">${esc(value)}</textarea></label>`;
const select = (id, label, options) =>
  `<label class="field"><span>${label}</span><select id="${id}">${options.map(([v, l]) => `<option value="${v}">${l}</option>`).join("")}</select></label>`;
const btn = (id, text, primary = false) =>
  `<button id="${id}"${primary ? ' class="primary"' : ""}>${text}</button>`;
const out = (id) =>
  `<div class="output"><div class="output-head"><span>Output</span><button class="copy" data-copy="${id}" aria-label="Copy ${id} output">Copy</button></div><pre class="result" id="${id}-result"></pre><div id="${id}-media" class="media-output"></div><div id="${id}-downloads" class="downloads"></div></div>`;
const err = (id) => `<p class="error" id="${id}-error" role="alert"></p>`;
const panel = (content) => `<div class="panel">${content}</div>`;
const bodies = {
  calculator: panel(
    `<div class="calc-layout"><div>${input("calculator-input", "Expression", "sin(30) + sqrt(144)")}${select(
      "calc-angle",
      "Angle unit",
      [
        ["degrees", "Degrees"],
        ["radians", "Radians"],
      ],
    )}<div class="keypad" id="keypad"></div>${err("calculator")}${out("calculator")}</div><div class="reference"><h3>A few useful shortcuts</h3><dl><dt>sin(x)</dt><dd>Sine</dd><dt>cos(x)</dt><dd>Cosine</dd><dt>tan(x)</dt><dd>Tangent</dd><dt>sqrt(x)</dt><dd>Square root</dd><dt>log(x)</dt><dd>Base-10 log</dd><dt>ln(x)</dt><dd>Natural log</dd><dt>x ^ y</dt><dd>Power</dd><dt>x!</dt><dd>Factorial</dd><dt>pi / e</dt><dd>Constants</dd><dt>x%</dt><dd>x ÷ 100</dd></dl><p class="hint">Press Enter to calculate. Use * for multiplication. Inverse trig: asin, acos, atan.</p><p class="hint">Uses floating-point arithmetic; results may have small rounding differences.</p></div></div>`,
  ),
  timer: panel(
    `<div class="row">${input("timer-hours", "Hours", 0, "number", 'min="0" max="99" step="1"')}${input("timer-minutes", "Minutes", 5, "number", 'min="0" max="59" step="1"')}${input("timer-seconds", "Seconds", 0, "number", 'min="0" max="59" step="1"')}</div><p class="timer-state" id="timer-state" role="status">Ready</p>${out("timer")}<div class="actions">${btn("timer-start", "Start", true)}${btn("timer-pause", "Pause")}${btn("timer-reset", "Reset")}</div><p class="hint">Keep this tab open. Sleeping devices may delay the alert; the countdown catches up when the tab resumes.</p>${err("timer")}`,
  ),
  words: panel(`${area("words-input", "Your text")}${out("words")}`),
  case: panel(
    `${area("case-input", "Original text")}<div class="actions">${btn("case-upper", "UPPERCASE", true)}${btn("case-lower", "lowercase")}${btn("case-camel", "camelCase")}</div>${out("case")}`,
  ),
  json: panel(
    `${area("json-input", "JSON", '{\n  "hello": "world",\n  "tools": ["format", "validate"]\n}')}<div class="row">${select(
      "json-indent",
      "Indentation",
      [
        ["2", "2 spaces"],
        ["4", "4 spaces"],
        ["tab", "Tab"],
      ],
    )}</div><div class="actions">${btn("json-format", "Format JSON", true)}${btn("json-minify", "Minify")}${btn("json-validate", "Validate")}</div><p class="hint">Standard JavaScript number precision applies. Quote integers larger than 9,007,199,254,740,991 to preserve them.</p>${err("json")}${out("json")}`,
  ),
  base64: panel(
    `${area("base64-input", "Text or Base64")}<div class="actions">${btn("base64-encode", "Encode", true)}${btn("base64-decode", "Decode")}</div>${err("base64")}${out("base64")}`,
  ),
  jwt: panel(
    `${area("jwt-input", "JWT", "", "eyJ… . eyJ… . signature")}<div class="actions">${btn("jwt-decode", "Decode token", true)}</div><p class="hint">Decoded claims are untrusted. This tool does not authenticate tokens or validate signatures.</p>${err("jwt")}${out("jwt")}`,
  ),
  regex: panel(
    `<div class="row">${input("regex-pattern", "Pattern (without / delimiters)", "[a-z]+")}${input("regex-flags", "Flags", "gi")}</div>${area("regex-input", "Test text", "Hello world 123")}<div class="actions">${btn("regex-test", "Test pattern", true)}</div><p class="hint">Positions are zero-based UTF-16 offsets. Up to 1,000 matches; execution stops after 1.5 seconds.</p>${err("regex")}${out("regex")}`,
  ),
  yaml: panel(
    `${area("yaml-input", "YAML", "name: Workbench\nfeatures:\n  - local files\n  - useful tools")}<div class="actions">${btn("yaml-convert", "Convert to JSON", true)}</div><p class="hint">Uses the YAML JSON schema: custom tags are disabled and date-like values stay strings. Complex mapping keys are not supported.</p>${err("yaml")}${out("yaml")}`,
  ),
  password: panel(
    `${input("password-length", "Password length", 20, "number", 'min="4" max="256" step="1"')}<div class="checks"><label><input id="pw-upper" type="checkbox" checked> A–Z</label><label><input id="pw-lower" type="checkbox" checked> a–z</label><label><input id="pw-number" type="checkbox" checked> 0–9</label><label><input id="pw-symbol" type="checkbox" checked> Symbols</label></div><div class="actions">${btn("password-generate", "Generate password", true)}</div><p class="hint">Every selected character group appears at least once. Passwords are not stored.</p>${err("password")}${out("password")}`,
  ),
  token: panel(
    `<div class="row">${input("token-bytes", "Random bytes", 32, "number", 'min="16" max="512" step="1"')}${select(
      "token-encoding",
      "Encoding",
      [
        ["hex", "Hexadecimal"],
        ["base64url", "Base64URL"],
      ],
    )}</div><div class="actions">${btn("token-generate", "Generate token", true)}</div><p class="hint">32 random bytes provide 256 bits of randomness. This creates a random secret, not a signed JWT.</p>${err("token")}${out("token")}`,
  ),
  hash: panel(
    `${area("hash-input", "Text to hash")}${select(
      "hash-algorithm",
      "Algorithm",
      [
        ["SHA-256", "SHA-256"],
        ["MD5", "MD5 (legacy checksum)"],
      ],
    )}<div class="actions">${btn("hash-generate", "Calculate hash", true)}</div><p class="hint">MD5 is broken for security use. Neither plain MD5 nor plain SHA-256 is suitable for storing passwords.</p>${err("hash")}${out("hash")}`,
  ),
  crop: panel(
    `${input("crop-file", "Choose an image", "", "file", 'accept="image/png,image/jpeg,image/webp,image/gif"')}<div class="crop-area"><canvas id="crop-canvas" hidden></canvas></div><div class="row">${input("crop-x", "Left (px)", 0, "number", 'min="0" step="1"')}${input("crop-y", "Top (px)", 0, "number", 'min="0" step="1"')}${input("crop-width", "Width (px)", 1, "number", 'min="1" step="1"')}${input("crop-height", "Height (px)", 1, "number", 'min="1" step="1"')}</div><div class="actions">${btn("crop-export", "Crop to PNG", true)}</div><p class="hint">Coordinates use original image pixels. Animated images export a still frame. Limit: 20 MB / 24 megapixels.</p>${err("crop")}${out("crop")}`,
  ),
  svg: panel(
    `${input("svg-file", "Upload an SVG (or paste below)", "", "file", 'accept=".svg,image/svg+xml"')}${area("svg-input", "SVG markup", '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect width="240" height="240" rx="48" fill="#2d53e5"/><text x="120" y="159" text-anchor="middle" font-family="sans-serif" font-size="130" fill="white">U</text></svg>')}<div class="row">${input("svg-width", "PNG width", 512, "number", 'min="1" max="4096" step="1"')}${input("svg-height", "PNG height", 512, "number", 'min="1" max="4096" step="1"')}${select(
      "svg-colors",
      "PNG optimization",
      [
        ["0", "Lossless (full color)"],
        ["256", "256 colors (lossy)"],
        ["64", "64 colors (lossy)"],
        ["16", "16 colors (lossy)"],
      ],
    )}</div><div class="actions">${btn("svg-convert", "Convert & optimize", true)}</div><p class="hint">External resources, scripts, embedded HTML, and animation are removed. The SVG’s aspect-ratio rules apply inside the chosen canvas. Limits: 1 MB SVG / 4 megapixels.</p>${err("svg")}${out("svg")}`,
  ),
  qr: panel(
    `${area("qr-input", "Text or URL", "https://example.com")}<div class="row">${select(
      "qr-level",
      "Error correction",
      [
        ["M", "Medium (15%)"],
        ["L", "Low (7%)"],
        ["Q", "Quartile (25%)"],
        ["H", "High (30%)"],
      ],
    )}${input("qr-scale", "Pixels per module", 6, "number", 'min="2" max="16" step="1"')}</div><div class="actions">${btn("qr-generate", "Generate QR code", true)}</div><p class="hint">Includes a four-module quiet border for reliable scanning.</p>${err("qr")}${out("qr")}`,
  ),
  pdf: panel(
    `${input("pdf-files", "Choose PDFs", "", "file", 'accept="application/pdf,.pdf" multiple')}<div id="pdf-order" class="hint"></div><div class="actions">${btn("pdf-merge", "Merge in listed order", true)}</div><hr style="border:0;border-top:1px solid var(--line);margin:24px 0">${input("pdf-pages", "Pages to extract from the first file", "1-3, 5")}<div class="actions">${btn("pdf-extract", "Extract pages")}${btn("pdf-split", "Split first PDF into pages")}</div><p class="hint">Encrypted PDFs are not supported. Total input limit: 50 MB. Split limit: 100 pages. Merging or extracting may not preserve bookmarks, interactive forms, or digital signatures.</p>${err("pdf")}${out("pdf")}`,
  ),
  network: panel(
    `${input("network-domain", "Domain", "example.com")}${select(
      "network-type",
      "DNS record type",
      ["A", "AAAA", "MX", "TXT", "CNAME", "NS", "SOA", "CAA"].map((x) => [
        x,
        x,
      ]),
    )}<div class="actions">${btn("network-dns", "DNS lookup", true)}${btn("network-ip", "Find my public IP")}${btn("network-whois", "WHOIS / RDAP")}</div><p class="hint">Online tools: DNS queries go to Google Public DNS, IP discovery contacts ipify, and domain lookups use RDAP.org and the registry. Requests reveal your IP to these services. Some registries limit access or block browser requests.</p><p class="hint">WHOIS-style registration data is retrieved with RDAP over HTTPS. Private registration fields may be redacted.</p>${err("network")}${out("network")}`,
  ),
};
$("tools").innerHTML = tools
  .map(
    ([id]) =>
      `<section id="tool-${id}" aria-label="${esc(tools.find((t) => t[0] === id)[2])}" hidden>${bodies[id]}</section>`,
  )
  .join("");
$("navigation").innerHTML = [...new Set(tools.map((t) => t[1]))]
  .map(
    (group) =>
      `<div class="nav-group"><h2>${group}</h2>${tools
        .filter((t) => t[1] === group)
        .map(
          ([id, , name, icon]) =>
            `<a href="#${id}" data-tool="${id}"><span class="nav-icon" aria-hidden="true">${icon}</span>${name}</a>`,
        )
        .join("")}</div>`,
  )
  .join("");
function navigate() {
  const id = location.hash.slice(1);
  const tool = tools.find((t) => t[0] === id) || tools[0];
  for (const t of tools) $("tool-" + t[0]).hidden = t !== tool;
  document.querySelectorAll("[data-tool]").forEach((a) => {
    if (a.dataset.tool === tool[0]) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  $("title").textContent = $("crumb").textContent = tool[2];
  $("category").textContent = tool[1].toUpperCase();
  $("description").textContent = tool[4];
  $("privacy").textContent =
    tool[0] === "network" ? "Uses public services" : "On your device";
  document.title = tool[2] + " · Utility Workbench";
}
window.addEventListener("hashchange", navigate);
navigate();
function setTheme(dark) {
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  $("theme").setAttribute("aria-pressed", String(dark));
  $("theme").querySelector("span").textContent = dark
    ? "Light mode"
    : "Dark mode";
}
try {
  setTheme(
    (localStorage.getItem("theme") ||
      (matchMedia("(prefers-color-scheme:dark)").matches
        ? "dark"
        : "light")) === "dark",
  );
} catch {
  setTheme(false);
}
$("theme").onclick = () => {
  const dark = document.documentElement.dataset.theme !== "dark";
  setTheme(dark);
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {}
};
let toastTimer;
function toast(message) {
  $("toast").textContent = message;
  $("toast").classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("visible"), 2800);
}
const outputs = new Map(),
  urls = new Map();
function clearOutput(id) {
  for (const url of urls.get(id) || []) URL.revokeObjectURL(url);
  urls.set(id, []);
  outputs.delete(id);
  $(id + "-result").textContent = "";
  $(id + "-media").replaceChildren();
  $(id + "-downloads").replaceChildren();
}
function show(id, value) {
  clearOutput(id);
  const text =
    typeof value === "string" ? value : JSON.stringify(value, null, 2);
  $(id + "-result").textContent = text;
  outputs.set(id, { text });
}
function ownURL(id, blob) {
  const url = URL.createObjectURL(blob);
  urls.set(id, [...(urls.get(id) || []), url]);
  return url;
}
function fileOutput(id, blob, name, description, image = false) {
  show(id, description);
  outputs.set(id, { blob, text: description });
  const url = ownURL(id, blob);
  if (image) {
    const img = new Image();
    img.className = "media-preview";
    img.alt = name;
    img.src = url;
    $(id + "-media").append(img);
  }
  const a = document.createElement("a");
  a.className = "download";
  a.href = url;
  a.download = name;
  a.textContent = "Download " + name;
  $(id + "-downloads").append(a);
}
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.cssText = "position:fixed;left:-9999px;";
    document.body.append(el);
    el.select();
    const ok = document.execCommand("copy");
    el.remove();
    if (!ok)
      throw Error(
        "Clipboard unavailable. Select and copy the output manually.",
      );
  }
}
async function copyBlob(blob) {
  if (
    blob.type === "image/png" &&
    navigator.clipboard?.write &&
    window.ClipboardItem
  ) {
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return "Image copied";
  }
  const data = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
  await copyText(data);
  return "File copied as a Base64 data URL";
}
document.addEventListener("click", async (e) => {
  const button = e.target.closest("[data-copy]");
  if (!button) return;
  const output = outputs.get(button.dataset.copy);
  if (!output) {
    toast("Generate an output first");
    return;
  }
  try {
    if (output.blob) toast(await copyBlob(output.blob));
    else {
      await copyText(output.text);
      toast("Copied to clipboard");
    }
  } catch (e) {
    toast(e.message || "Could not copy. Use the download button.");
  }
});
function bind(button, id, fn) {
  $(button).onclick = async () => {
    const b = $(button);
    b.disabled = true;
    if ($(id + "-error")) $(id + "-error").textContent = "";
    try {
      await fn();
    } catch (e) {
      clearOutput(id);
      $(id + "-error").textContent = e.message || String(e);
    } finally {
      b.disabled = false;
    }
  };
}
const val = (id) => $(id).value;
function integer(id, min, max) {
  const n = Number(val(id));
  if (!val(id).trim() || !Number.isInteger(n) || n < min || n > max)
    throw Error(`Enter a whole number from ${min} to ${max}.`);
  return n;
}
function dependency(name) {
  if (!window[name])
    throw Error(
      "A required local library is missing. Upload the entire vendor folder and refresh.",
    );
  return window[name];
}
const keyLabels = [
  "sin(",
  "cos(",
  "tan(",
  "(",
  ")",
  "ln(",
  "log(",
  "sqrt(",
  "^",
  "!",
  "7",
  "8",
  "9",
  "/",
  "C",
  "4",
  "5",
  "6",
  "*",
  "⌫",
  "1",
  "2",
  "3",
  "-",
  "%",
  "0",
  ".",
  "pi",
  "+",
  "=",
];
$("keypad").innerHTML = keyLabels
  .map(
    (k) =>
      `<button class="${k === "=" ? "primary" : /\d|\./.test(k) ? "" : "op"}" data-key="${k}">${k}</button>`,
  )
  .join("");
function calc() {
  try {
    $("calculator-error").textContent = "";
    show(
      "calculator",
      Number(
        calculate(
          val("calculator-input"),
          val("calc-angle") === "degrees",
        ).toPrecision(14),
      ).toString(),
    );
  } catch (e) {
    clearOutput("calculator");
    $("calculator-error").textContent = e.message;
  }
}
$("keypad").onclick = (e) => {
  const key = e.target.dataset.key;
  if (!key) return;
  const field = $("calculator-input");
  if (key === "=") {
    calc();
    return;
  }
  if (key === "C") {
    field.value = "";
    clearOutput("calculator");
  } else {
    const start = field.selectionStart ?? field.value.length,
      end = field.selectionEnd ?? start;
    if (key === "⌫") {
      field.setRangeText(
        "",
        start === end ? Math.max(0, start - 1) : start,
        end,
        "end",
      );
    } else field.setRangeText(key, start, end, "end");
  }
  field.focus();
};
$("calculator-input").onkeydown = (e) => {
  if (e.key === "Enter") calc();
};
$("calc-angle").onchange = calc;
calc();
let timerEnd = 0,
  remaining = 300000,
  timerRunning = false,
  audio;
function timerDisplay() {
  const ms = timerRunning ? Math.max(0, timerEnd - Date.now()) : remaining;
  const sec = Math.ceil(ms / 1000),
    text = [Math.floor(sec / 3600), Math.floor(sec / 60) % 60, sec % 60]
      .map((n) => String(n).padStart(2, "0"))
      .join(":");
  $("timer-result").textContent = text;
  outputs.set("timer", { text });
  if (timerRunning && ms === 0) {
    timerRunning = false;
    remaining = 0;
    $("timer-state").textContent = "Time is up!";
    toast("Timer finished");
    if (audio) {
      const o = audio.createOscillator(),
        g = audio.createGain();
      o.connect(g);
      g.connect(audio.destination);
      g.gain.value = 0.12;
      o.frequency.value = 740;
      o.start();
      o.stop(audio.currentTime + 0.65);
    }
  }
}
$("timer-result").className = "timer-digits";
function readTimer() {
  return (
    (integer("timer-hours", 0, 99) * 3600 +
      integer("timer-minutes", 0, 59) * 60 +
      integer("timer-seconds", 0, 59)) *
    1000
  );
}
bind("timer-start", "timer", () => {
  if (timerRunning) return;
  if (remaining <= 0) remaining = readTimer();
  if (remaining <= 0) throw Error("Set a duration greater than zero.");
  try {
    audio ??= new (window.AudioContext || window.webkitAudioContext)();
    audio.resume().catch(() => {});
  } catch {}
  timerEnd = Date.now() + remaining;
  timerRunning = true;
  $("timer-state").textContent = "Running";
  timerDisplay();
});
$("timer-pause").onclick = () => {
  if (timerRunning) {
    remaining = Math.max(0, timerEnd - Date.now());
    timerRunning = false;
    $("timer-state").textContent = "Paused";
    timerDisplay();
  }
};
bind("timer-reset", "timer", () => {
  const duration = readTimer();
  timerRunning = false;
  remaining = duration;
  $("timer-state").textContent = "Ready";
  timerDisplay();
});
for (const x of ["hours", "minutes", "seconds"])
  $("timer-" + x).onchange = () => {
    if (!timerRunning) {
      try {
        remaining = readTimer();
        $("timer-error").textContent = "";
        timerDisplay();
      } catch (e) {
        $("timer-error").textContent = e.message;
      }
    }
  };
setInterval(timerDisplay, 250);
timerDisplay();
$("words-input").oninput = () => show("words", countText(val("words-input")));
$("words-input").oninput();
for (const [mode, fn] of [
  ["upper", (s) => s.toUpperCase()],
  ["lower", (s) => s.toLowerCase()],
  ["camel", camelCase],
])
  $("case-" + mode).onclick = () => show("case", fn(val("case-input")));
for (const mode of ["format", "minify", "validate"])
  bind("json-" + mode, "json", () => {
    const obj = JSON.parse(val("json-input"));
    show(
      "json",
      mode === "validate"
        ? "Valid JSON."
        : JSON.stringify(
            obj,
            null,
            mode === "minify"
              ? 0
              : val("json-indent") === "tab"
                ? "\t"
                : Number(val("json-indent")),
          ),
    );
  });
bind("base64-encode", "base64", () =>
  show("base64", base64Encode(val("base64-input"))),
);
bind("base64-decode", "base64", () =>
  show("base64", base64Decode(val("base64-input"))),
);
bind("jwt-decode", "jwt", () => show("jwt", decodeJWT(val("jwt-input"))));
bind("regex-test", "regex", async () => {
  if (val("regex-input").length > 200000)
    throw Error("Test text is limited to 200,000 characters.");
  const result = await new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./regex-worker.js", import.meta.url));
    const t = setTimeout(() => {
      worker.terminate();
      reject(
        Error(
          "Pattern timed out after 1.5 seconds. Simplify it and try again.",
        ),
      );
    }, 1500);
    worker.onmessage = (e) => {
      clearTimeout(t);
      worker.terminate();
      e.data.error ? reject(Error(e.data.error)) : resolve(e.data);
    };
    worker.onerror = () => {
      clearTimeout(t);
      worker.terminate();
      reject(
        Error(
          "RegEx worker could not start. Open this site through HTTPS or localhost.",
        ),
      );
    };
    worker.postMessage({
      pattern: val("regex-pattern"),
      flags: val("regex-flags"),
      text: val("regex-input"),
    });
  });
  show("regex", result);
});
bind("yaml-convert", "yaml", () => {
  const yaml = dependency("jsyaml"),
    source = val("yaml-input");
  if (source.length > 200000)
    throw Error("YAML is limited to 200,000 characters.");
  if (/^\s*\?/m.test(source))
    throw Error("Complex YAML mapping keys are not supported.");
  const obj = yaml.load(source, { schema: yaml.JSON_SCHEMA, json: false });
  let count = 0;
  const result = JSON.stringify(
    obj === undefined ? null : obj,
    (k, v) => {
      if (++count > 50000)
        throw Error("YAML expands beyond the 50,000-value limit.");
      if (typeof v === "number" && !Number.isFinite(v))
        throw Error("Infinity and NaN cannot be represented in JSON.");
      return v;
    },
    2,
  );
  show("yaml", result);
});
bind("password-generate", "password", () => {
  const groups = [
    ["upper", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"],
    ["lower", "abcdefghijklmnopqrstuvwxyz"],
    ["number", "0123456789"],
    ["symbol", "!@#$%^&*()-_=+[]{}:,.?"],
  ]
    .filter(([k]) => $("pw-" + k).checked)
    .map((x) => x[1]);
  show("password", password(integer("password-length", 4, 256), groups));
});
bind("token-generate", "token", () =>
  show("token", token(integer("token-bytes", 16, 512), val("token-encoding"))),
);
bind("hash-generate", "hash", async () => {
  let result;
  if (val("hash-algorithm") === "MD5")
    result = dependency("md5")(val("hash-input"));
  else {
    if (!crypto.subtle) throw Error("SHA-256 requires HTTPS or localhost.");
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(val("hash-input")),
    );
    result = [...new Uint8Array(digest)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  show("hash", result);
});
function canvasBlob(canvas) {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(Error("Could not export image."))),
      "image/png",
    ),
  );
}
async function loadImage(blob) {
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(Error("Could not decode this image."));
      img.src = url;
    });
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}
let cropImage = null,
  cropVersion = 0;
function cropRect() {
  return {
    x: Number(val("crop-x")),
    y: Number(val("crop-y")),
    w: Number(val("crop-width")),
    h: Number(val("crop-height")),
  };
}
function drawCrop() {
  if (!cropImage) return;
  const c = $("crop-canvas"),
    ctx = c.getContext("2d"),
    scale = c.width / cropImage.naturalWidth;
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.drawImage(cropImage, 0, 0, c.width, c.height);
  const r = cropRect();
  ctx.fillStyle = "#10204c88";
  ctx.beginPath();
  ctx.rect(0, 0, c.width, c.height);
  ctx.rect(r.x * scale, r.y * scale, r.w * scale, r.h * scale);
  ctx.fill("evenodd");
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.strokeRect(r.x * scale, r.y * scale, r.w * scale, r.h * scale);
}
$("crop-file").onchange = async () => {
  const version = ++cropVersion;
  cropImage = null;
  $("crop-canvas").hidden = true;
  clearOutput("crop");
  $("crop-error").textContent = "";
  try {
    const f = $("crop-file").files[0];
    if (!f) return;
    if (f.size > 20 * 1024 * 1024)
      throw Error("Choose an image smaller than 20 MB.");
    const img = await loadImage(f);
    if (version !== cropVersion) return;
    if (img.naturalWidth * img.naturalHeight > 24000000)
      throw Error("Image exceeds 24 megapixels.");
    cropImage = img;
    const c = $("crop-canvas"),
      s = Math.min(1, 1000 / img.naturalWidth, 420 / img.naturalHeight);
    c.width = Math.round(img.naturalWidth * s);
    c.height = Math.round(img.naturalHeight * s);
    c.hidden = false;
    $("crop-x").value = $("crop-y").value = 0;
    $("crop-width").value = img.naturalWidth;
    $("crop-height").value = img.naturalHeight;
    drawCrop();
  } catch (e) {
    if (version === cropVersion) $("crop-error").textContent = e.message;
  }
};
for (const k of ["x", "y", "width", "height"])
  $("crop-" + k).oninput = drawCrop;
let dragStart;
function imagePoint(e) {
  const r = $("crop-canvas").getBoundingClientRect();
  return {
    x: Math.round(
      Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) *
        cropImage.naturalWidth,
    ),
    y: Math.round(
      Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)) *
        cropImage.naturalHeight,
    ),
  };
}
$("crop-canvas").onpointerdown = (e) => {
  if (!cropImage) return;
  dragStart = imagePoint(e);
  e.target.setPointerCapture(e.pointerId);
};
$("crop-canvas").onpointermove = (e) => {
  if (!dragStart) return;
  const p = imagePoint(e);
  $("crop-x").value = Math.min(p.x, dragStart.x);
  $("crop-y").value = Math.min(p.y, dragStart.y);
  $("crop-width").value = Math.max(1, Math.abs(p.x - dragStart.x));
  $("crop-height").value = Math.max(1, Math.abs(p.y - dragStart.y));
  drawCrop();
};
$("crop-canvas").onpointerup = $("crop-canvas").onpointercancel = () => {
  dragStart = null;
};
bind("crop-export", "crop", async () => {
  if (!cropImage) throw Error("Choose an image first.");
  const x = integer("crop-x", 0, cropImage.naturalWidth - 1),
    y = integer("crop-y", 0, cropImage.naturalHeight - 1),
    w = integer("crop-width", 1, cropImage.naturalWidth),
    h = integer("crop-height", 1, cropImage.naturalHeight);
  if (x + w > cropImage.naturalWidth || y + h > cropImage.naturalHeight)
    throw Error("Crop extends beyond the image.");
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  c.getContext("2d").drawImage(cropImage, x, y, w, h, 0, 0, w, h);
  const blob = await canvasBlob(c);
  fileOutput(
    "crop",
    blob,
    "cropped-image.png",
    `${w} × ${h} px · ${(blob.size / 1024).toFixed(1)} KB`,
    true,
  );
});
function cleanSVG(source) {
  if (source.length > 1000000) throw Error("SVG is limited to 1 MB.");
  if (/<!DOCTYPE|<!ENTITY/i.test(source))
    throw Error("SVG document types and entities are not supported.");
  const doc = new DOMParser().parseFromString(source, "image/svg+xml");
  if (
    doc.querySelector("parsererror") ||
    doc.documentElement.localName !== "svg"
  )
    throw Error("Invalid SVG markup.");
  const root = doc.documentElement;
  const allowed = new Set(
    "svg g defs style symbol use path rect circle ellipse line polyline polygon text tspan textPath linearGradient radialGradient stop clipPath mask pattern marker title desc".split(
      " ",
    ),
  );
  const unsafeCSS = (s) =>
    /[\\@<>]|(?:https?:|data:|javascript:)/i.test(s) ||
    /url\s*\(/i.test(s.replace(/url\(\s*#[\w:.-]+\s*\)/gi, ""));
  for (const el of [...root.querySelectorAll("*")])
    if (
      !allowed.has(el.localName) ||
      (el.localName === "style" && unsafeCSS(el.textContent))
    )
      el.remove();
  for (const el of [root, ...root.querySelectorAll("*")])
    for (const a of [...el.attributes]) {
      const n = a.localName.toLowerCase(),
        v = a.value;
      if (
        n.startsWith("on") ||
        (n === "style" && unsafeCSS(v)) ||
        n === "base" ||
        (n === "href" && !/^#[\w:.-]+$/.test(v)) ||
        (/javascript:|data:|https?:|\/\//i.test(v) && n !== "xmlns") ||
        (/url\s*\(/i.test(v) && !/^url\(\s*#[\w:.-]+\s*\)$/.test(v))
      )
        el.removeAttributeNode(a);
    }
  root.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  return { doc, root };
}
$("svg-file").onchange = async () => {
  try {
    const f = $("svg-file").files[0];
    if (!f) return;
    if (f.size > 1000000) throw Error("SVG is limited to 1 MB.");
    $("svg-input").value = await f.text();
    $("svg-error").textContent = "";
  } catch (e) {
    $("svg-error").textContent = e.message;
  }
};
bind("svg-convert", "svg", async () => {
  const w = integer("svg-width", 1, 4096),
    h = integer("svg-height", 1, 4096);
  if (w * h > 4000000)
    throw Error("Use dimensions totaling at most 4 megapixels.");
  const { root } = cleanSVG(val("svg-input"));
  root.setAttribute("width", w);
  root.setAttribute("height", h);
  const image = await loadImage(
    new Blob([new XMLSerializer().serializeToString(root)], {
      type: "image/svg+xml",
    }),
  );
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  ctx.drawImage(image, 0, 0, w, h);
  const original = await canvasBlob(c),
    pixels = ctx.getImageData(0, 0, w, h),
    colors = Number(val("svg-colors"));
  await new Promise((r) => setTimeout(r, 20));
  const packed = new Blob(
    [dependency("UPNG").encode([pixels.data.buffer], w, h, colors)],
    { type: "image/png" },
  );
  const blob = packed.size < original.size ? packed : original;
  fileOutput(
    "svg",
    blob,
    "converted.png",
    `${w} × ${h} px · ${(blob.size / 1024).toFixed(1)} KB\n${((1 - blob.size / original.size) * 100).toFixed(1)}% smaller than the browser’s PNG export.${colors && blob === packed ? " Color quantization is lossy." : ""}`,
    true,
  );
});
bind("qr-generate", "qr", async () => {
  const content = val("qr-input");
  if (!content) throw Error("Enter text or a URL.");
  const qrFactory = dependency("qrcode");
  qrFactory.stringToBytes = qrFactory.stringToBytesFuncs["UTF-8"];
  const qr = qrFactory(0, val("qr-level"));
  qr.addData(content, "Byte");
  qr.make();
  const scale = integer("qr-scale", 2, 16),
    n = qr.getModuleCount(),
    size = (n + 8) * scale,
    c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#000";
  for (let r = 0; r < n; r++)
    for (let col = 0; col < n; col++)
      if (qr.isDark(r, col))
        ctx.fillRect((col + 4) * scale, (r + 4) * scale, scale, scale);
  fileOutput(
    "qr",
    await canvasBlob(c),
    "qr-code.png",
    `${size} × ${size} px · ${n} × ${n} modules`,
    true,
  );
});
let pdfFiles = [];
function renderPDFs() {
  const box = $("pdf-order");
  box.replaceChildren();
  pdfFiles.forEach((file, i) => {
    const row = document.createElement("div");
    row.className = "row";
    row.style.marginBottom = "8px";
    const name = document.createElement("span");
    name.style.flex = "1";
    name.textContent = `${i + 1}. ${file.name}`;
    row.append(name);
    for (const [label, delta] of [
      ["↑", -1],
      ["↓", 1],
    ]) {
      const b = document.createElement("button");
      b.textContent = label;
      b.setAttribute(
        "aria-label",
        `Move ${file.name} ${delta < 0 ? "up" : "down"}`,
      );
      b.disabled = i + delta < 0 || i + delta >= pdfFiles.length;
      b.onclick = () => {
        [pdfFiles[i], pdfFiles[i + delta]] = [pdfFiles[i + delta], pdfFiles[i]];
        renderPDFs();
      };
      row.append(b);
    }
    box.append(row);
  });
}
$("pdf-files").onchange = () => {
  pdfFiles = [...$("pdf-files").files];
  clearOutput("pdf");
  renderPDFs();
};
function checkPDF() {
  if (!pdfFiles.length) throw Error("Choose at least one PDF.");
  if (pdfFiles.reduce((n, f) => n + f.size, 0) > 50 * 1024 * 1024)
    throw Error("Total PDF input exceeds 50 MB.");
  return dependency("PDFLib").PDFDocument;
}
async function loadPDF(Doc, file) {
  try {
    return await Doc.load(await file.arrayBuffer());
  } catch (e) {
    throw Error(
      `Cannot open ${file.name}. It may be encrypted or damaged. ${e.message}`,
    );
  }
}
// Serialize PDF operations so file outputs cannot replace each other mid-operation.
for (const operation of ["merge", "extract", "split"])
  bind("pdf-" + operation, "pdf", async () => {
    const buttons = ["pdf-merge", "pdf-extract", "pdf-split"].map($);
    buttons.forEach((b) => (b.disabled = true));
    try {
      const Doc = checkPDF(),
        files = [...pdfFiles];
      if (operation === "merge") {
        const target = await Doc.create();
        for (const f of files) {
          const doc = await loadPDF(Doc, f);
          for (const page of await target.copyPages(doc, doc.getPageIndices()))
            target.addPage(page);
        }
        fileOutput(
          "pdf",
          new Blob([await target.save()], { type: "application/pdf" }),
          "merged.pdf",
          `Merged ${files.length} files · ${target.getPageCount()} pages. Copy copies the PDF as a Base64 data URL.`,
        );
      } else {
        const source = await loadPDF(Doc, files[0]);
        if (operation === "extract") {
          const indices = pageRanges(val("pdf-pages"), source.getPageCount()),
            target = await Doc.create();
          for (const page of await target.copyPages(source, indices))
            target.addPage(page);
          fileOutput(
            "pdf",
            new Blob([await target.save()], { type: "application/pdf" }),
            "extracted.pdf",
            `Extracted ${indices.length} pages. Copy copies the PDF as a Base64 data URL.`,
          );
        } else {
          if (source.getPageCount() > 100)
            throw Error(
              "Split supports up to 100 pages. Extract a smaller range first.",
            );
          clearOutput("pdf");
          const names = [];
          for (const i of source.getPageIndices()) {
            const target = await Doc.create();
            const [page] = await target.copyPages(source, [i]);
            target.addPage(page);
            const blob = new Blob([await target.save()], {
                type: "application/pdf",
              }),
              name = `page-${i + 1}.pdf`;
            names.push(name);
            const row = document.createElement("div");
            row.className = "output-head";
            const a = document.createElement("a");
            a.href = ownURL("pdf", blob);
            a.download = name;
            a.textContent = "Download " + name;
            const b = document.createElement("button");
            b.className = "copy";
            b.textContent = "Copy";
            b.setAttribute("aria-label", "Copy " + name + " as Base64");
            b.onclick = async () => {
              try {
                toast(await copyBlob(blob));
              } catch (e) {
                toast(e.message);
              }
            };
            row.append(a, b);
            $("pdf-downloads").append(row);
          }
          const text =
            `Split into ${names.length} files. Each page’s Copy button copies its Base64 data URL.\n` +
            names.join("\n");
          $("pdf-result").textContent = text;
          outputs.set("pdf", { text });
        }
      }
    } finally {
      buttons.forEach((b) => (b.disabled = false));
    }
  });
async function fetchJSON(url) {
  const controller = new AbortController(),
    timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      credentials: "omit",
      referrerPolicy: "no-referrer",
    });
    if (!res.ok)
      throw Error(
        "Service returned HTTP " +
          res.status +
          (res.status === 404 ? " (record not found)." : "."),
      );
    return await res.json();
  } catch (e) {
    if (e.name === "AbortError")
      throw Error("The request timed out. Try again.");
    if (e instanceof TypeError)
      throw Error(
        "Could not reach this service. It may be offline, rate-limited, or blocking browser requests.",
      );
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}
for (const mode of ["dns", "ip", "whois"])
  bind("network-" + mode, "network", async () => {
    const buttons = ["network-dns", "network-ip", "network-whois"].map($);
    buttons.forEach((b) => (b.disabled = true));
    try {
      clearOutput("network");
      $("network-result").textContent = "Looking up…";
      if (mode === "ip")
        show("network", await fetchJSON("https://api64.ipify.org?format=json"));
      else {
        const domain = domainName(val("network-domain"));
        if (mode === "dns")
          show(
            "network",
            await fetchJSON(
              "https://dns.google/resolve?name=" +
                encodeURIComponent(domain) +
                "&type=" +
                val("network-type"),
            ),
          );
        else {
          try {
            show(
              "network",
              await fetchJSON(
                "https://rdap.org/domain/" + encodeURIComponent(domain),
              ),
            );
          } catch (e) {
            show(
              "network",
              e.message + "\nOpen the registration lookup below to continue.",
            );
            const a = document.createElement("a");
            a.href =
              "https://lookup.icann.org/en/lookup?name=" +
              encodeURIComponent(domain);
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.className = "download";
            a.textContent = "Open ICANN lookup";
            $("network-downloads").append(a);
          }
        }
      }
    } finally {
      buttons.forEach((b) => (b.disabled = false));
    }
  });
