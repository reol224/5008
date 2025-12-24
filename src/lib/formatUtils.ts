// Real-time formatting utilities for resume content

export interface FormatIssue {
  type: 'tense' | 'punctuation' | 'length' | 'spacing';
  message: string;
  severity: 'warning' | 'error';
}

// Maximum recommended characters for a bullet point
const MAX_BULLET_LENGTH = 150;
const WARNING_BULLET_LENGTH = 120;

// Past tense action verb patterns for achievements
const PAST_TENSE_VERBS = [
  'achieved', 'built', 'created', 'delivered', 'designed', 'developed', 
  'established', 'generated', 'implemented', 'improved', 'increased', 
  'launched', 'led', 'managed', 'optimized', 'reduced', 'saved', 
  'streamlined', 'transformed', 'drove', 'grew', 'won', 'earned',
  'conducted', 'executed', 'spearheaded', 'pioneered', 'orchestrated'
];

// Present tense verbs that should be past tense in experience bullets
const PRESENT_TENSE_ISSUES = [
  { present: /^(achieve|achieves|achieving)\b/i, past: 'Achieved' },
  { present: /^(build|builds|building)\b/i, past: 'Built' },
  { present: /^(create|creates|creating)\b/i, past: 'Created' },
  { present: /^(deliver|delivers|delivering)\b/i, past: 'Delivered' },
  { present: /^(design|designs|designing)\b/i, past: 'Designed' },
  { present: /^(develop|develops|developing)\b/i, past: 'Developed' },
  { present: /^(establish|establishes|establishing)\b/i, past: 'Established' },
  { present: /^(generate|generates|generating)\b/i, past: 'Generated' },
  { present: /^(implement|implements|implementing)\b/i, past: 'Implemented' },
  { present: /^(improve|improves|improving)\b/i, past: 'Improved' },
  { present: /^(increase|increases|increasing)\b/i, past: 'Increased' },
  { present: /^(launch|launches|launching)\b/i, past: 'Launched' },
  { present: /^(lead|leads|leading)\b/i, past: 'Led' },
  { present: /^(manage|manages|managing)\b/i, past: 'Managed' },
  { present: /^(optimize|optimizes|optimizing)\b/i, past: 'Optimized' },
  { present: /^(reduce|reduces|reducing)\b/i, past: 'Reduced' },
  { present: /^(save|saves|saving)\b/i, past: 'Saved' },
  { present: /^(streamline|streamlines|streamlining)\b/i, past: 'Streamlined' },
  { present: /^(transform|transforms|transforming)\b/i, past: 'Transformed' },
  { present: /^(drive|drives|driving)\b/i, past: 'Drove' },
  { present: /^(grow|grows|growing)\b/i, past: 'Grew' },
  { present: /^(win|wins|winning)\b/i, past: 'Won' },
  { present: /^(conduct|conducts|conducting)\b/i, past: 'Conducted' },
  { present: /^(execute|executes|executing)\b/i, past: 'Executed' },
  { present: /^(spearhead|spearheads|spearheading)\b/i, past: 'Spearheaded' },
  { present: /^(pioneer|pioneers|pioneering)\b/i, past: 'Pioneered' },
  { present: /^(orchestrate|orchestrates|orchestrating)\b/i, past: 'Orchestrated' },
];

/**
 * Auto-format bullet point text
 * - Trims whitespace
 * - Capitalizes first letter
 * - Removes trailing period (resume convention)
 * - Cleans up multiple spaces
 * - Normalizes line breaks
 */
export function formatBulletText(text: string): string {
  if (!text) return text;
  
  let formatted = text
    // Normalize line breaks
    .replace(/[\r\n]+/g, ' ')
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    // Trim whitespace
    .trim()
    // Remove leading bullet characters if accidentally included
    .replace(/^[•\-\*\→]\s*/, '')
    // Capitalize first letter
    .replace(/^./, (char) => char.toUpperCase())
    // Remove trailing period (common resume convention)
    .replace(/\.+$/, '');
  
  return formatted;
}

