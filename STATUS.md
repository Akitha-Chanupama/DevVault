# DevVault — Implementation Status & Verification Matrix

## Phase Progress

- [x] **Phase 1 — Foundation** (Complete: Vite+React+TS, Semantic Design Tokens, AppShell, Sidebar, Header, Command Palette, Tool Registry, Dashboard, Directory, JSON Formatter preview, 13 Vitest suites passing, clean production build)
- [ ] **Phase 2 — Core Utilities** (Next)
- [ ] **Phase 3 — Workspace** (Pending)
- [ ] **Phase 4 — Advanced Tools** (Pending)
- [ ] **Phase 5 — Production Readiness** (Pending)
- [ ] **Phase 6 — Optional Backend** (Optional / Future)

---

## Tool Verification Matrix

| Tool ID | Name | Priority | Status | Unit Tests | UI Tests | Privacy Mode | Known Limitations |
|---|---|---|---|---|---|---|---|
| `json-formatter` | JSON Formatter & Beautifier | P0 | Available | Passing | Verified | browser-only | Max file size 10MB in browser memory |
| `json-validator` | JSON Validator | P0 | Planned | — | — | browser-only | Syntax validation only (schema validation requires schema) |
| `json-minifier` | JSON Minifier | P0 | Planned | — | — | browser-only | Strip whitespace; valid JSON required |
| `json-to-yaml` | JSON to YAML | P1 | Planned | — | — | browser-only | Complex YAML types map to JSON equivalents |
| `yaml-to-json` | YAML to JSON | P1 | Planned | — | — | browser-only | Safe parsing only, no arbitrary constructors |
| `jsonpath-explorer` | JSONPath Explorer | P1 | Planned | — | — | browser-only | Documented JSONPath standard subset |
| `api-client` | HTTP API Client | P1 | Planned | — | — | browser-only | Subject to browser CORS policy; transparent reporting |
| `header-inspector` | HTTP Header Inspector | P1 | Planned | — | — | browser-only | Header parsing from pasted input |
| `url-parser` | URL Parser & Builder | P0 | Planned | — | — | browser-only | Standard WHATWG URL API |
| `jwt-decoder` | JWT Decoder | P0 | Planned | — | — | browser-only | Decoding only; signature is not verified without key |
| `base64` | Base64 Encoder / Decoder | P0 | Planned | — | — | browser-only | UTF-8 encoded text strings and binary blobs |
| `hash-generator` | Hash Generator | P0 | Planned | — | — | browser-only | Web Crypto SHA-256, 384, 512 |
| `hmac-generator` | HMAC Generator / Verifier | P1 | Planned | — | — | browser-only | Web Crypto constant-time HMAC |
| `password-generator` | Password Generator | P0 | Planned | — | — | browser-only | Web Crypto CSPRNG unbiased selection |
| `diff-checker` | Text Diff Checker | P0 | Planned | — | — | browser-only | Line-level and character diffing |
| `regex-tester` | Regex Tester | P1 | Planned | — | — | browser-only | Safeguards against catastrophic backtracking |
| `markdown-editor` | Markdown Editor & Preview | P1 | Planned | — | — | browser-only | Sanitized HTML preview via rehype/remark |
| `text-case` | Text Case Converter | P0 | Planned | — | — | browser-only | 9 standard programming casing formats |
| `uuid-generator` | UUID Generator | P0 | Planned | — | — | browser-only | UUID v4 using crypto.randomUUID() |
| `qr-generator` | QR Code Generator | P1 | Planned | — | — | browser-only | Standard QR matrix with ECC levels |
| `random-json` | Synthetic JSON Generator | P1 | Planned | — | — | browser-only | In-memory synthetic generator |
| `html-formatter` | HTML Formatter | P1 | Planned | — | — | browser-only | No code evaluation or execution |
| `css-formatter` | CSS Formatter & Minifier | P1 | Planned | — | — | browser-only | CSS stylesheet formatting |
| `js-formatter` | JS Formatter | P1 | Planned | — | — | browser-only | Static formatting without evaluation |
| `color-converter` | Color Converter & Palette | P1 | Planned | — | — | browser-only | HEX/RGB/HSL conversion + WCAG 2.2 contrast |
| `sql-formatter` | SQL Formatter | P1 | Planned | — | — | browser-only | Formats query text; never executes SQL |
| `timestamp-converter` | Unix Timestamp Converter | P0 | Planned | — | — | browser-only | Epoch seconds and milliseconds |
| `timezone-converter` | Timezone Converter | P1 | Planned | — | — | browser-only | IANA timezone database via Intl API |
| `cron-helper` | Cron Expression Helper | P1 | Planned | — | — | browser-only | Standard 5-field cron parsing |
