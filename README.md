# DevVault — Local-First, Privacy-First Developer Productivity Platform

![DevVault](https://img.shields.io/badge/DevVault-v1.0.0-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5_Strict-blue?style=flat-square)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-6.4-purple?style=flat-square)
![Tests](https://img.shields.io/badge/Vitest-113%20passed-brightgreen?style=flat-square)
![Privacy](https://img.shields.io/badge/Privacy-100%25_Browser_Local-success?style=flat-square)

DevVault is a high-performance, privacy-first developer utility suite built with modern React, TypeScript, Tailwind CSS, Monaco Editor, and Dexie IndexedDB. It runs entirely inside your browser session — no tokens, passwords, payloads, or proprietary queries are ever transmitted to external servers.

---

## Key Pillars

1. **Useful First**: Every tool performs real, reliable computations. No mockup inputs, dummy statistics, or dead buttons.
2. **Privacy by Design**: Sensitive cryptographic hashes, HMAC keys, JWT tokens, and regex inputs stay exclusively within your browser's Web Crypto runtime.
3. **Local Workspace**: Save frequently used snippets, organize them into collections, search past activities, and backup/restore workspace data via JSON.
4. **Accessible & Responsive**: Fully responsive across mobile, tablet, and desktop viewports with strict light, dark, and system color modes.

---

## Implemented Tool Catalog

### JSON & Data Utilities
- **JSON Formatter & Beautifier**: Format and validate JSON with customizable 2-space, 4-space, or tab indentation, recursive key sorting (preserving array order), and precise error lines.
- **JSON Validator**: RFC 8259 syntax validation with structural depth metrics, total key counts, and array element metrics.
- **JSON Minifier**: Strips non-essential whitespace while preserving string contents, displaying byte savings and compression ratios.
- **JSON to YAML & YAML to JSON**: Bidirectional converter powered by the standard `yaml` engine with safe parsing and customizable document indentations.
- **JSONPath Explorer**: Interactive evaluator querying structured JSON using JSONPath expressions with live match highlighting and value extraction.

### API & HTTP Utilities
- **URL Parser & Builder**: Parse URLs into protocol, host, port, path, hash, and interactive key-value query parameters with two-way synchronization.
- **HTTP API Client**: Browser-based REST client supporting GET, POST, PUT, PATCH, DELETE, and OPTIONS with custom headers, query params, body editors, and transparent CORS handling.
- **HTTP Header Inspector**: Parse raw response or request headers from curl or network logs, categorize them (Security, Caching, CORS, Content), and run an automated security header audit.

### Cryptography & Security
- **JWT Decoder**: Parse header and payload claims with UTF-8 / emoji support, calculate token expiration relative times, and present security advisory notices.
- **Base64 Encoder / Decoder**: Encode and decode standard UTF-8 strings and binary payloads with standard and URL-safe variants, plus padding toggles.
- **Cryptographic Hash Generator**: Compute SHA-256, SHA-384, and SHA-512 digests via native Web Crypto APIs with Hex and Base64 outputs.
- **HMAC Generator & Verifier**: Generate keyed hash message authentication codes (HMAC-SHA-256/384/512) and perform constant-time signature verification.
- **Password Generator**: CSPRNG unbiased random generation with customizable character pools (uppercase, lowercase, digits, symbols), bulk mode, and Shannon entropy scoring.

### Text & Code Utilities
- **HTML Formatter & Beautifier**: Beautify HTML, XML, and SVG markup with configurable indentation, line wrap width, and standalone Prettier engine.
- **CSS Formatter & Minifier**: Format and minify CSS stylesheets with PostCSS parser, comment stripping, delimiter whitespace collapse, and instant byte savings calculation.
- **JavaScript & TypeScript Formatter**: Format modern ECMAScript and TypeScript code with customizable semicolons, quotes, and indentation rules.
- **Text Diff Checker**: LCS-based line-level diff tool with additions, deletions, side-by-side split view, unified view, and quick swap controls.
- **Text Case Converter**: Real-time transformation across 9 programming casing formats: `camelCase`, `PascalCase`, `snake_case`, `kebab-case`, `CONSTANT_CASE`, `Title Case`, `Sentence case`, `UPPERCASE`, and `lowercase`.
- **Regular Expression Tester**: Real-time regex matching with flags (`g`, `i`, `m`, `s`, `u`), named capture group inspector, string replacement preview, and catastrophic backtracking guards.
- **Markdown Editor & Previewer**: Distraction-free markdown workspace with live sanitized rendering (GitHub Flavored Markdown), reading time estimation, and `.md` file download.

### Generators & Web Tools
- **UUID Generator**: RFC 4122 v4 UUID generator using `crypto.randomUUID()` with single and bulk generation, uppercase toggle, and hyphen toggle.
- **QR Code Generator**: Vector SVG and PNG QR code generation with customizable error correction levels (L, M, Q, H), quiet zone margins, and custom color palettes.
- **Synthetic JSON Generator**: In-browser schema builder supporting UUIDs, full names, emails, roles, numbers, booleans, dates, and countries with 1-100 count fixture export.
- **Color Converter & Contrast Checker**: Real-time conversion across HEX, RGB, and HSL formats with WCAG 2.2 Level AA and AAA relative luminance contrast scoring against arbitrary background surfaces.
- **SQL Formatter**: SQL query beautifier supporting PostgreSQL, MySQL, SQLite, BigQuery, and T-SQL dialects with configurable indentation and keyword casing.

### Time & Scheduling
- **Unix Timestamp Converter**: Epoch seconds and milliseconds conversion to UTC and local times, relative time distance, live ticker, and quick timestamp presets.
- **World Time & Timezone Converter**: Compare datetime across worldwide IANA timezones with live clocks, daylight indicators, and relative offset differences.
- **Cron Expression Helper**: Translate 5-part cron syntax into plain English, inspect individual fields, and compute the next 6 scheduled execution times.

---

## Workspace Persistence Features

DevVault provides client-side database persistence powered by **Dexie (IndexedDB)**:
- **Code Snippets Manager**: Save snippets with title, language, code, tags, and collections.
- **Activity History**: Automatically records recent operations with sensitive data redaction (passwords and secrets are never persisted).
- **Workspace Settings**: Configure default indentation, editor font size, theme preference, and history retention limits.
- **Backup & Restore**: Export full workspace state as a verified JSON backup, with support for both merge and overwrite import modes.

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested on Node.js 20 & 22)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/developer/devvault.git
cd devvault

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` to explore the toolbox.

---

## Scripts & Quality Gates

DevVault adheres to strict automated quality gates:

```bash
# Run TypeScript typecheck across all modules (strict mode)
npm run typecheck

# Run the complete Vitest unit & component test suite (98 tests across 30 suites)
npm run test

# Run tests in watch mode
npm run test:watch

# Create an optimized production build
npm run build

# Preview the production build locally
npm run preview
```

---

## Keyboard Shortcuts

| Shortcut | Description |
|---|---|
| `Ctrl + K` / `Cmd + K` | Open global command palette & search |
| `?` | Open keyboard shortcuts dialog |
| `Ctrl + Shift + T` | Cycle color theme (Light / Dark / System) |
| `Ctrl + Shift + S` | Navigate to Snippets Manager |
| `Ctrl + Shift + H` | Navigate to Activity History |
| `Esc` | Dismiss open dialogs and command palette |

---

## Tech Stack & Architecture

- **Framework**: React 18 with React Router DOM v6
- **Language**: TypeScript 5.5 in strict mode (`noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`)
- **Styling**: Tailwind CSS with CSS variable semantic design tokens
- **Code Editor**: Monaco Editor (`@monaco-editor/react`)
- **Persistence**: Dexie.js (IndexedDB)
- **Testing**: Vitest + React Testing Library + jsdom
- **Bundler**: Vite 6 with dynamic code splitting and asset optimization

---

## Privacy & Security Policy

All data transformations are performed client-side using native Web APIs (`crypto.subtle`, `crypto.getRandomValues`, `Intl`, `TextEncoder`, `TextDecoder`). DevVault has **zero tracking**, **zero telemetry**, and **zero external analytics**. What you build and test stays entirely in your browser.

---

## License

MIT © 2026 DevVault Contributors

