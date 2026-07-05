// ─── Contact Links ───────────────────────────────────────────────────────────

export interface ContactLink {
  /** URL-safe identifier, e.g. "github". */
  slug: string;
  /** Display text shown on the public site. */
  label: string;
  /** Destination URL or mailto: link. */
  url: string;
  /** Public URL of the uploaded icon image. */
  iconUrl: string;
}

export const DEFAULT_CONTACT_LINKS: ContactLink[] = [
  { slug: 'email', label: 'Email', url: 'mailto:hello@devteam.dev', iconUrl: '' },
  { slug: 'github', label: 'GitHub', url: 'https://github.com/dev-team', iconUrl: '' },
];

// ─── Team Member ────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  full_name: string;
  role: string[];
  profile_picture: string | null;
  short_bio: string;
  long_bio: string;
  years_of_experience: number;
  skills: string[];
  social_links: ContactLink[];
  favorite_color: string;
  accent_color: string;
  secondary_color: string;
  avatar_background_color: string;
  created_at: string;
  updated_at: string;
}

export type TeamMemberInsert = Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>;
export type TeamMemberUpdate = Partial<TeamMemberInsert>;

// ─── Project ─────────────────────────────────────────────────────────────────

export type ProjectType = 'web' | 'mobile' | 'desktop' | 'api' | 'other';

export interface Project {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  gallery_images: string[];
  description: string;
  technologies: string[];
  project_url: string | null;
  github_url: string | null;
  start_date: string | null;
  end_date: string | null;
  project_type: ProjectType;
  featured: boolean;
  created_at: string;
  updated_at: string;
  // joined
  team_members?: TeamMember[];
}

export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'team_members'>;
export type ProjectUpdate = Partial<ProjectInsert>;

// ─── Project–Member join ──────────────────────────────────────────────────────

export interface ProjectMember {
  project_id: string;
  team_member_id: string;
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export type ContactSubmissionInsert = Omit<ContactSubmission, 'id' | 'created_at'>;

// ─── Auth ────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'public';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

// ─── UI Helpers ──────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  section?: string;
}

export interface SkillBadge {
  name: string;
  color?: string;
  icon?: string;
}

export interface ConstellationNode {
  id: string;
  label: string;
  color: string;
  type: 'member' | 'project';
  x?: number;
  y?: number;
}

export interface ConstellationEdge {
  source: string;
  target: string;
}

// ─── About Section ───────────────────────────────────────────────────────────

export interface AboutValue {
  title: string;
  desc: string;
}

export const DEFAULT_ABOUT_VALUES: AboutValue[] = [
  { title: 'Craftsmanship', desc: 'We obsess over code quality, performance, and the details that make products feel exceptional.' },
  { title: 'Clarity', desc: 'We communicate openly, write clear code, and build systems that are easy to understand and extend.' },
  { title: 'Ownership', desc: 'We take full responsibility from design to deployment, treating every project as our own.' },
  { title: 'Collaboration', desc: 'Small team, big thinking. We work closely with clients and each other to deliver the best outcome.' },
];
