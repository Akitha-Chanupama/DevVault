import React from 'react';
import { ToolDefinition } from '../types/tools';

// Lazy loaded tool components
const JsonFormatterPage = React.lazy(
  () => import('./json-formatter/components/JsonFormatterPage')
);
const JsonValidatorPage = React.lazy(
  () => import('./json-validator/components/JsonValidatorPage')
);
const JsonMinifierPage = React.lazy(
  () => import('./json-minifier/components/JsonMinifierPage')
);
const UrlParserPage = React.lazy(
  () => import('./url-parser/components/UrlParserPage')
);
const JwtDecoderPage = React.lazy(
  () => import('./jwt-decoder/components/JwtDecoderPage')
);
const Base64Page = React.lazy(
  () => import('./base64/components/Base64Page')
);
const HashGeneratorPage = React.lazy(
  () => import('./hash-generator/components/HashGeneratorPage')
);
const PasswordGeneratorPage = React.lazy(
  () => import('./password-generator/components/PasswordGeneratorPage')
);
const UuidGeneratorPage = React.lazy(
  () => import('./uuid-generator/components/UuidGeneratorPage')
);
const TimestampConverterPage = React.lazy(
  () => import('./timestamp-converter/components/TimestampConverterPage')
);
const TextCasePage = React.lazy(
  () => import('./text-case/components/TextCasePage')
);
const DiffCheckerPage = React.lazy(
  () => import('./diff-checker/components/DiffCheckerPage')
);

