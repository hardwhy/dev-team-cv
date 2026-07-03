import { supabase } from './supabase-client';
import type { Project, ProjectInsert, ProjectUpdate, ProjectMember } from '@dev-team-cv/shared-types';

export const projectsApi = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*, team_members:project_members(team_members(*))')
      .order('start_date', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(normalizeProject);
  },

  async getFeatured(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*, team_members:project_members(team_members(*))')
      .eq('featured', true)
      .order('start_date', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(normalizeProject);
  },

  async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*, team_members:project_members(team_members(*))')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data ? normalizeProject(data) : null;
  },

  async getBySlug(slug: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*, team_members:project_members(team_members(*))')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return data ? normalizeProject(data) : null;
  },

  async create(project: ProjectInsert): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: ProjectUpdate): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },

  async assignMembers(projectId: string, memberIds: string[]): Promise<void> {
    await supabase.from('project_members').delete().eq('project_id', projectId);
    if (memberIds.length === 0) return;
    const rows: ProjectMember[] = memberIds.map((id) => ({
      project_id: projectId,
      team_member_id: id,
    }));
    const { error } = await supabase.from('project_members').insert(rows);
    if (error) throw error;
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeProject(raw: any): Project {
  return {
    ...raw,
    team_members: raw.team_members?.map((r: any) => r.team_members).filter(Boolean) ?? [],
  };
}
