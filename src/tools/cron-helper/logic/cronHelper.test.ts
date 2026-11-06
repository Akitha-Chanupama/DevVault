import { describe, it, expect } from 'vitest';
import { evaluateCronExpression, explainCron } from './cronHelper';

describe('cronHelper logic', () => {
  it('explains standard cron expressions into human readable English', () => {
    const res1 = evaluateCronExpression('* * * * *');
    expect(res1.isValid).toBe(true);
    expect(res1.explanation).toBe('Every minute');
    expect(res1.nextDates).toHaveLength(5);

    const res2 = evaluateCronExpression('0 9 * * 1-5');
    expect(res2.isValid).toBe(true);
    expect(res2.explanation).toContain('At 09:00');
    expect(res2.explanation).toContain('Monday through Friday');
  });

  it('correctly calculates future execution occurrences', () => {
    const res = evaluateCronExpression('*/10 * * * *', 3);
    expect(res.isValid).toBe(true);
    expect(res.nextDates).toHaveLength(3);
    expect(res.nextDates[0].local).toBeTruthy();
    expect(res.nextDates[0].utc).toBeTruthy();
  });

  it('rejects invalid or malformed cron expressions with clear error', () => {
    const res = evaluateCronExpression('invalid cron');
    expect(res.isValid).toBe(false);
    expect(res.error).toBeTruthy();
  });

  it('explainCron provides accurate descriptions for day and month combos', () => {
    const expl = explainCron('30', '14', '15', '6', '1');
    expect(expl).toContain('At 14:30');
    expect(expl).toContain('day 15 of June');
    expect(expl).toContain('Monday');
  });
});