export const TOOL_REGISTRY: ToolDefinition[] = [
  // JSON & Data
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, beautify, and inspect JSON with custom indentation and key sorting.',
    category: 'JSON & Data',
    keywords: ['json', 'format', 'beautify', 'lint', 'prettify'],
    route: '/tools/json-formatter',
    status: 'available',
    privacyMode: 'browser-only',
    icon: 'FileCode2',
    isPopular: true,
    priority: 'P0',
    component: JsonFormatterPage,
  },
  {
    id: 'json-validator',
    name: 'JSON Validator',
    description: 'Validate JSON syntax and structure with deep diagnostics, structural metrics, and line-level error detection.',
    category: 'JSON & Data',
    keywords: ['json', 'validate', 'syntax', 'lint', 'check'],
    route: '/tools/json-validator',
    status: 'available',
    privacyMode: 'browser-only',
    icon: 'CheckCircle2',
    priority: 'P0',
    component: JsonValidatorPage,
  },
  {
    id: 'json-minifier',
    name: 'JSON Minifier',
    description: 'Compress and minify JSON by stripping unnecessary whitespace and line breaks.',
    category: 'JSON & Data',
    keywords: ['json', 'minify', 'compress', 'compact'],
    route: '/tools/json-minifier',
    status: 'available',
    privacyMode: 'browser-only',
    icon: 'Minimize2',
    priority: 'P0',
    component: JsonMinifierPage,
  },
  {
    id: 'json-to-yaml',
    name: 'JSON to YAML',
    description: 'Convert JSON structures to standard YAML syntax.',
    category: 'JSON & Data',
    keywords: ['json', 'yaml', 'convert', 'transform'],
    route: '/tools/json-to-yaml',
    status: 'planned',
    privacyMode: 'browser-only',
    icon: 'ArrowRightLeft',
    priority: 'P1',
  },
  {
    id: 'yaml-to-json',
    name: 'YAML to JSON',
    description: 'Convert YAML configuration documents into structured JSON objects.',
    category: 'JSON & Data',
    keywords: ['yaml', 'json', 'convert', 'parse'],
    route: '/tools/yaml-to-json',
    status: 'planned',
    privacyMode: 'browser-only',
    icon: 'ArrowRightLeft',
    priority: 'P1',
  },
  {
    id: 'jsonpath-explorer',
    name: 'JSONPath Explorer',
    description: 'Evaluate JSONPath queries against JSON payloads interactively.',
    category: 'JSON & Data',
    keywords: ['json', 'jsonpath', 'query', 'filter', 'extract'],
    route: '/tools/jsonpath-explorer',
    status: 'planned',
    privacyMode: 'browser-only',
    icon: 'SearchCode',
    priority: 'P1',
  },

  // API & HTTP
  {
    id: 'url-parser',
    name: 'URL Parser & Builder',
    description: 'Parse URLs into origin, pathname, hash, and interactive query parameters.',
    category: 'API & HTTP',
    keywords: ['url', 'uri', 'query', 'params', 'parse', 'encode'],
    route: '/tools/url-parser',
    status: 'available',
    privacyMode: 'browser-only',
    icon: 'Link',
    priority: 'P0',
    component: UrlParserPage,
  },
  {
    id: 'api-client',
    name: 'HTTP API Client',
    description: 'Send direct browser requests with method, header, parameter, and body configuration.',
    category: 'API & HTTP',
    keywords: ['api', 'http', 'rest', 'client', 'fetch', 'postman', 'curl'],
    route: '/tools/api-client',
    status: 'planned',
    privacyMode: 'browser-only',
    icon: 'Send',
    isPopular: true,
    priority: 'P1',
  },
  {
    id: 'header-inspector',
    name: 'HTTP Header Inspector',
    description: 'Parse, group, and analyze raw HTTP headers for security and caching policies.',
    category: 'API & HTTP',
    keywords: ['http', 'headers', 'cors', 'security', 'cache', 'cookies'],
    route: '/tools/header-inspector',
    status: 'planned',
    privacyMode: 'browser-only',
    icon: 'ListFilter',
    priority: 'P1',
  },

  // Security
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Inspect JSON Web Token headers, claims, and expiry dates without sending data to servers.',
    category: 'Security',
    keywords: ['jwt', 'token', 'decode', 'bearer', 'auth', 'claims'],
    route: '/tools/jwt-decoder',
    status: 'available',
    privacyMode: 'browser-only',
    icon: 'KeyRound',
    isPopular: true,
    priority: 'P0',
    component: JwtDecoderPage,
  },
  {
    id: 'base64',
    name: 'Base64 Encoder / Decoder',
    description: 'Encode and decode UTF-8 text strings and binary data with standard Base64.',
    category: 'Security',
    keywords: ['base64', 'encode', 'decode', 'binary', 'utf8'],
    route: '/tools/base64',
    status: 'available',
    privacyMode: 'browser-only',
    icon: 'Binary',
    priority: 'P0',
    component: Base64Page,
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate cryptographic SHA-256, SHA-384, and SHA-512 digests via Web Crypto.',
    category: 'Security',
    keywords: ['hash', 'sha256', 'sha512', 'digest', 'crypto'],
    route: '/tools/hash-generator',
    status: 'available',
    privacyMode: 'browser-only',
    icon: 'Fingerprint',
    isPopular: true,
    priority: 'P0',
    component: HashGeneratorPage,
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate cryptographically strong passwords using CSPRNG with custom constraints.',
    category: 'Security',
    keywords: ['password', 'generator', 'security', 'random', 'csprng'],
    route: '/tools/password-generator',
    status: 'available',
    privacyMode: 'browser-only',
    icon: 'Lock',
    priority: 'P0',
    component: PasswordGeneratorPage,
  },
  {
    id: 'hmac-generator',
    name: 'HMAC Generator & Verifier',
    description: 'Compute and verify keyed-hash message authentication codes (HMAC).',
    category: 'Security',
    keywords: ['hmac', 'signature', 'secret', 'sha256', 'verify'],
    route: '/tools/hmac-generator',
    status: 'planned',
    privacyMode: 'browser-only',
    icon: 'ShieldCheck',
    priority: 'P1',
  },

  // Text & Code
  {
    id: 'diff-checker',
    name: 'Text Diff Checker',
    description: 'Compare text side-by-side or unified with syntax and line diffing.',
    category: 'Text & Code',
    keywords: ['diff', 'compare', 'text', 'code', 'changes'],
    route: '/tools/diff-checker',
    status: 'available',
    privacyMode: 'browser-only',
    icon: 'GitCompare',
    isPopular: true,
    priority: 'P0',
    component: DiffCheckerPage,
  },
  {
    id: 'text-case',
    name: 'Text Case Converter',
    description: 'Convert strings between camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE.',
    category: 'Text & Code',
    keywords: ['case', 'camelCase', 'snake_case', 'kebab-case', 'uppercase', 'lowercase'],
    route: '/tools/text-case',
    status: 'available',
    privacyMode: 'browser-only',
    icon: 'CaseSensitive',
    priority: 'P0',
    component: TextCasePage,
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and debug regular expressions with interactive match highlighting and capture groups.',
    category: 'Text & Code',
    keywords: ['regex', 'regexp', 'match', 'pattern', 'test'],
    route: '/tools/regex-tester',
    status: 'planned',
    privacyMode: 'browser-only',
    icon: 'Regex',
    isPopular: true,
    priority: 'P1',
  },
  {
    id: 'markdown-editor',
    name: 'Markdown Editor & Preview',
    description: 'Author and preview GitHub Flavored Markdown with sanitized live rendering.',
    category: 'Text & Code',
    keywords: ['markdown', 'md', 'gfm', 'preview', 'editor'],
    route: '/tools/markdown-editor',
    status: 'planned',
    privacyMode: 'browser-only',
    icon: 'FileText',
    priority: 'P1',
  },

  // Generators
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate bulk or single cryptographically secure UUID v4 identifiers.',
    category: 'Generators',
    keywords: ['uuid', 'guid', 'v4', 'random', 'id'],
    route: '/tools/uuid-generator',
    status: 'available',
    privacyMode: 'browser-only',
    icon: 'Sparkles',
    priority: 'P0',
    component: UuidGeneratorPage,
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Create customizable QR codes for URLs, text, and Wi-Fi credentials with PNG/SVG export.',
    category: 'Generators',
    keywords: ['qr', 'qrcode', 'barcode', 'generator'],
    route: '/tools/qr-generator',
    status: 'planned',
    privacyMode: 'browser-only',
    icon: 'QrCode',
    priority: 'P1',
  },
  {
    id: 'random-json',
    name: 'Synthetic JSON Generator',
    description: 'Generate realistic mock data sets and JSON schemas for development and testing.',
    category: 'Generators',
    keywords: ['mock', 'fake', 'json', 'data', 'faker', 'synthetic'],
    route: '/tools/random-json',
    status: 'planned',
    privacyMode: 'browser-only',
    icon: 'DatabaseZap',
    priority: 'P1',
  },

  // Web Development
  {
    id: 'html-formatter',
    name: 'HTML Formatter',
    description: 'Clean, indent, and format HTML markup safely in the browser.',
    category: 'Web Development',
    keywords: ['html', 'format', 'beautify', 'markup'],
    route: '/tools/html-formatter',
    status: 'planned',
    privacyMode: 'browser-only',
    icon: 'Code2',
    priority: 'P1',
  },
  {
    id: 'css-formatter',
    name: 'CSS Formatter & Minifier',
    description: 'Format, beautify, or minify CSS stylesheets.',
    category: 'Web Development',
    keywords: ['css', 'style', 'format', 'minify'],
    route: '/tools/css-formatter',
    status: 'planned',
    privacyMode: 'browser-only',
    icon: 'Palette',
    priority: 'P1',
  },
  {
    id: 'js-formatter',
    name: 'JavaScript Formatter',
    description: 'Format and beautify JavaScript/TypeScript code snippets.',
    category: 'Web Development',
    keywords: ['javascript', 'js', 'ts', 'format', 'prettier'],
    route: '/tools/js-formatter',
    status: 'planned',
    privacyMode: 'browser-only',
    icon: 'FileCode',
    priority: 'P1',
  },
  {
    id: 'color-converter',
    name: 'Color Converter & WCAG Contrast',
    description: 'Convert HEX, RGB, HSL colors and verify accessible WCAG 2.2 contrast ratios.',
    category: 'Web Development',
    keywords: ['color', 'hex', 'rgb', 'hsl', 'wcag', 'contrast', 'palette'],
    route: '/tools/color-converter',
    status: 'planned',
    privacyMode: 'browser-only',
    icon: 'Pipette',
    priority: 'P1',
  },

  // Database
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format and beautify complex SQL queries across PostgreSQL, MySQL, and SQLite dialects.',
    category: 'Database',
    keywords: ['sql', 'postgres', 'mysql', 'sqlite', 'format', 'query'],
    route: '/tools/sql-formatter',
    status: 'planned',
    privacyMode: 'browser-only',
    icon: 'Database',
    priority: 'P1',
  },

  // Time & Date
  {
    id: 'timestamp-converter',
    name: 'Unix Timestamp Converter',
    description: 'Convert between Unix epoch seconds/milliseconds and human-readable UTC/local dates.',
    category: 'Time & Date',
    keywords: ['timestamp', 'unix', 'epoch', 'date', 'time', 'utc'],
    route: '/tools/timestamp-converter',
    status: 'available',
    privacyMode: 'browser-only',
    icon: 'Clock',
    priority: 'P0',
    component: TimestampConverterPage,
  },
  {
    id: 'timezone-converter',
    name: 'Timezone Converter',
    description: 'Compare and convert datetime across worldwide IANA timezones.',
    category: 'Time & Date',
    keywords: ['timezone', 'iana', 'dst', 'time', 'world'],
    route: '/tools/timezone-converter',
    status: 'planned',
    privacyMode: 'browser-only',
    icon: 'Globe',
    priority: 'P1',
  },
  {
    id: 'cron-helper',
    name: 'Cron Expression Helper',
    description: 'Translate 5-part cron schedules into human descriptions and upcoming trigger schedules.',
    category: 'Time & Date',
    keywords: ['cron', 'schedule', 'timer', 'crontab'],
    route: '/tools/cron-helper',
    status: 'planned',
    privacyMode: 'browser-only',
    icon: 'CalendarClock',
    priority: 'P1',
  },
];

export const TOOL_CATEGORIES = [
  'JSON & Data',
  'API & HTTP',
  'Security',
  'Text & Code',
  'Generators',
  'Web Development',
  'Database',
  'Time & Date',
] as const;
