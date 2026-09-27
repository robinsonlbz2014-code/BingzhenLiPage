# Utility Workbench

A responsive, static utility website with 17 tool workspaces, light/dark mode, copy buttons on the right of every output, and downloadable file results. Runs on GitHub Pages with no build step, API keys, or application backend.

## Publish with GitHub Pages

1. Unzip this project.
2. Create a GitHub repository (or use an existing website repository).
3. Upload **the contents of `utility-workbench/`** into the repository root. `index.html` must be at the root. Keep the entire `vendor/` folder and `regex-worker.js`.
4. In the repository, open **Settings → Pages**. Choose **Deploy from a branch**, select your branch (usually `main`) and **/(root)**, then save.
5. Open the HTTPS website address shown by GitHub Pages after deployment completes.

All paths are relative, so both `username.github.io` and `username.github.io/repository-name/` work. GitHub Pages availability can depend on your repository visibility and GitHub plan.

## Local preview

Run from inside the project folder:

```sh
python -m http.server 8000
```

Open `http://localhost:8000`. On Windows, `py -m http.server 8000` also works if Python is installed. VS Code Live Server is another option. Do not double-click `index.html`: ES modules, workers, the clipboard, and Web Crypto require a web origin; HTTPS or localhost is recommended.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page shell and bundled library imports |
| `styles.css` | Responsive layout and light/dark theme |
| `app.js` | Tool interfaces and browser operations |
| `core.js` | Calculator parser, text operations, randomness, page ranges |
| `regex-worker.js` | Isolated RegEx execution with caller-enforced timeout |
| `vendor/` | Pinned third-party libraries and notices; upload this folder |
| `tests/core.test.js` | Pure-function regression tests |
| `package.json` | Optional `npm test` command; no install/build needed |
| `.nojekyll` | Disables Jekyll processing on GitHub Pages |

## Included tools

- Scientific calculator: arithmetic, parentheses, powers, factorial, percent (divide by 100), trigonometry and inverse trig, logarithms, square root, constants, degree/radian modes. Uses a restricted parser, not `eval`.
- Timer: hours/minutes/seconds, pause/resume/reset, completion alert and best-effort sound. Deadline-based to avoid accumulating interval drift.
- Word counter: Unicode-aware word segmentation when supported, character count, lines, paragraphs, estimated reading time.
- Text case: uppercase, lowercase, camelCase.
- JSON: validate, pretty-print with two/four spaces or tabs, minify.
- Base64: UTF-8 text encode/decode.
- JWT: decode Base64URL header/payload and inspect timestamps; **does not verify signatures**. Encrypted five-part JWE tokens are not supported.
- RegEx: JavaScript flags, indexed matches, capture groups, named groups. Dedicated worker, 1.5-second timeout, 1,000-match cap.
- YAML to JSON: one document, JSON schema, no custom tags. Empty document becomes null. Rejects cyclic structures, excessive expansion, and non-finite numbers. YAML complex mapping keys are unsupported.
- Passwords: Web Crypto randomness, rejection sampling, selected character groups guaranteed to appear. No secret persistence.
- Tokens: 16–512 random bytes, hex or unpadded Base64URL; not signed JWTs.
- Hashes: MD5 and SHA-256 of UTF-8 text. MD5 is a legacy checksum, not secure hashing. Plain hashes are not password-storage algorithms.
- Image cropper: file preview, pointer/touch selection, exact pixel coordinates, PNG export. GIFs become a still frame; output is not animated.
- SVG to PNG: sized rasterization, lossless PNG encoding or optional lossy 256/64/16-color quantization. Keeps the smaller of the optimized PNG and ordinary browser PNG. External resources and unsafe/unsupported SVG constructs are removed, so complex SVGs may render differently.
- QR code: Unicode text, correction-level options, crisp integer module scaling, four-module quiet border, PNG export.
- PDF: merge with reorder buttons, extract ranges in specified order (duplicates allowed), split first file into individual downloadable pages. No server uploads.
- Network: Google DNS-over-HTTPS, ipify public IP lookup, RDAP domain registration lookup with ICANN fallback link.

