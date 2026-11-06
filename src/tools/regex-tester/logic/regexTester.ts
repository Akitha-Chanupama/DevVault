import { RegexFlags, RegexMatch, RegexTestResult } from '../types';

export function buildFlagString(flags: RegexFlags): string {
  let s = '';
  if (flags.g) s += 'g';
  if (flags.i) s += 'i';
  if (flags.m) s += 'm';
  if (flags.s) s += 's';
  if (flags.u) s += 'u';
  return s;
}

export function executeRegexTest(
  pattern: string,
  flags: RegexFlags,
  testString: string,
  replacePattern?: string
): RegexTestResult {
  if (!pattern) {
    return {
      success: true,
      matches: [],
      count: 0,
      executionTimeMs: 0,
      replacement: replacePattern !== undefined ? testString : undefined,
    };
  }

  const flagStr = buildFlagString(flags);
  let regex: RegExp;

  try {
    regex = new RegExp(pattern, flagStr);
  } catch (err) {
    return {
      success: false,
      matches: [],
      count: 0,
      error: (err as Error).message,
      executionTimeMs: 0,
    };
  }

  const start = performance.now();
  const matches: RegexMatch[] = [];

  try {
    if (flags.g) {
      let m: RegExpExecArray | null;
      let iterations = 0;
      const MAX_ITERATIONS = 5000; // Protection against infinite loop on zero-length matches

      while ((m = regex.exec(testString)) !== null) {
        iterations++;
        if (iterations > MAX_ITERATIONS) {
          break;
        }

        const matchText = m[0];
        const matchStart = m.index;
        const matchEnd = matchStart + matchText.length;

        // Process capture groups
        const groups: Array<{ name?: string; index: number; value: string }> = [];
        if (m.length > 1) {
          for (let i = 1; i < m.length; i++) {
            groups.push({
              index: i,
              value: m[i] ?? '',
            });
          }
        }

        if (m.groups) {
          Object.entries(m.groups).forEach(([name, val]) => {
            const existing = groups.find((g) => g.value === val);
            if (existing) {
              existing.name = name;
            } else {
              groups.push({
                name,
                index: groups.length + 1,
                value: val ?? '',
              });
            }
          });
        }

        matches.push({
          index: matches.length,
          match: matchText,
          groups,
          start: matchStart,
          end: matchEnd,
        });

        // Avoid infinite loop if zero-length match
        if (regex.lastIndex === m.index) {
          regex.lastIndex++;
        }
      }
    } else {
      const m = regex.exec(testString);
      if (m) {
        const groups: Array<{ name?: string; index: number; value: string }> = [];
        if (m.length > 1) {
          for (let i = 1; i < m.length; i++) {
            groups.push({
              index: i,
              value: m[i] ?? '',
            });
          }
        }
        if (m.groups) {
          Object.entries(m.groups).forEach(([name, val]) => {
            const existing = groups.find((g) => g.value === val);
            if (existing) {
              existing.name = name;
            } else {
              groups.push({
                name,
                index: groups.length + 1,
                value: val ?? '',
              });
            }
          });
        }

        matches.push({
          index: 0,
          match: m[0],
          groups,
          start: m.index,
          end: m.index + m[0].length,
        });
      }
    }

    let replacement: string | undefined = undefined;
    if (replacePattern !== undefined) {
      const repRegex = new RegExp(pattern, flagStr);
      replacement = testString.replace(repRegex, replacePattern);
    }

    const duration = Math.round((performance.now() - start) * 100) / 100;

    return {
      success: true,
      matches,
      count: matches.length,
      replacement,
      executionTimeMs: duration,
    };
  } catch (err) {
    return {
      success: false,
      matches: [],
      count: 0,
      error: (err as Error).message,
      executionTimeMs: Math.round((performance.now() - start) * 100) / 100,
    };
  }
}
