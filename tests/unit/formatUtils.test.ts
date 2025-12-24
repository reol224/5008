import { describe, it, expect } from 'vitest';
import {
  formatBulletText,
  formatDate,
  formatDateRange,
  analyzeBullet,
  suggestTenseCorrection,
  isBulletTooLong,
  isBulletLengthWarning,
  getBulletLengthStatus,
  FormatIssue,
} from '@/lib/formatUtils';

describe('formatBulletText', () => {
  it('returns empty string for empty input', () => {
    expect(formatBulletText('')).toBe('');
  });

  it('returns falsy input as-is', () => {
    expect(formatBulletText(null as unknown as string)).toBe(null);
    expect(formatBulletText(undefined as unknown as string)).toBe(undefined);
  });

  it('trims whitespace', () => {
    expect(formatBulletText('  hello world  ')).toBe('Hello world');
  });

  it('capitalizes first letter', () => {
    expect(formatBulletText('managed a team of 5 engineers')).toBe('Managed a team of 5 engineers');
  });

  it('removes trailing periods', () => {
    expect(formatBulletText('Led a project.')).toBe('Led a project');
    expect(formatBulletText('Led a project...')).toBe('Led a project');
  });

  it('cleans up multiple spaces', () => {
    expect(formatBulletText('Led   a    team')).toBe('Led a team');
  });

  it('normalizes line breaks', () => {
    expect(formatBulletText('Led a team\nof engineers')).toBe('Led a team of engineers');
    expect(formatBulletText('Led a team\r\nof engineers')).toBe('Led a team of engineers');
  });

  it('removes leading bullet characters', () => {
    expect(formatBulletText('• Led a team')).toBe('Led a team');
    expect(formatBulletText('- Led a team')).toBe('Led a team');
    expect(formatBulletText('* Led a team')).toBe('Led a team');
    expect(formatBulletText('→ Led a team')).toBe('Led a team');
  });

  it('handles combined formatting issues', () => {
    expect(formatBulletText('  • led   a team\nof engineers.  ')).toBe('Led a team of engineers');
  });
});

describe('formatDate', () => {
  it('returns empty string for empty input', () => {
    expect(formatDate('')).toBe('');
  });

  it('returns single year as-is', () => {
    expect(formatDate('2023')).toBe('2023');
    expect(formatDate(' 2023 ')).toBe('2023');
  });

  it('converts year range with en-dash', () => {
    expect(formatDate('2020-2023')).toBe('2020 – 2023');
  });

  it('formats year-month as "Mon Year"', () => {
    expect(formatDate('2023-01')).toBe('Jan 2023');
    expect(formatDate('2023-06')).toBe('Jun 2023');
    expect(formatDate('2023-12')).toBe('Dec 2023');
  });

  it('handles invalid month in year-month format', () => {
    expect(formatDate('2023-13')).toBe('2023 – 13');
    expect(formatDate('2023-00')).toBe('2023 – 00');
  });

  it('formats full ISO date as localized string', () => {
    const result = formatDate('2023-01-15');
    expect(result).toContain('Jan');
    expect(result).toContain('15');
    expect(result).toContain('2023');
  });

  it('returns other formats as-is', () => {
    expect(formatDate('Present')).toBe('Present');
    expect(formatDate('January 2023')).toBe('January 2023');
    expect(formatDate('Q1 2023')).toBe('Q1 2023');
  });
});

describe('formatDateRange', () => {
  it('returns empty string when both dates are empty', () => {
    expect(formatDateRange('', '')).toBe('');
  });

  it('formats date range with en-dash separator', () => {
    expect(formatDateRange('2020', '2023')).toBe('2020 – 2023');
  });

  it('handles Present as end date', () => {
    expect(formatDateRange('2020', 'Present')).toBe('2020 – Present');
  });

  it('formats year-month ranges', () => {
    const result = formatDateRange('2020-01', '2023-12');
    expect(result).toBe('Jan 2020 – Dec 2023');
  });
});