## Copy behavior

Text outputs copy as text. PNG outputs copy as an image when the browser supports `ClipboardItem`; otherwise they copy as a Base64 data URL. PDFs copy as Base64 data URLs because portable binary-PDF clipboard support is not available. Each split PDF page has its own right-side copy button; the overall split result copies its file list. Download buttons save the actual PNG/PDF bytes. Clipboard access may require HTTPS, a user gesture, and browser permission.

## Privacy and limitations

The site has no analytics, accounts, server storage, remote fonts, or runtime CDN dependencies. Bundled libraries are served from your own website. Local tools process inputs and files in browser memory. Only the theme preference is stored in `localStorage`; secrets and file contents are not persisted. Clipboard contents remain on the operating system clipboard after copying.

Network buttons explicitly contact external services and send the requested domain where appropriate. They expose the visitor's IP to the service. RDAP follows registry redirects. Availability, rate limits, CORS policies, redaction, and provider changes can affect results. The public IP is the internet-facing address, which may belong to a VPN/router/proxy; browsers cannot freely discover all LAN addresses. RDAP requires a registered domain rather than an arbitrary subdomain. DNS JSON includes the provider's `Status` code; status 3 means NXDOMAIN and an empty `Answer` can mean no record for that type.

The network tools use these endpoints, all centralized near the bottom of `app.js`:

- `https://dns.google/resolve?name=...&type=...`
- `https://api64.ipify.org?format=json`
- `https://rdap.org/domain/...`
- fallback: `https://lookup.icann.org/en/lookup?name=...`

Limits protect browser memory: 20 MB / 24 MP raster image input; 1 MB / 4 MP SVG conversion; 50 MB total PDF input; 100 pages per PDF split; 200,000 characters for YAML/RegEx test text. Large files may still take time on low-memory devices. PDF forms, bookmarks, attachments, annotations, and digital signatures are not guaranteed to survive page copying. Encrypted PDFs are rejected.

This is a browser utility, not a precision mathematics system: calculations and JSON numeric parsing use JavaScript floating-point numbers. For exact large integers in JSON, use quoted strings. Closing/reloading the tab resets the timer and tool contents. Device sleep/background throttling can delay timer sound.

## Customize

- Change the name in `index.html`, the `document.title` assignment in `app.js`, and the footer.
- Change `--accent`, `--bg`, and other CSS variables at the top of `styles.css` for both themes.
- Tool labels, descriptions, groups, and UI markup live at the beginning of `app.js`.
- Do not put private API keys in these files: GitHub Pages sends JavaScript source to visitors.

## Verification

Run `npm test` or `node --test tests/core.test.js` with a modern Node.js version. No dependency installation is needed for these tests.

## Third-party libraries

Pinned versions are bundled so deployed tools do not need a CDN:

| Library | Version | Use |
| --- | --- | --- |
| js-yaml | 4.1.1 | YAML parser |
| blueimp-md5 | 2.19.0 | MD5 |
| pdf-lib | 1.17.1 | PDF editing |
| qrcode-generator | 1.4.4 | QR encoding |
| UPNG.js | 2.1.0 | PNG compression and quantization |
| pako | 1.0.11 | UPNG compression dependency |

Keep third-party license notices in `vendor/` when redistributing. Review dependencies before using this as a public production service.

## Reference documentation

- [GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Google DNS JSON API](https://developers.google.com/speed/public-dns/docs/doh/json)
- [ipify](https://www.ipify.org/)
- [RDAP bootstrap service](https://about.rdap.org/)
- [PDFDocument API](https://pdf-lib.js.org/docs/api/classes/pdfdocument)
- [js-yaml](https://github.com/nodeca/js-yaml)
- [UPNG.js](https://github.com/photopea/UPNG.js)
