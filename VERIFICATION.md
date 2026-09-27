# Verification notes

Verified during development:

- JavaScript syntax checks and five grouped core regression tests passed.
- Chromium browser checks passed across all 17 workspaces.
- Tested a Unicode Base64 round trip; camelCase and clipboard copying; JSON valid/error states; JWT decoding; YAML conversion and cyclic-input errors.
- Tested RegEx matching and termination of a pathological expression after the timeout.
- Checked MD5 and SHA-256 against known `abc` digest values.
- Generated and previewed cropped PNGs, optimized SVG-to-PNG files, and Unicode QR codes.
- Created two test PDFs, merged them, reloaded the output to verify its four pages, extracted selected pages, and split into two separate files.
- Tested timer completion, dark-mode switching, and horizontal overflow at a 390-pixel mobile viewport.
- Inspected desktop and mobile screenshots.
- Tested DNS/IP result rendering and RDAP failure fallback using simulated network responses. Live third-party availability and CORS behavior are not guaranteed by these tests.

The core regression tests are included in `tests/core.test.js`. Run `npm test` with modern Node.js. Browser checks used a temporary Playwright harness; Playwright is not a runtime dependency of this site.
