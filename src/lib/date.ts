// Front-matter dates are wall-clock times in the site's timezone, whatever timezone the build
// machine runs in. Formats use the moment.js tokens the theme config is written in.

import { config } from '../site.config';

const { timezone } = config.site;

const partsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: timezone,
  hourCycle: 'h23',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
});

interface Parts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

function zonedParts(date: Date): Parts {
  const parts = Object.fromEntries(
    partsFormatter.formatToParts(date).map(({ type, value }) => [type, Number(value)]),
  );
  return parts as unknown as Parts;
}

function offsetAt(utcMs: number): number {
  const p = zonedParts(new Date(utcMs));
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(utcMs / 1000) * 1000;
}

function fromWallClock(year: number, month: number, day: number, hour = 0, minute = 0, second = 0): Date {
  const wall = Date.UTC(year, month - 1, day, hour, minute, second);
  const guess = wall - offsetAt(wall);
  return new Date(wall - offsetAt(guess));
}

const rWallClock = /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;

/** A front-matter date: `2018/12/9 13:22:25` or a YAML timestamp, read in the site timezone. */
export function parseSiteDate(value: string | Date): Date {
  if (value instanceof Date) {
    // YAML timestamps without an offset arrive as UTC; their fields are the wall clock.
    return fromWallClock(
      value.getUTCFullYear(),
      value.getUTCMonth() + 1,
      value.getUTCDate(),
      value.getUTCHours(),
      value.getUTCMinutes(),
      value.getUTCSeconds(),
    );
  }
  const match = rWallClock.exec(value.trim());
  if (!match) throw new Error(`Unrecognized date "${value}"`);
  const [year, month, day, hour, minute, second] = match.slice(1).map((n) => Number(n ?? 0));
  return fromWallClock(year, month, day, hour, minute, second);
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const pad = (n: number) => String(n).padStart(2, '0');

/** Format with moment.js tokens: YYYY MMMM MM M DD D HH H mm ss a A, and LL. */
export function formatDate(date: Date, format: string): string {
  const p = zonedParts(date);
  const tokens: Record<string, string> = {
    YYYY: String(p.year),
    MMMM: monthNames[p.month - 1],
    MM: pad(p.month),
    M: String(p.month),
    DD: pad(p.day),
    D: String(p.day),
    HH: pad(p.hour),
    H: String(p.hour),
    mm: pad(p.minute),
    ss: pad(p.second),
    a: p.hour < 12 ? 'am' : 'pm',
    A: p.hour < 12 ? 'AM' : 'PM',
  };
  return format
    .replace(/\bLL\b/g, 'MMMM D, YYYY')
    .replace(/YYYY|MMMM|MM|M|DD|D|HH|H|mm|ss|a|A/g, (token) => tokens[token]);
}