/**
 * Format date strings (e.g., "2020-2023" → "2020 – 2023")
 */
export function formatDateRange(start: string, end: string): string {
  if (!start && !end) return '';
  const formattedStart = formatDate(start);
  const formattedEnd = formatDate(end);
  return `${formattedStart} – ${formattedEnd}`;
}

/**
 * Format individual date string
 */
export function formatDate(date: string): string {
  if (!date) return '';
  // Replace hyphens with en-dash for ranges within the date
  return date.replace(/-/g, ' – ');
}

/**
 * Analyze bullet point for issues
 */
export function analyzeBullet(text: string): FormatIssue[] {
  const issues: FormatIssue[] = [];
  
  if (!text || text.trim().length === 0) return issues;
  
  const trimmedText = text.trim();
  
  // Check length
  if (trimmedText.length > MAX_BULLET_LENGTH) {
    issues.push({
      type: 'length',
      message: `Bullet is too long (${trimmedText.length} chars). Consider shortening to under ${MAX_BULLET_LENGTH} characters.`,
      severity: 'error'
    });
  } else if (trimmedText.length > WARNING_BULLET_LENGTH) {
    issues.push({
      type: 'length',
      message: `Bullet is getting long (${trimmedText.length} chars). Consider keeping under ${WARNING_BULLET_LENGTH} characters.`,
      severity: 'warning'
    });
  }
  
  // Check for present tense at start (for past experience)
  const firstWord = trimmedText.split(' ')[0];
  for (const { present, past } of PRESENT_TENSE_ISSUES) {
    if (present.test(firstWord)) {
      issues.push({
        type: 'tense',
        message: `Consider using past tense: "${past}" instead of "${firstWord}"`,
        severity: 'warning'
      });
      break;
    }
  }
  
  // Check punctuation issues
  if (trimmedText.endsWith('.')) {
    issues.push({
      type: 'punctuation',
      message: 'Resume bullets typically don\'t end with periods',
      severity: 'warning'
    });
  }
  
  // Check for double spaces
  if (/\s{2,}/.test(trimmedText)) {
    issues.push({
      type: 'spacing',
      message: 'Contains multiple consecutive spaces',
      severity: 'warning'
    });
  }
  
  // Check if starts with lowercase
  if (/^[a-z]/.test(trimmedText)) {
    issues.push({
      type: 'punctuation',
      message: 'Bullets should start with a capital letter',
      severity: 'warning'
    });
  }
  
  return issues;
}

/**
 * Suggest tense correction for a bullet
 */
export function suggestTenseCorrection(text: string): string | null {
  if (!text) return null;
  
  const trimmedText = text.trim();
  const firstWord = trimmedText.split(' ')[0];
  
  for (const { present, past } of PRESENT_TENSE_ISSUES) {
    if (present.test(firstWord)) {
      return trimmedText.replace(present, past);
    }
  }
  
  return null;
}

/**
 * Check if a bullet point is overly long
 */
export function isBulletTooLong(text: string): boolean {
  return text.trim().length > MAX_BULLET_LENGTH;
}

/**
 * Check if a bullet point is approaching the length limit
 */
export function isBulletLengthWarning(text: string): boolean {
  const length = text.trim().length;
  return length > WARNING_BULLET_LENGTH && length <= MAX_BULLET_LENGTH;
}

/**
 * Get character count status for a bullet
 */
export function getBulletLengthStatus(text: string): {
  length: number;
  max: number;
  warning: number;
  status: 'ok' | 'warning' | 'error';
} {
  const length = text.trim().length;
  return {
    length,
    max: MAX_BULLET_LENGTH,
    warning: WARNING_BULLET_LENGTH,
    status: length > MAX_BULLET_LENGTH ? 'error' : length > WARNING_BULLET_LENGTH ? 'warning' : 'ok'
  };
}
