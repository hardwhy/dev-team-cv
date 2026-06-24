import type { TeamMember } from '@dev-team-cv/shared-types';

export interface MemberColorSet {
  primary: string;
  accent: string;
  secondary: string;
  avatarBg: string;
}

export function getMemberColors(member: TeamMember): MemberColorSet {
  return {
    primary: member.favorite_color,
    accent: member.accent_color,
    secondary: member.secondary_color,
    avatarBg: member.avatar_background_color,
  };
}

export function getMemberCssVars(member: TeamMember): Record<string, string> {
  return {
    '--member-primary': member.favorite_color,
    '--member-accent': member.accent_color,
    '--member-secondary': member.secondary_color,
    '--member-avatar-bg': member.avatar_background_color,
  };
}
