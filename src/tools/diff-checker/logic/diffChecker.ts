import { DiffLine, DiffSummary } from '../types';

/**
 * Computes line-level difference between two text strings using LCS algorithm
 */
export function computeLineDiff(originalText: string, modifiedText: string): DiffSummary {
  // Normalize newlines
  const origLines = originalText === '' ? [] : originalText.replace(/\r\n/g, '\n').split('\n');
  const modLines = modifiedText === '' ? [] : modifiedText.replace(/\r\n/g, '\n').split('\n');

  const n = origLines.length;
  const m = modLines.length;

  // Build DP table for LCS
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (origLines[i - 1] === modLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to extract diff lines
  const lines: DiffLine[] = [];
  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origLines[i - 1] === modLines[j - 1]) {
      lines.unshift({
        type: 'unchanged',
        value: origLines[i - 1],
        originalLineNumber: i,
        modifiedLineNumber: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      lines.unshift({
        type: 'added',
        value: modLines[j - 1],
        modifiedLineNumber: j,
      });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      lines.unshift({
        type: 'removed',
        value: origLines[i - 1],
        originalLineNumber: i,
      });
      i--;
    }
  }

  let additions = 0;
  let deletions = 0;
  let unchanged = 0;

  lines.forEach((line) => {
    if (line.type === 'added') additions++;
    else if (line.type === 'removed') deletions++;
    else unchanged++;
  });

  return {
    additions,
    deletions,
    unchanged,
    lines,
  };
}
