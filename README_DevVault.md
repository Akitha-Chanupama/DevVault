# DevVault — Developer Productivity Platform

> A local-first, privacy-first developer toolbox designed as a polished, portfolio-quality software product.

**Project type:** Advanced developer-tool web application  
**Primary goal:** Bring frequently used developer utilities into one consistent, fast, reliable workspace.

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Scope and Feature Priorities](#2-scope-and-feature-priorities)
3. [Technology Stack](#3-technology-stack)
4. [User Experience and Visual Design](#4-user-experience-and-visual-design)
5. [Functional Requirements](#5-functional-requirements)
6. [Tool Architecture](#6-tool-architecture-and-extension-system)
7. [Application Architecture](#7-application-architecture)
8. [Project Structure](#8-project-folder-structure)
9. [Local Data Models](#9-local-data-models)
10. [Optional Backend API](#10-api-design-for-optional-backend)
11. [Privacy and Security](#11-privacy-and-security-requirements)
12. [Performance and Reliability](#12-performance-and-reliability)
13. [Testing Strategy](#13-testing-strategy)
14. [Accessibility](#14-accessibility-requirements)
15. [Implementation Phases](#15-implementation-phases)
16. [Local Setup](#16-exact-local-setup-instructions)
17. [Environment Configuration](#17-environment-configuration)
18. [Import and Export](#18-import-export-and-backup)
19. [Documentation](#19-documentation-requirements)
20. [Acceptance Criteria](#20-acceptance-criteria)
21. [Visual Quality Gate](#21-visual-quality-review-and-design-acceptance-gate)
22. [AI Coding Agent Instructions](#22-instructions-to-the-ai-coding-agent)

---

# 1. Product Overview

## 1.1 Product Vision

DevVault is a modern developer productivity workspace that brings frequently used development utilities into one consistent interface.

Developers should be able to format and validate data, inspect tokens, test APIs, compare text, generate identifiers, work with regular expressions, format SQL, and save reusable snippets without switching between many unrelated websites.

DevVault must be a real working product, not a static dashboard or a collection of mock screens.

## 1.2 Product Principles

1. **Useful first:** Every published tool must perform its advertised function correctly.
2. **Privacy first:** Process data locally in the browser whenever practical.
3. **Fast:** Keep navigation, tool loading, editing, and transformations responsive.
4. **Consistent:** Tools share common editor, input, output, error, copy, download, and reset patterns.
5. **Accessible:** Keyboard navigation, visible focus, semantic controls, and sufficient contrast are required.
6. **Extensible:** New tools should be addable through a documented tool registry and shared components.
7. **Honest:** Do not show fabricated analytics, fake history, non-functional controls, or simulated integrations as if they were real.

## 1.3 Target Users

- Frontend and backend developers.
- Software engineering students.
- QA engineers and testers.
- DevOps and API developers.
- Developers who frequently inspect, transform, or generate technical data.

## 1.4 Initial Release Scope

The first complete release should include:

- Responsive application shell and dashboard.
- Searchable tool directory with categories.
- Working core utilities.
- Favorites and recently used tools.
- Local history with user controls.
- Snippet and collection management.
- Settings and privacy controls.
- Keyboard shortcuts.
- Light, dark, and system themes.
- Documentation, tests, and local setup.

Advanced server-backed features should remain optional and must not block the core local-first application.

---

# 2. Scope and Feature Priorities

Use these priority definitions:

- **P0 — Release blocker:** Required for the first usable release.
- **P1 — Important:** Required for a complete first public release.
- **P2 — Later enhancement:** Implement after P0/P1 are stable.

## 2.1 Tool Catalogue

| Category | Tool | Priority | Processing |
|---|---|---:|---|
| JSON & Data | JSON Formatter / Beautifier | P0 | Browser |
| JSON & Data | JSON Validator | P0 | Browser |
| JSON & Data | JSON Minifier | P0 | Browser |
| JSON & Data | JSON to YAML | P1 | Browser |
| JSON & Data | YAML to JSON | P1 | Browser |
| JSON & Data | JSONPath Explorer | P1 | Browser |
| API & HTTP | HTTP API Client | P1 | Browser, direct requests |
| API & HTTP | HTTP Header Inspector | P1 | Browser |
| API & HTTP | URL Parser | P0 | Browser |
| Security | JWT Decoder | P0 | Browser |
| Security | Base64 Encode / Decode | P0 | Browser |
| Security | Hash Generator | P0 | Browser |
| Security | HMAC Generator / Verifier | P1 | Browser |
| Security | Password Generator | P0 | Browser |
| Text & Code | Text Diff Checker | P0 | Browser |
| Text & Code | Regex Tester | P1 | Browser |
| Text & Code | Markdown Editor / Preview | P1 | Browser |
| Text & Code | Text Case Converter | P0 | Browser |
| Generators | UUID Generator | P0 | Browser |
| Generators | QR Code Generator | P1 | Browser |
| Generators | Random JSON Data Generator | P1 | Browser |
| Web Development | HTML Formatter | P1 | Browser |
| Web Development | CSS Formatter / Minifier | P1 | Browser |
| Web Development | JavaScript Formatter / Minifier | P1 | Browser |
| Web Development | Color Converter / Palette | P1 | Browser |
| Database | SQL Formatter | P1 | Browser |
| Database | SQL Schema Visualizer | P2 | Browser |
| Network | IP Information Lookup | P2 | External service, opt-in |
| Network | DNS Lookup | P2 | Backend or external service |
| Time & Date | Unix Timestamp Converter | P0 | Browser |
| Time & Date | Timezone Converter | P1 | Browser |
| Time & Date | Cron Expression Helper | P1 | Browser |
| Workspace | Snippet Manager | P0 | Local |
| Workspace | Favorites | P0 | Local |
| Workspace | Tool History | P0 | Local |
| Workspace | Collections | P1 | Local |

Do not show tools as available until their functionality is implemented and tested. Planned tools may appear in a clearly labelled roadmap section, but must not have misleading active controls.

---

# 3. Technology Stack

## 3.1 Frontend

| Concern | Technology | Reason |
|---|---|---|
| Framework | React | Component-driven application |
| Build tool | Vite | Fast development and production builds |
| Language | TypeScript, strict mode | Safer, maintainable code |
| Styling | Tailwind CSS | Consistent responsive design |
| UI primitives | shadcn/ui + Radix UI | Accessible, composable controls |
| Icons | Lucide React | Consistent iconography |
| Routing | React Router | Tool-specific URLs and navigation |
| State | Zustand | Small, modular client state |
| Server state | TanStack Query | Use only for actual backend data |
| Code editor | Monaco Editor | Syntax highlighting and editing |
| Local persistence | IndexedDB via Dexie | Structured browser storage |
| Forms | React Hook Form + Zod | Validated forms |
| Charts | Recharts | Only for meaningful, real metrics |
| Markdown | React Markdown | Preview user-authored Markdown |
| Testing | Vitest + Testing Library + Playwright | Unit, component, and end-to-end tests |

Use current stable compatible package versions at implementation time. Pin versions in the lockfile.

## 3.2 Optional Backend

The core product must work without a backend. Add a backend only for features that require server-side capabilities.

| Concern | Technology |
|---|---|
| API | Python FastAPI |
| Database | PostgreSQL |
| ORM / migrations | SQLAlchemy 2 + Alembic |
| Validation | Pydantic |
| Authentication | Optional secure session-based or token-based implementation |
| Background jobs | Optional Redis and worker, only when justified |
| Containerization | Docker Compose |

Potential backend capabilities in later releases:

- Optional account-based synchronization.
- Shareable collections with access controls.
- Server-side DNS lookup.
- User-managed cloud workspaces.
- Team administration.

Do not build an elaborate backend merely to store data that can safely remain local.

## 3.3 Architecture Decision

Start with a **frontend-first modular monolith**.

Keep utility logic independent from React components. The UI calls typed tool functions through a consistent interface. Browser-only tools must not require API calls.

---

# 4. User Experience and Visual Design

## 4.1 Design Direction

Create a premium, modern developer application.

The visual language should feel focused, technical, calm, and polished rather than flashy.

Quality references for interaction patterns:

- Linear
- Vercel
- Raycast
- Modern IDEs
- Premium SaaS developer platforms

Do not copy their branding or layouts directly.

**DevVault must not look like a generic admin dashboard or a basic collection of utility cards.** The goal is a developer product that looks and feels like an established commercial SaaS application.

## 4.2 Mandatory Theme Support

Light mode, dark mode, and system mode are all mandatory requirements for the initial release.

Implement a theme selector with:

- Light
- Dark
- System

System mode must automatically follow the operating system's preferred color scheme.

Requirements:

1. Theme switching must happen instantly without a page reload.
2. Persist the selected preference across refreshes and browser sessions.
3. System mode must respond to operating system theme changes.
4. Prevent incorrect-theme flashing during initial application load.
5. Every component must support both light and dark themes.
6. Never implement light mode by simply inverting dark mode colors.
7. Both themes must receive equal visual attention and refinement.

The theme must apply consistently to:

- Application background and surfaces.
- Sidebar and header.
- Dashboard and tool pages.
- Code editors and syntax highlighting.
- Inputs and textareas.
- Buttons and controls.
- Dropdowns, dialogs, popovers, and tooltips.
- Toast notifications.
- Tables and tabs.
- Empty, loading, and error states.
- Command palette and settings.

Monaco Editor must also change its theme correctly.

## 4.3 Theme Tokens

Use CSS variables and semantic tokens rather than hardcoding colors throughout components.

Suggested dark palette:

| Token | Suggested value |
|---|---|
| App background | `#0B0D12` |
| Main surface | `#11151D` |
| Elevated surface | `#171D27` |
| Subtle border | `#252D3A` |
| Primary text | `#E8EDF5` |
| Secondary text | `#9AA6B7` |
| Muted text | `#687487` |
| Primary accent | `#4F8CFF` |
| Secondary accent | `#27C2D1` |
| Success | `#35B879` |
| Warning | `#E6AA48` |
| Error | `#EF6464` |

Suggested light palette:

| Token | Suggested value |
|---|---|
| App background | `#F7F8FA` |
| Main surface | `#FFFFFF` |
| Elevated surface | `#F0F2F5` |
| Subtle border | `#E2E6EC` |
| Primary text | `#171B24` |
| Secondary text | `#596273` |
| Muted text | `#8992A1` |
| Primary accent | `#326DE6` |
| Secondary accent | `#159AAA` |
| Success | `#168653` |
| Warning | `#A96A12` |
| Error | `#D83C48` |

These are starting values. Validate contrast and adjust where required.

Create semantic variables such as:

- `--background`
- `--foreground`
- `--surface`
- `--surface-elevated`
- `--muted`
- `--muted-foreground`
- `--border`
- `--input`
- `--primary`
- `--primary-foreground`
- `--secondary`
- `--accent`
- `--success`
- `--warning`
- `--destructive`
- `--ring`

All components must consume semantic tokens. Do not scatter hardcoded theme-specific colors throughout the application.

## 4.4 Typography

Use a professional typography system.

Suggested fonts:

- Inter
- Geist
- IBM Plex Sans
- JetBrains Mono for code and technical values

Use a clear hierarchy:

- Page headings: strong but not oversized.
- Section headings: consistent and readable.
- Body text: comfortable line height.
- Secondary labels: muted but readable.
- Code: monospaced and properly spaced.

Avoid excessive font sizes, unnecessary uppercase labels, and inconsistent font weights.

## 4.5 Layout

Desktop application shell:

- Collapsible left sidebar, approximately 250–270 px expanded.
- Top header with global search, command palette trigger, theme/settings access, and optional account control.
- Main content area with consistent max-width and spacing.
- Tool workspace with editor panels and a compact action toolbar.
- Optional right-side help/details panel for complex tools.

Mobile layout:

- Sidebar becomes a drawer or compact navigation.
- Tool panels stack vertically.
- Actions remain reachable without horizontal scrolling.
- Editors have sensible minimum heights and touch-friendly controls.
- Important actions must not disappear on small screens.

## 4.6 Navigation

Sidebar groups:

1. Overview
2. All Tools
3. JSON & Data
4. API & HTTP
5. Security
6. Text & Code
7. Generators
8. Web Development
9. Database
10. Network
11. Time & Date
12. Workspace
13. Settings

Only show categories with available tools. Clearly distinguish implemented tools from planned features.

## 4.7 Dashboard

The dashboard should include:

- Welcome heading and short product description.
- Global tool search.
- Favorite tools.
- Recently used tools.
- Browse by category.
- Quick action tiles for common tools.
- Optional usage summary based only on locally recorded events.
- Helpful keyboard shortcut hints.

Do not fabricate counts, usage graphs, or user activity. Empty states should explain how to populate each section.

## 4.8 Tool Page Template

Every tool should follow a shared structure:

1. Breadcrumb and tool title.
2. One-sentence explanation.
3. Favorite toggle.
4. Input area or editor.
5. Primary action, where needed.
6. Output area.
7. Copy, download, clear, and reset actions as applicable.
8. Validation messages and error states.
9. Short usage/help section.
10. Privacy note when relevant.

For live tools, clearly label that processing occurs as the user types. Debounce expensive operations.

## 4.9 Interaction Quality

- Provide visible loading states for genuinely asynchronous work.
- Use toast messages for completed copy/save/download actions.
- Confirm destructive actions such as clearing all history.
- Preserve editor content when switching panels where practical.
- Provide useful empty states and examples.
- Avoid excessive gradients, glass effects, oversized cards, and decorative charts.
- Use subtle animations with a consistent motion system.
- Respect reduced-motion preferences.

## 4.10 Visual Quality Gate

Before implementing every tool, the agent must first complete and refine:

1. Dashboard.
2. Tool directory.
3. One representative complex tool page.

These three screens must be polished in both light and dark modes. Review them at desktop, tablet, and mobile widths.

Do not proceed to implement the entire tool catalogue until the visual foundation is approved.

---

# 5. Functional Requirements

## 5.1 JSON Formatter / Beautifier — P0

Inputs and options:

- Editable JSON text.
- Indentation selection: 2 spaces, 4 spaces, or tabs.
- Optional sorting of object keys.

Actions:

- Format.
- Minify.
- Validate.
- Copy output.
- Download `.json`.
- Clear input.

Requirements:

- Parse using the native JSON parser.
- Show clear syntax errors, including line and column when available.
- Never silently discard invalid input.
- Sorting keys must be opt-in and must not alter array order.
- Handle large inputs without freezing the UI; consider a Web Worker above a documented size threshold.

Acceptance criteria:

- Valid nested JSON formats correctly.
- Invalid JSON displays a useful error.
- Minified output parses to the same JSON value.
- Copy and download actions work.

## 5.2 JSON Validator — P0

- Validate JSON syntax.
- Show valid/invalid status.
- Display useful parser error details.
- Optionally show a structured tree preview.
- Do not claim JSON Schema validation unless a schema is supplied and actually evaluated.

## 5.3 JSON Minifier — P0

- Remove insignificant whitespace.
- Preserve string values and JSON meaning.
- Report invalid input rather than producing misleading output.
- Provide copy and download actions.

## 5.4 URL Parser — P0

- Parse with the browser `URL` API.
- Display protocol, hostname, port, pathname, query parameters, hash, and origin.
- Decode query parameters safely.
- Allow query parameter editing and URL reconstruction.
- Handle invalid URLs with clear errors.
- Do not automatically fetch the URL.

## 5.5 JWT Decoder — P0

- Split and decode JWT header and payload.
- Display decoded JSON with syntax highlighting.
- Display token segments and expiry (`exp`) in readable local time.
- Clearly state that decoding does not verify the signature.
- Do not transmit tokens to a backend.
- Do not log token values in analytics or history by default.
- If signature verification is added later, require the correct algorithm and key material, and make the distinction from decoding explicit.

## 5.6 Base64 Encoder / Decoder — P0

- Encode and decode UTF-8 text correctly.
- Support file-to-Base64 only if implemented with size limits and clear memory handling.
- Detect malformed input and display an error.
- Include copy and download actions.
- Avoid deprecated browser APIs.

## 5.7 Hash Generator — P0

- Support SHA-256, SHA-384, and SHA-512 through Web Crypto.
- Use `crypto.subtle.digest`.
- Support text input initially.
- File hashing may be added with streaming/chunking where practical.
- Label hashes as digests, not encryption.
- Do not describe a plain hash as password storage.
- Do not implement insecure MD5/SHA-1 as recommended security choices.

## 5.8 Password Generator — P0

Options:

- Length.
- Uppercase letters.
- Lowercase letters.
- Numbers.
- Symbols.
- Exclude ambiguous characters.

Requirements:

- Use `crypto.getRandomValues`, not `Math.random`.
- Validate that at least one character group is selected.
- Use unbiased selection (rejection sampling or a reviewed secure method).
- Never store generated passwords in history by default.
- Include copy and regenerate actions.
- Avoid claiming a generated password is guaranteed unbreakable.

## 5.9 UUID Generator — P0

- Generate UUID v4 using `crypto.randomUUID()` where supported.
- Provide single and bulk generation.
- Support uppercase display and optional hyphenless output as presentation options.
- Copy one or all results.
- Validate quantity limits.

## 5.10 Unix Timestamp Converter — P0

- Convert Unix seconds and milliseconds to a date/time.
- Convert date/time to Unix seconds and milliseconds.
- Show UTC and local representations.
- Validate out-of-range and invalid values.
- Avoid ambiguous parsing of non-standard date strings.

## 5.11 Text Case Converter — P0

Support:

- UPPERCASE
- lowercase
- Title Case
- Sentence case
- camelCase
- PascalCase
- snake_case
- kebab-case
- CONSTANT_CASE

Handle whitespace and punctuation predictably. Include copy and clear actions.

## 5.12 Text Diff Checker — P0

- Two editable text inputs.
- Side-by-side and unified views.
- Highlight additions, deletions, and unchanged lines.
- Support line-level diff initially.
- Provide clear, swap, and copy actions.
- Handle empty input and large text safely.
- Use a maintained diff library and test newline edge cases.

## 5.13 HTTP API Client — P1

A lightweight Postman-inspired API request tool.

Request controls:

- HTTP methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS.
- URL input.
- Query parameters editor.
- Headers editor.
- Body modes: none, JSON, text, form URL encoded, and multipart form data.
- Request timeout.
- Send and cancel actions where supported.

Response panel:

- Status code and status text.
- Duration.
- Response headers.
- Pretty-printed JSON when valid.
- Raw response view.
- Copy response.
- Save request to a local collection.

Important browser limitations:

- Browser CORS restrictions apply.
- Explain CORS failures accurately.
- Do not imply that the client can bypass CORS.
- Do not build an unrestricted server-side proxy.
- Do not automatically forward secrets or credentials to another origin.
- Warn before sending authorization headers to a changed host.
- Avoid persisting sensitive headers and bodies by default.
- Use `AbortController` for cancellation and timeout.
- Display network errors distinctly from HTTP error status codes.

## 5.14 HTTP Header Inspector — P1

- Accept pasted raw headers or a header key/value list.
- Parse and display headers.
- Group common security, caching, content, and CORS headers.
- Explain common headers with concise descriptions.
- Do not claim to inspect a live site's headers unless an actual permitted request or backend lookup is performed.

## 5.15 Regex Tester — P1

- Pattern and flags inputs.
- Test text input.
- Highlight matches.
- Show capture groups and match positions.
- Support global, case-insensitive, multiline, and dot-all flags where supported.
- Catch invalid patterns.
- Guard against catastrophic backtracking: warn about expensive patterns, limit input size, and consider execution in a Web Worker with a timeout.
- Document limitations of worker-based timeouts.

## 5.16 Markdown Editor / Preview — P1

- Split editor and preview.
- GitHub-flavoured Markdown support where practical.
- Copy Markdown source.
- Download `.md`.
- Safe rendering: sanitize HTML or disable raw HTML.
- Do not allow unsafe links or scripts.
- Preserve content locally only if the user chooses to save it.

## 5.17 JSON to YAML / YAML to JSON — P1

- Use a maintained YAML parser/stringifier.
- Validate input and show errors.
- Explain that YAML features such as aliases, tags, and complex types may not map exactly to JSON.
- Avoid unsafe custom YAML type constructors.
- Provide copy and download actions.

## 5.18 JSONPath Explorer — P1

- Parse JSON.
- Accept a JSONPath expression.
- Display matching paths and values.
- Support a documented JSONPath subset or a maintained library.
- Show invalid expression errors.
- Never imply unsupported syntax works.

## 5.19 HMAC Generator / Verifier — P1

- Support SHA-256, SHA-384, and SHA-512 HMAC.
- Accept message and secret key.
- Use Web Crypto.
- Provide generate and verify modes.
- Compare signatures safely using a suitable constant-time approach where applicable.
- Never transmit secrets.
- Do not store key values; provide explicit clearing.

## 5.20 QR Code Generator — P1

- Generate QR codes from text or URL.
- Configure size and error correction level.
- Download PNG and SVG where supported.
- Preview before download.
- Validate input length and explain QR capacity constraints.

## 5.21 Random JSON Data Generator — P1

- Let users define fields and data types.
- Support strings, numbers, booleans, dates, enums, and nested objects.
- Generate a chosen number of records within safe limits.
- Allow seed-based reproducibility if supported by the chosen generator.
- Export JSON.
- Clearly label generated values as synthetic test data.

## 5.22 HTML / CSS / JavaScript Formatter — P1

- Use maintained parsers/formatters such as Prettier where appropriate.
- Support format and minify only when reliable.
- Show parse errors.
- Preserve source until the user chooses to replace it.
- Avoid evaluating user code.
- Do not execute pasted HTML or JavaScript in the application origin.

## 5.23 Color Converter / Palette — P1

- Accept HEX, RGB, HSL, and supported CSS color formats.
- Convert between supported formats.
- Provide color preview.
- Generate harmonious palettes only using documented algorithms.
- Copy values and export CSS variables.
- Check text/background contrast using WCAG contrast calculations and explain the selected conformance threshold.

## 5.24 SQL Formatter — P1

- Format SQL using a maintained SQL formatting library.
- Support common dialect selection where supported.
- Clearly state dialect limitations.
- Never execute user SQL.
- Preserve string literals and comments.
- Provide copy and download actions.

## 5.25 Cron Expression Helper — P1

- Parse cron expressions using a maintained library.
- Clearly document the supported cron dialect.
- Display human-readable explanation.
- Show upcoming execution times using a selected timezone.
- Handle invalid expressions and daylight-saving transitions carefully.
- Never claim a schedule is universal across all cron implementations.

## 5.26 Timezone Converter — P1

- Convert a selected date/time between IANA timezones.
- Display UTC offset and timezone name.
- Handle daylight-saving changes using browser internationalization APIs or a maintained timezone library.
- Avoid hardcoded timezone offset tables.

## 5.27 Snippet Manager — P0

- Create, edit, delete, and search snippets.
- Fields: title, description, language, tags, content, created time, and updated time.
- Copy snippet content.
- Favorite snippets.
- Organize snippets into collections.
- Store locally in IndexedDB.
- Confirm destructive deletion.
- Do not execute snippets.

## 5.28 Favorites and History — P0

Favorites:

- Favorite/unfavorite tools.
- Favorite snippets.
- Reorder favorites if practical.

History:

- Record tool name, timestamp, and non-sensitive operation metadata.
- Never record secrets, authorization headers, JWTs, passwords, private keys, or sensitive request bodies.
- Default to storing no raw input/output for security-sensitive tools.
- Provide per-item deletion and clear-all.
- Provide a setting to disable history.
- Show accurate empty states.

## 5.29 Later Tools — P2

Implement only after the first release is stable:

- SQL schema visualizer.
- DNS lookup.
- IP information lookup.
- More advanced network diagnostics.

For any external lookup, disclose the third-party service, data sent, limitations, and privacy implications. Do not silently send a user's IP, domain, or other input to an external provider.

---

# 6. Tool Architecture and Extension System

## 6.1 Tool Registry

Every tool should be registered in a central typed registry.

The registry supplies:

- Stable tool ID.
- Display name.
- Description.
- Category.
- Icon identifier.
- Search keywords.
- Route.
- Release status.
- Privacy classification.
- Component reference or lazy loader.

Example TypeScript contract:

```typescript
export type ToolStatus = "available" | "planned";

export type PrivacyMode =
  | "browser-only"
  | "external-request"
  | "server-processing";

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  keywords: string[];
  route: string;
  status: ToolStatus;
  privacyMode: PrivacyMode;
  component: React.LazyExoticComponent<
    React.ComponentType
  >;
}
```

Do not store React components in serializable Zustand state. The registry is static application configuration.

## 6.2 Shared Tool Utilities

Create reusable components:

- `ToolPageHeader`
- `CodeEditor`
- `TextInputPanel`
- `OutputPanel`
- `EditorToolbar`
- `CopyButton`
- `DownloadButton`
- `ClearButton`
- `FormatOptions`
- `ValidationMessage`
- `ErrorPanel`
- `EmptyState`
- `PrivacyNotice`
- `ToolHelpPanel`
- `SplitPane`
- `ConfirmDialog`

## 6.3 Pure Utility Functions

Keep transformation logic outside UI components.

Example:

```text
src/
  tools/
    json-formatter/
      components/
      logic/
      types.ts
      index.ts
    jwt-decoder/
      components/
      logic/
      types.ts
      index.ts
```

Pure logic should be independently testable. Avoid mixing parsing, state updates, rendering, and persistence in one component.

---

# 7. Application Architecture

## 7.1 High-Level Structure

```text
Browser
  |
  +-- React Application
  |     |
  |     +-- Application Shell
  |     +-- Router
  |     +-- Tool Registry
  |     +-- Shared Tool UI
  |     +-- Individual Tool Modules
  |     +-- Zustand Stores
  |     +-- IndexedDB Repository
  |     +-- Browser APIs / Web Workers
  |
  +-- Optional FastAPI Service
        |
        +-- Authentication (future)
        +-- Synchronization (future)
        +-- DNS / network lookups (future)
        |
        +-- PostgreSQL (future)
```

## 7.2 State Ownership

- Component state: temporary editor content and panel visibility.
- Zustand: global UI preferences, sidebar state, favorites metadata, and selected workspace.
- IndexedDB: snippets, collections, local history, saved requests, and user preferences that need structured persistence.
- TanStack Query: remote data only.
- URL: current tool route and shareable non-sensitive view state.

Do not put large editor documents or secret values into global state without a clear reason.

## 7.3 Data Flow

1. User opens a tool route.
2. Router loads the tool module.
3. Tool component receives input.
4. Tool logic validates and processes input.
5. Result is rendered in the shared output pattern.
6. User may copy, download, or explicitly save the result.
7. Local metadata is recorded only according to the privacy policy.

---

# 8. Project Folder Structure

Use a feature-oriented structure:

```text
devvault/
├── public/
│   ├── favicon.svg
│   └── images/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── providers.tsx
│   │   ├── router.tsx
│   │   └── error-boundary.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MobileNavigation.tsx
│   │   ├── editor/
│   │   ├── tool-ui/
│   │   ├── feedback/
│   │   └── ui/
│   ├── features/
│   │   ├── dashboard/
│   │   ├── tool-directory/
│   │   ├── command-palette/
│   │   ├── workspace/
│   │   ├── snippets/
│   │   ├── favorites/
│   │   ├── history/
│   │   └── settings/
│   ├── tools/
│   │   ├── registry.ts
│   │   ├── json-formatter/
│   │   ├── json-validator/
│   │   ├── json-minifier/
│   │   ├── url-parser/
│   │   ├── jwt-decoder/
│   │   ├── base64/
│   │   ├── hash-generator/
│   │   ├── password-generator/
│   │   ├── uuid-generator/
│   │   ├── timestamp-converter/
│   │   ├── text-case/
│   │   ├── diff-checker/
│   │   ├── api-client/
│   │   ├── regex-tester/
│   │   ├── markdown-editor/
│   │   ├── yaml-converter/
│   │   ├── jsonpath-explorer/
│   │   ├── hmac/
│   │   ├── qr-generator/
│   │   ├── random-json/
│   │   ├── web-formatters/
│   │   ├── color-tools/
│   │   ├── sql-formatter/
│   │   ├── cron-helper/
│   │   └── timezone-converter/
│   ├── stores/
│   ├── db/
│   │   ├── database.ts
│   │   ├── repositories/
│   │   └── migrations/
│   ├── hooks/
│   ├── lib/
│   │   ├── crypto/
│   │   ├── formatters/
│   │   ├── validation/
│   │   ├── download/
│   │   ├── clipboard/
│   │   └── privacy/
│   ├── workers/
│   ├── types/
│   ├── styles/
│   └── main.tsx
├── backend/
│   ├── app/
│   ├── tests/
│   └── pyproject.toml
├── e2e/
├── docs/
├── scripts/
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

Create only folders that are needed for the current implementation. Avoid empty placeholder modules.

---

# 9. Local Data Models

Use Dexie with IndexedDB. Define versioned schemas and migrations.

## 9.1 Snippet

```typescript
interface Snippet {
  id: string;
  title: string;
  description?: string;
  language: string;
  content: string;
  tags: string[];
  collectionId?: string;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}
```

## 9.2 Collection

```typescript
interface Collection {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
}
```

## 9.3 Favorite Tool

```typescript
interface FavoriteTool {
  toolId: string;
  position: number;
  createdAt: number;
}
```

## 9.4 History Item

```typescript
interface HistoryItem {
  id: string;
  toolId: string;
  operation: string;
  createdAt: number;
  metadata?: Record<string, string | number | boolean>;
}
```

History metadata must be allowlisted per tool. Do not save raw payloads or secret-bearing values.

## 9.5 Saved API Request

```typescript
interface SavedApiRequest {
  id: string;
  name: string;
  method: string;
  url: string;
  headers: Array<{ key: string; value: string }>;
  queryParams: Array<{ key: string; value: string }>;
  bodyType: "none" | "json" | "text" | "urlencoded" | "formdata";
  body?: string;
  collectionId?: string;
  createdAt: number;
  updatedAt: number;
}
```

Do not persist authorization headers, cookies, or secrets by default. If users explicitly choose to save sensitive request configuration in a future release, explain the storage model and provide appropriate protection.

## 9.6 Settings

```typescript
interface AppSettings {
  theme: "dark" | "light" | "system";
  historyEnabled: boolean;
  historyRetentionDays: number;
  defaultIndentation: 2 | 4;
  editorFontSize: number;
  editorWordWrap: boolean;
  analyticsEnabled: false;
}
```

The initial product should not include third-party tracking analytics. Local usage metrics, if any, must be transparent and user-controlled.

---

# 10. API Design for Optional Backend

The core browser tools do not need backend endpoints. If a backend is introduced, version it under `/api/v1`.

Potential endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/dns/lookup` | DNS lookup |
| POST | `/api/v1/workspaces/sync` | Optional workspace synchronization |
| GET | `/api/v1/workspaces` | List synchronized workspaces |
| POST | `/api/v1/workspaces` | Create workspace |
| GET | `/api/v1/collections` | List cloud collections |
| POST | `/api/v1/collections` | Create cloud collection |

Requirements:

- Pydantic request and response schemas.
- Consistent error format.
- Input validation and request size limits.
- Rate limiting for public endpoints.
- Authentication and authorization for private resources.
- Structured logs without secrets.
- OpenAPI documentation.
- Unit and integration tests.
- No arbitrary URL-fetch endpoint or open proxy.

Do not implement these endpoints until the associated feature is approved for the release.

---

# 11. Privacy and Security Requirements

Security is a core product feature, not a later cosmetic improvement.

## 11.1 Browser Processing

- Prefer local browser processing.
- Never send editor content to analytics.
- Never log tokens, passwords, private keys, authorization headers, or secret values.
- Do not use remote services without explaining the data flow.
- Keep dependencies minimal and maintained.

## 11.2 Content Security

- Render user-provided text as text by default.
- Sanitize Markdown output.
- Never use `dangerouslySetInnerHTML` on untrusted input without a proven sanitization layer.
- Never evaluate pasted JavaScript.
- Never execute user HTML in the main application origin.
- Use a restrictive Content Security Policy appropriate to the deployed application.

## 11.3 Cryptography

- Use browser cryptographic APIs for random generation and supported hashing.
- Use secure random number generation.
- Never call Base64 encoding encryption.
- Clearly distinguish decoding, hashing, signing, and encryption.
- Do not store secrets in local history.
- Do not claim JWT validity based only on decoding.

## 11.4 Network Tools

- Explain browser CORS restrictions.
- Prevent accidental credential forwarding.
- Validate protocols and inputs.
- Do not create an unrestricted URL proxy.
- For backend DNS/network tools, defend against SSRF, private-network access, DNS rebinding, and abusive request patterns.
- Restrict destination protocols and ports where applicable.
- Apply timeouts, rate limits, and response size limits.

## 11.5 Dependency Security

- Commit lockfiles.
- Audit dependencies during development and release.
- Remove unused packages.
- Avoid abandoned libraries.
- Document security-sensitive dependencies and their purpose.

---

# 12. Performance and Reliability

- Lazy-load individual tool modules.
- Lazy-load Monaco Editor and heavy libraries.
- Split bundles by tool category where useful.
- Debounce expensive live transformations.
- Use Web Workers for CPU-intensive parsing or comparison where appropriate.
- Avoid unnecessary global state updates.
- Virtualize large lists if performance testing shows a need.
- Handle browser storage quota errors gracefully.
- Provide recovery messages if IndexedDB is unavailable.
- Add error boundaries around application routes and complex tool modules.

Performance targets for a normal modern desktop environment:

- Initial application shell should feel responsive and load without downloading every tool.
- Common small transformations should complete nearly instantly.
- Large-input operations should show progress or a responsive working state.
- No obvious layout shifts or horizontal overflow at supported viewport widths.

Measure actual results with Lighthouse and browser profiling. Do not claim targets are achieved without testing.

---

# 13. Testing Strategy

## 13.1 Unit Tests

Test pure functions for:

- JSON formatting, minification, and validation.
- URL parsing and reconstruction.
- JWT segment decoding and malformed tokens.
- Base64 Unicode handling.
- Hash output against known test vectors.
- Password generation constraints and secure random selection logic.
- UUID formatting.
- Timestamp seconds/milliseconds conversions.
- Text case transformations.
- Diff output for additions, deletions, and newline edge cases.
- Regex errors and match extraction.
- YAML conversion.
- Cron parsing.
- Color conversion and contrast calculations.

## 13.2 Component Tests

Test:

- Tool input and output interactions.
- Copy and download controls.
- Error and empty states.
- Favorite toggles.
- Search filtering.
- Snippet create/edit/delete.
- History controls.
- Settings persistence.
- Responsive navigation.
- Theme switching.
- System theme behaviour.
- Monaco theme changes.

## 13.3 End-to-End Tests

Critical user journeys:

1. Open dashboard and find JSON Formatter.
2. Format valid JSON and copy the result.
3. Submit invalid JSON and see a useful error.
4. Decode a sample JWT without claiming signature verification.
5. Generate a secure password and copy it.
6. Create and favorite a snippet.
7. Refresh the browser and verify local persistence.
8. Disable history and verify no new history entries are recorded.
9. Use the API client against a suitable test endpoint and inspect the response.
10. Navigate the application using keyboard controls.
11. Use the application at mobile and desktop widths.
12. Switch between light and dark themes.
13. Verify system theme follows operating system preferences.
14. Verify theme preference persists after refresh.

## 13.4 Quality Gates

Before a release:

- TypeScript type-check passes.
- Lint passes.
- Unit tests pass.
- Component tests pass.
- Critical Playwright journeys pass.
- Production build succeeds.
- No critical accessibility issues in tested flows.
- No known critical or high-severity security issue remains unresolved.
- Light and dark themes pass visual review.

---

# 14. Accessibility Requirements

- Use semantic HTML.
- Every input has a visible or programmatic label.
- Every icon-only button has an accessible name.
- Keyboard focus is visible.
- All core tools can be operated without a mouse.
- Dialogs manage focus correctly.
- Color is not the only way to communicate status.
- Error messages are associated with relevant inputs.
- Respect reduced-motion preferences.
- Maintain adequate contrast in both themes.
- Avoid keyboard traps in code editors and overlays.

---

# 15. Implementation Phases

Work incrementally. Keep the application runnable at the end of each phase.

## Phase 1 — Foundation

Deliver:

- Vite + React + TypeScript project.
- Tailwind and UI primitives.
- Semantic theme tokens.
- Fully implemented light theme.
- Fully implemented dark theme.
- System theme support.
- Theme persistence.
- Responsive app shell.
- Sidebar and header.
- Routing and error boundary.
- Tool registry.
- Dashboard with honest empty states.
- Searchable tool directory.
- Initial command palette structure.

Exit criteria:

- App runs locally.
- Navigation works.
- Layout works on desktop and mobile.
- Theme switching works without reload.
- System theme works.
- No placeholder interactions are presented as working features.
- Dashboard and tool directory look polished in both themes.

## Phase 2 — Core Utilities

Implement:

- JSON Formatter.
- JSON Validator.
- JSON Minifier.
- URL Parser.
- JWT Decoder.
- Base64 Encoder/Decoder.
- Hash Generator.
- Password Generator.
- UUID Generator.
- Unix Timestamp Converter.
- Text Case Converter.
- Text Diff Checker.

Exit criteria:

- Each tool has real logic.
- Unit tests cover normal, edge, and invalid inputs.
- Shared UI patterns are consistent.
- Privacy rules are enforced.
- Tool pages support both themes.

## Phase 3 — Workspace

Implement:

- IndexedDB and Dexie.
- Favorites.
- Recent tools.
- History with retention and disable controls.
- Snippet manager.
- Collections.
- Settings.
- Export/import of supported local workspace data.

Exit criteria:

- Data survives refresh.
- Deletion and clear-all work.
- Import validates files and schema versions.
- Sensitive content is not included in history exports.

## Phase 4 — Advanced Developer Tools

Implement:

- HTTP API Client.
- HTTP Header Inspector.
- Regex Tester.
- Markdown Editor.
- YAML conversion.
- JSONPath Explorer.
- HMAC.
- QR Generator.
- Random JSON Generator.
- HTML/CSS/JavaScript formatters.
- Color tools.
- SQL Formatter.
- Cron helper.
- Timezone converter.

Exit criteria:

- Each feature has documented limits.
- Large or expensive operations do not freeze the UI.
- Security and privacy behaviour is tested.

## Phase 5 — Polish and Production Readiness

Implement:

- Command palette.
- Keyboard shortcuts.
- Improved onboarding and tool discovery.
- Accessibility improvements.
- Performance optimization.
- Error reporting without sensitive payloads.
- README and screenshots.
- Docker-based deployment if appropriate.
- Final visual refinement in both themes.

Exit criteria:

- All release quality gates pass.
- Installation instructions are verified from a clean checkout.
- Production build and deployment instructions are documented.
- Light and dark themes are equally polished.

## Phase 6 — Optional Backend

Only if there is a clear product need:

- FastAPI service.
- PostgreSQL.
- Authentication.
- Workspace synchronization.
- DNS lookup.
- Server-side features with strict security controls.

Do not delay the local-first release for this phase.

---

# 16. Exact Local Setup Instructions

## 16.1 Prerequisites

Install:

- Node.js current LTS.
- npm (bundled with Node.js).
- Git.
- VS Code or another editor.

Docker is optional for the frontend-only release.

## 16.2 Create the Project

```powershell
npm create vite@latest devvault -- --template react-ts
cd devvault
npm install
```

## 16.3 Install Core Dependencies

```powershell
npm install react-router-dom zustand dexie @tanstack/react-query
npm install lucide-react zod react-hook-form @hookform/resolvers
npm install @monaco-editor/react
npm install clsx tailwind-merge class-variance-authority
npm install sonner
```

Install feature libraries as needed, after checking maintenance, license, and bundle impact.

Examples:

```powershell
npm install prettier diff yaml jsonpath-plus
npm install react-markdown remark-gfm rehype-sanitize
npm install qrcode
npm install sql-formatter
```

Do not install every optional package at the beginning. Add each dependency when its feature is implemented.

## 16.4 Tailwind and UI Setup

Follow the current official Tailwind CSS + Vite installation instructions for the compatible major version.

Configure semantic theme variables and reusable design tokens.

Initialize shadcn/ui using its current official Vite instructions. Select only the components actually needed.

## 16.5 Run Development Server

```powershell
npm run dev
```

Open the local URL printed by Vite.

## 16.6 Add Quality Scripts

Configure scripts in `package.json` for:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc -b",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

Adjust scripts to match the actual TypeScript and ESLint configuration generated by the selected versions.

## 16.7 Production Build

```powershell
npm run typecheck
npm run lint
npm run test
npm run build
npm run preview
```

## 16.8 Optional Backend Setup

When backend work is approved:

```powershell
cd backend
python -m venv .venv
```

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies from the project's pinned `pyproject.toml`, then run:

```powershell
uvicorn app.main:app --reload
```

Use `.env.example` as documentation. Never commit real credentials or `.env` files.

---

# 17. Environment Configuration

Frontend environment variables should be minimal.

Example `.env.example`:

```env
VITE_APP_NAME=DevVault
VITE_API_BASE_URL=
```

Rules:

- Vite-exposed variables are public. Never put secrets in `VITE_` variables.
- Do not require an API URL for browser-only features.
- Keep actual secrets in backend environment variables only.
- Validate backend configuration on startup.
- Document optional integrations.

---

# 18. Import, Export and Backup

Support user-controlled workspace backup.

Suggested export format:

```json
{
  "format": "devvault-backup",
  "version": 1,
  "exportedAt": "ISO-8601 timestamp",
  "snippets": [],
  "collections": [],
  "favorites": [],
  "settings": {}
}
```

Requirements:

- Validate imported file type, size, format, and version.
- Reject malformed data safely.
- Preview import contents before applying.
- Offer merge or replace only when both behaviours are implemented and clearly explained.
- Do not include sensitive API credentials, passwords, tokens, or secret editor content.
- Provide a useful error report without exposing unnecessary user data.

---

# 19. Documentation Requirements

The repository README must include:

1. Product overview.
2. Feature list with implemented status.
3. Screenshots or short demonstrations of real working tools.
4. Technology stack.
5. Architecture overview.
6. Local installation.
7. Development commands.
8. Testing instructions.
9. Privacy and security approach.
10. Known browser limitations, especially CORS.
11. Contribution guidance.
12. License.

Also maintain:

- `docs/architecture.md`
- `docs/privacy.md`
- `docs/security.md`
- `docs/adding-a-tool.md`
- `docs/testing.md`

---

# 20. Acceptance Criteria

The project is considered complete for its initial release only when all of the following are true.

## Product

- [ ] Dashboard and tool directory are functional.
- [ ] Search finds tools by name, description, and keywords.
- [ ] All P0 tools work correctly.
- [ ] Favorites work and persist.
- [ ] History can be disabled, reviewed, and cleared.
- [ ] Snippets can be created, edited, searched, organized, and deleted.
- [ ] Settings persist after refresh.
- [ ] Empty, loading, success, and error states are implemented where relevant.

## Engineering

- [ ] Strict TypeScript is enabled.
- [ ] Tool logic is separated from UI.
- [ ] Tools are registered through a typed registry.
- [ ] Heavy tools are lazy-loaded.
- [ ] IndexedDB schema is versioned.
- [ ] Errors are handled gracefully.
- [ ] Unit, component, and critical end-to-end tests pass.
- [ ] Production build succeeds.

## Security and Privacy

- [ ] No secret values are written to logs or analytics.
- [ ] Sensitive tool inputs are excluded from history.
- [ ] JWT decoding clearly states that it does not verify signatures.
- [ ] Password generation uses cryptographically secure randomness.
- [ ] User Markdown is safely rendered.
- [ ] User code is never executed automatically.
- [ ] External network requests are disclosed.
- [ ] No unrestricted proxy exists.

## UI/UX

- [ ] Light theme is fully implemented.
- [ ] Dark theme is fully implemented.
- [ ] System theme is fully implemented.
- [ ] Theme preference persists.
- [ ] Theme switching does not require a reload.
- [ ] All components support both themes.
- [ ] Monaco Editor supports both themes.
- [ ] Desktop, tablet, and mobile layouts are usable.
- [ ] Keyboard navigation works for primary flows.
- [ ] Focus and contrast are accessible in both themes.
- [ ] No dead buttons or fake functionality remain.
- [ ] Tool pages share a coherent interaction model.
- [ ] Loading, empty, success, and error states are polished.

## Delivery

- [ ] Clean-checkout setup instructions are verified.
- [ ] README and technical documentation are complete.
- [ ] `.env.example` exists where needed.
- [ ] No secrets or unnecessary generated files are committed.

---

# 21. Visual Quality Review and Design Acceptance Gate

This project must not be considered visually complete merely because it uses a dark background and a component library.

Before proceeding beyond the foundation phase, the coding agent must:

1. Build the dashboard, tool directory, and one representative complex tool page in both light and dark modes.
2. Review the pages at desktop, tablet, and mobile widths.
3. Check typography hierarchy, spacing, alignment, panel density, editor usability, and visual consistency.
4. Check every interactive state: default, hover, focus, active, selected, disabled, loading, success, warning, and error.
5. Verify that light mode has its own carefully tuned surfaces, borders, text, and editor colours. Do not simply invert the dark theme.
6. Verify that dark mode has sufficient separation between surfaces without excessive borders or glow effects.
7. Test keyboard-only operation and visible focus indicators.
8. Check contrast for text, icons, controls, and status indicators.
9. Remove unnecessary cards, decorative elements, redundant labels, and inconsistent icon usage.
10. Capture screenshots of both themes at representative viewport sizes for review.

## Visual Acceptance Checklist

- [ ] The product looks like a cohesive, premium developer application.
- [ ] Light mode is polished and intentionally designed.
- [ ] Dark mode is polished and intentionally designed.
- [ ] System theme works correctly.
- [ ] All pages use the same design tokens and component standards.
- [ ] Sidebar, header, page title, and content alignment are consistent.
- [ ] Editors are spacious, readable, and comfortable for extended use.
- [ ] Forms, tables, dialogs, menus, and notifications are visually consistent.
- [ ] Empty, error, and loading states are designed rather than improvised.
- [ ] Responsive layouts do not overflow or hide essential actions.
- [ ] Motion is subtle, purposeful, and respects reduced-motion preferences.
- [ ] No fake data, decorative-only controls, or dead interactions are present.

Do not sacrifice usability, accessibility, or performance for visual effects.

---

# 22. Instructions to the AI Coding Agent

Follow these instructions throughout implementation:

1. Read this entire specification before writing code.
2. Inspect the repository before changing existing files. If the repository is empty, initialize the project cleanly.
3. Start by proposing a concise implementation plan and confirming dependency choices against current package compatibility.
4. Implement one phase at a time.
5. Do not generate the entire application as one enormous component.
6. Use reusable, typed components and pure utility functions.
7. Keep every tool independently testable.
8. Do not use mock data to pretend a feature is complete.
9. Do not add buttons that have no working action.
10. Do not silently send user content to external services.
11. Do not weaken security to make a demo work.
12. Add tests alongside each feature rather than postponing all tests.
13. Run type checking, linting, and relevant tests after each phase.
14. Fix errors before moving to the next phase.
15. Keep documentation and the feature status list up to date.
16. If a requirement is ambiguous, choose the safest and simplest implementation and document the decision.
17. If a requested library is unsuitable or unmaintained, explain the issue and choose a maintained alternative.
18. Do not claim a feature is complete until it has been implemented and verified.

## Required Implementation Status Format

Maintain a checklist in the repository:

```text
[ ] Phase 1 — Foundation
[ ] Phase 2 — Core Utilities
[ ] Phase 3 — Workspace
[ ] Phase 4 — Advanced Tools
[ ] Phase 5 — Production Readiness
[ ] Phase 6 — Optional Backend
```

For each tool, record:

- Implementation status.
- Unit test status.
- UI test status.
- Known limitations.
- Privacy classification.

## Final Delivery Expectation

Deliver a working, well-structured DevVault application with:

- A consistent premium UI.
- Fully implemented light, dark, and system themes.
- Fully functional P0 tools.
- Tested local persistence.
- Documented privacy behaviour.
- Reproducible local setup.
- Professional responsive design.
- Proper testing and documentation.

The finished result should demonstrate practical frontend engineering, browser API knowledge, TypeScript architecture, data handling, security awareness, testing discipline, and product-quality UI/UX.

**Build a developer product that is genuinely useful — not merely a portfolio screenshot.**
