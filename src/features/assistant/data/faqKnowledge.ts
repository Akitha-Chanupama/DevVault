export interface FaqItem {
  id: string;
  question: string;
  category: 'general' | 'tools' | 'security' | 'storage' | 'shortcuts';
  categoryLabel: string;
  keywords: string[];
  answer: string;
  actionLink?: string;
  actionLabel?: string;
  relatedIds?: string[];
}

export const FAQ_CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'general', label: 'Getting Started' },
  { id: 'tools', label: 'Formatters & Tools' },
  { id: 'security', label: 'Security & Privacy' },
  { id: 'storage', label: 'Storage & Backup' },
  { id: 'shortcuts', label: 'Shortcuts & Tips' },
] as const;

export const FAQ_KNOWLEDGE_BASE: FaqItem[] = [
  // General & Getting Started
  {
    id: 'what-is-devvault',
    question: 'What is DevVault and what can it do?',
    category: 'general',
    categoryLabel: 'Getting Started',
    keywords: ['about', 'overview', 'features', 'what is', 'introduction'],
    answer:
      'DevVault is an offline-capable, local-first developer productivity platform. It packs 29 high-performance utilities including code formatters, JWT decoders, regex testers, converters, and an encrypted snippet manager into a single fast workspace.',
    actionLink: '/tools',
    actionLabel: 'Explore All 29 Tools',
    relatedIds: ['privacy-local-first', 'offline-mode', 'keyboard-shortcuts'],
  },
  {
    id: 'privacy-local-first',
    question: 'Is my data, code, and token input safe?',
    category: 'security',
    categoryLabel: 'Security & Privacy',
    keywords: ['privacy', 'security', 'safe', 'confidential', 'cloud', 'tracking', 'telemetry'],
    answer:
      'Yes, 100% safe! DevVault executes everything client-side directly inside your browser. No tokens, JSON payloads, snippets, or activity logs are ever transmitted to any external server or telemetry service.',
    actionLink: '/settings',
    actionLabel: 'View Privacy Settings',
    relatedIds: ['what-is-devvault', 'where-is-data-stored', 'offline-mode'],
  },
  {
    id: 'offline-mode',
    question: 'Can I use DevVault completely offline?',
    category: 'general',
    categoryLabel: 'Getting Started',
    keywords: ['offline', 'internet', 'airplane', 'pwa', 'disconnect'],
    answer:
      'DevVault works completely offline! All JavaScript, WebAssembly routines, and IndexedDB storage run locally in your browser. Once loaded or installed as a PWA, you can use all 29 tools without an internet connection.',
    actionLink: '/tools',
    actionLabel: 'Try Offline Utilities',
    relatedIds: ['privacy-local-first', 'where-is-data-stored'],
  },

  // Tools & Formatters
  {
    id: 'code-formatters',
    question: 'How do I format JSON, SQL, HTML, CSS, or JS?',
    category: 'tools',
    categoryLabel: 'Formatters & Tools',
    keywords: ['format', 'beautify', 'minify', 'json', 'sql', 'html', 'css', 'javascript', 'formatter'],
    answer:
      'DevVault includes dedicated Monaco-powered formatters for JSON, SQL, HTML, CSS, and JavaScript/TypeScript. Each editor supports live syntax highlighting, error validation, 1-click copy, download, and instant Ctrl+Enter formatting.',
    actionLink: '/tools/json-formatter',
    actionLabel: 'Open JSON Formatter',
    relatedIds: ['json-yaml-conversion', 'editor-preferences'],
  },
  {
    id: 'json-yaml-conversion',
    question: 'How do I convert between JSON and YAML?',
    category: 'tools',
    categoryLabel: 'Formatters & Tools',
    keywords: ['convert', 'yaml', 'json to yaml', 'yaml to json', 'converter'],
    answer:
      'Use the JSON ↔ YAML Converter! It supports bi-directional conversion with customizable indentation and preserves data types, structures, and nested arrays with syntax highlighting.',
    actionLink: '/tools/yaml-converter',
    actionLabel: 'Open YAML Converter',
    relatedIds: ['code-formatters', 'jsonpath-tool'],
  },
  {
    id: 'jwt-tool',
    question: 'How does the JWT Debugger work?',
    category: 'security',
    categoryLabel: 'Security & Privacy',
    keywords: ['jwt', 'token', 'decode', 'claims', 'auth', 'bearer', 'verify'],
    answer:
      'The JWT Decoder parses JSON Web Tokens in real time, breaking down the Header, Payload claims, and Signature. It also checks expiration times (iat, exp), displays remaining validity countdowns, and highlights security warnings—with zero remote transmission.',
    actionLink: '/tools/jwt-decoder',
    actionLabel: 'Open JWT Decoder',
    relatedIds: ['privacy-local-first', 'hash-hmac-generator'],
  },
  {
    id: 'regex-tool',
    question: 'How do I test and debug regular expressions?',
    category: 'tools',
    categoryLabel: 'Formatters & Tools',
    keywords: ['regex', 'regular expression', 'pattern', 'test', 'match', 'flags'],
    answer:
      'The Regex Tester provides real-time pattern matching with match group highlighting, customizable flags (g, i, m, s, u), and cheat sheets for common patterns like emails, URLs, dates, and IPs.',
    actionLink: '/tools/regex-tester',
    actionLabel: 'Open Regex Tester',
    relatedIds: ['code-formatters', 'what-is-devvault'],
  },
  {
    id: 'hash-hmac-generator',
    question: 'How do I generate SHA hashes or HMAC signatures?',
    category: 'security',
    categoryLabel: 'Security & Privacy',
    keywords: ['hash', 'sha256', 'sha512', 'md5', 'hmac', 'crypto', 'checksum'],
    answer:
      'DevVault provides both a Hash Generator (MD5, SHA-1, SHA-256, SHA-384, SHA-512) and an HMAC Generator with secret key support, using standard Web Crypto API algorithms executed entirely in your browser.',
    actionLink: '/tools/hash-generator',
    actionLabel: 'Open Hash Generator',
    relatedIds: ['jwt-tool', 'privacy-local-first'],
  },
  {
    id: 'jsonpath-tool',
    question: 'How do I query complex JSON with JSONPath?',
    category: 'tools',
    categoryLabel: 'Formatters & Tools',
    keywords: ['jsonpath', 'query', 'filter', 'extract', 'deep search'],
    answer:
      'The JSONPath Explorer lets you run expressive expressions (e.g., `$.store.book[*].author` or `items[?(@.price < 10)]`) on complex JSON structures with instant result extraction, syntax validation, and formatted output.',
    actionLink: '/tools/jsonpath-explorer',
    actionLabel: 'Open JSONPath Explorer',
    relatedIds: ['code-formatters', 'json-yaml-conversion'],
  },

  // Storage & Backup
  {
    id: 'where-is-data-stored',
    question: 'Where are my snippets and tool history saved?',
    category: 'storage',
    categoryLabel: 'Storage & Backup',
    keywords: ['storage', 'indexeddb', 'database', 'where', 'persist', 'save', 'history'],
    answer:
      'All snippets, history, favorites, and settings are stored locally in your browser’s IndexedDB database via Dexie.js. Data persists across browser restarts and offline sessions.',
    actionLink: '/snippets',
    actionLabel: 'View Snippets',
    relatedIds: ['export-backup', 'privacy-local-first'],
  },
  {
    id: 'export-backup',
    question: 'How do I backup or transfer my workspace to another PC?',
    category: 'storage',
    categoryLabel: 'Storage & Backup',
    keywords: ['backup', 'export', 'import', 'restore', 'transfer', 'migration', 'sync'],
    answer:
      'Go to Settings → Workspace Backup & Restore. You can export a JSON backup containing all your snippets, collections, tool favorites, and preferences. On another computer or browser, simply choose "Restore" with Merge or Replace mode!',
    actionLink: '/settings',
    actionLabel: 'Go to Backup & Restore',
    relatedIds: ['where-is-data-stored', 'snippet-collections'],
  },
  {
    id: 'snippet-collections',
    question: 'How do I organize snippets into collections?',
    category: 'storage',
    categoryLabel: 'Storage & Backup',
    keywords: ['snippets', 'collections', 'organize', 'folders', 'tags', 'code snippets'],
    answer:
      'Under the Snippets section, click "Collections" or switch tabs to create custom folders with distinct colors and descriptions. When saving or editing a snippet, assign it to a collection and tag it with languages or topics.',
    actionLink: '/snippets?tab=collections',
    actionLabel: 'Open Collections',
    relatedIds: ['export-backup', 'where-is-data-stored'],
  },

  // Shortcuts & Productivity
  {
    id: 'keyboard-shortcuts',
    question: 'What keyboard shortcuts are available?',
    category: 'shortcuts',
    categoryLabel: 'Shortcuts & Tips',
    keywords: ['shortcuts', 'hotkeys', 'keyboard', 'ctrl+k', 'command palette', 'quick actions'],
    answer:
      'Key shortcuts:\n• Ctrl + K (⌘ + K): Global Command Palette & instant search\n• ? (Shift + /): Open Keyboard Shortcuts Cheatsheet\n• Ctrl + Shift + T: Cycle Light / Dark / System theme\n• Ctrl + Shift + S: Jump to Snippets\n• Ctrl + Shift + H: Jump to History\n• Ctrl + Enter: Format / Execute code in Monaco editors',
    actionLink: '/tools',
    actionLabel: 'Try Shortcuts in Tools',
    relatedIds: ['command-palette-tips', 'theme-and-font-size'],
  },
  {
    id: 'command-palette-tips',
    question: 'How do I use the Command Palette (Ctrl + K)?',
    category: 'shortcuts',
    categoryLabel: 'Shortcuts & Tips',
    keywords: ['command palette', 'ctrl+k', 'palette', 'search', 'navigate', 'quick open'],
    answer:
      'Press Ctrl + K (or ⌘ + K on Mac) anywhere in DevVault. You can search all 29 tools by name, tag, or category, switch color themes, access your saved snippets, or jump directly to Settings or History without using the mouse.',
    actionLink: '/tools',
    actionLabel: 'Open Tool Directory',
    relatedIds: ['keyboard-shortcuts', 'theme-and-font-size'],
  },
  {
    id: 'theme-and-font-size',
    question: 'How do I change color themes and font sizes?',
    category: 'shortcuts',
    categoryLabel: 'Shortcuts & Tips',
    keywords: ['theme', 'dark mode', 'light mode', 'font size', 'scale', 'compact', 'display'],
    answer:
      'In Settings, you can switch between Light, Dark, or System appearance (with smooth circular animation). You can also adjust the Web Application Font Size between 12px (Compact), 14px (Default), 16px (Comfortable), and 18px (Spacious) to fit your monitor density.',
    actionLink: '/settings',
    actionLabel: 'Customize Theme & Font Size',
    relatedIds: ['keyboard-shortcuts', 'editor-preferences'],
  },
  {
    id: 'editor-preferences',
    question: 'Can I change indentation and Monaco editor font sizes?',
    category: 'tools',
    categoryLabel: 'Formatters & Tools',
    keywords: ['editor', 'monaco', 'indent', 'spaces', 'tabs', 'word wrap', 'editor font size'],
    answer:
      'Yes! In Settings under "Editor Preferences", you can set default indentation (2 or 4 spaces), adjust code font size (12px to 24px), toggle automatic word wrap, and choose whether formatting is triggered automatically.',
    actionLink: '/settings',
    actionLabel: 'Configure Editor Preferences',
    relatedIds: ['code-formatters', 'theme-and-font-size'],
  },
];
