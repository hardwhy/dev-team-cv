import { DEFAULT_ABOUT_VALUES, type AboutValue, type Project, type TeamMember } from '@dev-team-cv/shared-types';

export const ABOUT_VALUES_KEY = 'about_values';

export interface AboutStatDisplay {
  value: string;
  label: string;
}

function isAboutValue(item: unknown): item is AboutValue {
  return (
    typeof item === 'object' &&
    item !== null &&
    'title' in item &&
    'desc' in item &&
    typeof (item as AboutValue).title === 'string' &&
    typeof (item as AboutValue).desc === 'string'
  );
}

export function parseAboutValues(raw: string | undefined | null): AboutValue[] {
  if (!raw) return DEFAULT_ABOUT_VALUES;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_ABOUT_VALUES;
    const values = parsed.filter(isAboutValue);
    return values.length > 0 ? values : DEFAULT_ABOUT_VALUES;
  } catch {
    return DEFAULT_ABOUT_VALUES;
  }
}

export function computeAboutStats(members: TeamMember[], projects: Project[]): AboutStatDisplay[] {
  const totalYears = members.reduce((sum, member) => sum + member.years_of_experience, 0);
  return [
    { value: String(members.length), label: 'Engineers' },
    { value: `${projects.length}+`, label: 'Projects' },
    { value: `${totalYears}+`, label: 'Yrs combined' },
  ];
}
