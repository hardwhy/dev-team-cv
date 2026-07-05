import { supabase } from './supabase-client';
import { parseSocialLinks } from './contact-links';
import type { TeamMember, TeamMemberInsert, TeamMemberUpdate } from '@dev-team-cv/shared-types';

function normalizeMember(raw: Record<string, unknown>): TeamMember {
  return {
    ...(raw as TeamMember),
    social_links: parseSocialLinks(raw.social_links),
  };
}

export const teamMembersApi = {
  async getAll(): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row) => normalizeMember(row));
  },

  async getById(id: string): Promise<TeamMember | null> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data ? normalizeMember(data) : null;
  },

  async create(member: TeamMemberInsert): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('team_members')
      .insert(member)
      .select()
      .single();
    if (error) throw error;
    if (!data) throw new Error('Failed to create team member');
    return normalizeMember(data);
  },

  async update(id: string, updates: TeamMemberUpdate): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('team_members')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    if (!data) throw new Error('Failed to update team member');
    return normalizeMember(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) throw error;
  },
};