describe('analyzeBullet', () => {
  it('returns empty array for empty input', () => {
    expect(analyzeBullet('')).toEqual([]);
    expect(analyzeBullet('   ')).toEqual([]);
  });

  it('detects overly long bullets as error', () => {
    const longText = 'A'.repeat(160);
    const issues = analyzeBullet(longText);
    expect(issues).toContainEqual(expect.objectContaining({
      type: 'length',
      severity: 'error',
    }));
  });

  it('detects bullets approaching limit as warning', () => {
    const mediumText = 'A'.repeat(130);
    const issues = analyzeBullet(mediumText);
    expect(issues).toContainEqual(expect.objectContaining({
      type: 'length',
      severity: 'warning',
    }));
  });

  it('does not flag bullets within limit', () => {
    const shortText = 'Led a team of engineers';
    const issues = analyzeBullet(shortText);
    expect(issues.filter(i => i.type === 'length')).toHaveLength(0);
  });

  it('detects present tense at start', () => {
    const issues = analyzeBullet('Build new features');
    expect(issues).toContainEqual(expect.objectContaining({
      type: 'tense',
      severity: 'warning',
    }));
  });

  it('detects trailing periods', () => {
    const issues = analyzeBullet('Led a team of engineers.');
    expect(issues).toContainEqual(expect.objectContaining({
      type: 'punctuation',
      severity: 'warning',
      message: expect.stringContaining('period'),
    }));
  });

  it('detects double spaces', () => {
    const issues = analyzeBullet('Led a  team');
    expect(issues).toContainEqual(expect.objectContaining({
      type: 'spacing',
      severity: 'warning',
    }));
  });

  it('detects lowercase first letter', () => {
    const issues = analyzeBullet('led a team');
    expect(issues).toContainEqual(expect.objectContaining({
      type: 'punctuation',
      severity: 'warning',
      message: expect.stringContaining('capital'),
    }));
  });

  it('returns multiple issues when applicable', () => {
    const issues = analyzeBullet('building new features.');
    expect(issues.length).toBeGreaterThan(1);
    const types = issues.map(i => i.type);
    expect(types).toContain('tense');
    expect(types).toContain('punctuation');
  });
});

describe('suggestTenseCorrection', () => {
  it('returns null for empty input', () => {
    expect(suggestTenseCorrection('')).toBeNull();
  });

  it('returns null for past tense verbs', () => {
    expect(suggestTenseCorrection('Built a new feature')).toBeNull();
    expect(suggestTenseCorrection('Led a team')).toBeNull();
  });

  it('suggests past tense for present tense verbs', () => {
    expect(suggestTenseCorrection('Build a new feature')).toBe('Built a new feature');
    expect(suggestTenseCorrection('Lead a team')).toBe('Led a team');
    expect(suggestTenseCorrection('Manage projects')).toBe('Managed projects');
    expect(suggestTenseCorrection('Develop software')).toBe('Developed software');
  });

  it('handles -ing forms', () => {
    expect(suggestTenseCorrection('Building new features')).toBe('Built new features');
    expect(suggestTenseCorrection('Managing a team')).toBe('Managed a team');
  });

  it('handles -s forms', () => {
    expect(suggestTenseCorrection('Builds features')).toBe('Built features');
    expect(suggestTenseCorrection('Manages team')).toBe('Managed team');
  });

  it('preserves rest of sentence', () => {
    const result = suggestTenseCorrection('Create innovative solutions for complex problems');
    expect(result).toBe('Created innovative solutions for complex problems');
  });
});

describe('isBulletTooLong', () => {
  it('returns false for short bullets', () => {
    expect(isBulletTooLong('Short bullet')).toBe(false);
  });

  it('returns false for bullets at limit', () => {
    const atLimit = 'A'.repeat(150);
    expect(isBulletTooLong(atLimit)).toBe(false);
  });

  it('returns true for bullets over limit', () => {
    const overLimit = 'A'.repeat(151);
    expect(isBulletTooLong(overLimit)).toBe(true);
  });

  it('trims whitespace before checking', () => {
    const withWhitespace = '   ' + 'A'.repeat(140) + '   ';
    expect(isBulletTooLong(withWhitespace)).toBe(false);
  });
});

describe('isBulletLengthWarning', () => {
  it('returns false for short bullets', () => {
    expect(isBulletLengthWarning('Short bullet')).toBe(false);
  });

  it('returns false for bullets at warning threshold', () => {
    const atThreshold = 'A'.repeat(120);
    expect(isBulletLengthWarning(atThreshold)).toBe(false);
  });

  it('returns true for bullets in warning range', () => {
    const inRange = 'A'.repeat(130);
    expect(isBulletLengthWarning(inRange)).toBe(true);
  });

  it('returns false for bullets over max limit', () => {
    const overLimit = 'A'.repeat(160);
    expect(isBulletLengthWarning(overLimit)).toBe(false);
  });
});

describe('getBulletLengthStatus', () => {
  it('returns ok status for short bullets', () => {
    const result = getBulletLengthStatus('Short bullet');
    expect(result.status).toBe('ok');
    expect(result.length).toBe(12);
    expect(result.max).toBe(150);
    expect(result.warning).toBe(120);
  });

  it('returns warning status for medium bullets', () => {
    const mediumText = 'A'.repeat(130);
    const result = getBulletLengthStatus(mediumText);
    expect(result.status).toBe('warning');
    expect(result.length).toBe(130);
  });

  it('returns error status for long bullets', () => {
    const longText = 'A'.repeat(160);
    const result = getBulletLengthStatus(longText);
    expect(result.status).toBe('error');
    expect(result.length).toBe(160);
  });

  it('trims whitespace for length calculation', () => {
    const withWhitespace = '   Short   ';
    const result = getBulletLengthStatus(withWhitespace);
    expect(result.length).toBe(5);
  });
});
