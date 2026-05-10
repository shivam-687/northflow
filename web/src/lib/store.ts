import { create } from 'zustand';
import { supabase, type Goal, type Activity, type NeedleMover, type Reflection, type Profile } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AppState {
  // Auth
  user: User | null;
  profile: Profile | null;
  loading: boolean;

  // Goals
  activeGoal: Goal | null;
  goals: Goal[];

  // Today
  activities: Activity[];
  todayNeedleMover: NeedleMover | null;
  
  // Reflections
  reflections: Reflection[];

  // Actions
  setUser: (user: User | null) => void;
  fetchProfile: () => Promise<void>;
  fetchGoals: () => Promise<void>;
  fetchActivities: (date?: string) => Promise<void>;
  fetchTodayNeedleMover: () => Promise<void>;
  fetchReflections: () => Promise<void>;
  addActivity: (content: string, tag: string) => Promise<void>;
  setNeedleMover: (content: string) => Promise<void>;
  markNeedleMoverDone: () => Promise<void>;
  carryNeedleMover: () => Promise<void>;
  createGoal: (title: string, description: string, status: string, themes: string[]) => Promise<void>;
  updateGoalStatus: (goalId: string, status: string) => Promise<void>;
  addReflection: (mood: string | null, energy: number, note: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  activeGoal: null,
  goals: [],
  activities: [],
  todayNeedleMover: null,
  reflections: [],

  setUser: (user) => set({ user, loading: false }),

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (data) set({ profile: data });
  },

  fetchGoals: async () => {
    const { user } = get();
    if (!user) return;
    const { data } = await supabase
      .from('goals')
      .select('*, supporting_themes(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) {
      const activeGoal = data.find((g: Goal) => g.status === 'active') || null;
      set({ goals: data, activeGoal });
    }
  },

  fetchActivities: async (date?: string) => {
    const { user } = get();
    if (!user) return;
    const today = date || new Date().toISOString().split('T')[0];
    const startOfDay = `${today}T00:00:00.000Z`;
    const endOfDay = `${today}T23:59:59.999Z`;
    
    const { data } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startOfDay)
      .lte('created_at', endOfDay)
      .order('created_at', { ascending: false });
    if (data) set({ activities: data });
  },

  fetchTodayNeedleMover: async () => {
    const { user } = get();
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('needle_movers')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    set({ todayNeedleMover: data || null });
  },

  fetchReflections: async () => {
    const { user } = get();
    if (!user) return;
    const { data } = await supabase
      .from('reflections')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) set({ reflections: data });
  },

  addActivity: async (content, tag) => {
    const { user, activeGoal } = get();
    if (!user) return;
    const { data } = await supabase
      .from('activities')
      .insert({
        user_id: user.id,
        goal_id: activeGoal?.id || null,
        content,
        tag,
      })
      .select()
      .single();
    if (data) {
      set((state) => ({ activities: [data, ...state.activities] }));
    }
  },

  setNeedleMover: async (content) => {
    const { user } = get();
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('needle_movers')
      .insert({
        user_id: user.id,
        content,
        date: today,
      })
      .select()
      .single();
    if (data) set({ todayNeedleMover: data });
  },

  markNeedleMoverDone: async () => {
    const { todayNeedleMover } = get();
    if (!todayNeedleMover) return;
    const { data } = await supabase
      .from('needle_movers')
      .update({ status: 'done' })
      .eq('id', todayNeedleMover.id)
      .select()
      .single();
    if (data) set({ todayNeedleMover: data });
  },

  carryNeedleMover: async () => {
    const { todayNeedleMover } = get();
    if (!todayNeedleMover) return;
    const { data } = await supabase
      .from('needle_movers')
      .update({ status: 'carried' })
      .eq('id', todayNeedleMover.id)
      .select()
      .single();
    if (data) set({ todayNeedleMover: data });
  },

  createGoal: async (title, description, status, themes) => {
    const { user } = get();
    if (!user) return;
    
    // If making active, deactivate any existing active goal
    if (status === 'active') {
      await supabase
        .from('goals')
        .update({ status: 'paused' })
        .eq('user_id', user.id)
        .eq('status', 'active');
    }

    const { data: goal } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        title,
        description,
        status,
        started_at: status === 'active' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (goal && themes.length > 0) {
      await supabase
        .from('supporting_themes')
        .insert(themes.map((name) => ({ goal_id: goal.id, name })));
    }

    await get().fetchGoals();
  },

  updateGoalStatus: async (goalId, status) => {
    const { user } = get();
    if (!user) return;

    const updates: Record<string, unknown> = { status };
    if (status === 'active') {
      // Deactivate current active goal
      await supabase
        .from('goals')
        .update({ status: 'paused' })
        .eq('user_id', user.id)
        .eq('status', 'active');
      updates.started_at = new Date().toISOString();
    }
    if (status === 'completed') updates.completed_at = new Date().toISOString();
    if (status === 'archived') updates.archived_at = new Date().toISOString();

    await supabase
      .from('goals')
      .update(updates)
      .eq('id', goalId);

    await get().fetchGoals();
  },

  addReflection: async (mood, energy, note) => {
    const { user } = get();
    if (!user) return;
    const { data } = await supabase
      .from('reflections')
      .insert({
        user_id: user.id,
        mood,
        energy_level: energy,
        note,
      })
      .select()
      .single();
    if (data) {
      set((state) => ({ reflections: [data, ...state.reflections] }));
    }
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    if (data) {
      set({ profile: data });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({
      user: null,
      profile: null,
      activeGoal: null,
      goals: [],
      activities: [],
      todayNeedleMover: null,
      reflections: [],
    });
  },
}));
