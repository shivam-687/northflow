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
  ensureProfile: () => Promise<boolean>;
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

  ensureProfile: async () => {
    const { user } = get();
    if (!user) return false;

    // Check if profile exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (existing) {
      set({ profile: existing });
      return true;
    }

    // Auto-create profile if missing
    const { data: created, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || null,
        email: user.email || '',
        avatar_url: user.user_metadata?.avatar_url || null,
      })
      .select()
      .single();

    if (error) {
      console.error('[Store] ensureProfile error:', error.message);
      return false;
    }

    if (created) set({ profile: created });
    return true;
  },

  fetchProfile: async () => {
    const { user, ensureProfile } = get();
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('[Store] fetchProfile error:', error.message);
      return;
    }

    if (data) {
      set({ profile: data });
    } else {
      // Profile missing — auto-create it
      console.log('[Store] fetchProfile: no profile found, creating...');
      await ensureProfile();
    }
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
    const { data, error } = await supabase
      .from('needle_movers')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error && error.code !== 'PGRST116') {
      console.error('[Store] fetchTodayNeedleMover error:', error.message);
    }
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
    const { user, activeGoal, ensureProfile } = get();
    if (!user) {
      console.error('[Store] addActivity: no user');
      return;
    }

    const hasProfile = await ensureProfile();
    if (!hasProfile) {
      console.error('[Store] addActivity: failed to ensure profile');
      return;
    }

    const { data, error } = await supabase
      .from('activities')
      .insert({
        user_id: user.id,
        goal_id: activeGoal?.id || null,
        content,
        tag,
      })
      .select()
      .single();
    if (error) {
      console.error('[Store] addActivity error:', error.message);
      return;
    }
    if (data) {
      set((state) => ({ activities: [data, ...state.activities] }));
    }
  },

  setNeedleMover: async (content) => {
    const { user, ensureProfile } = get();
    if (!user) {
      console.error('[Store] setNeedleMover: no user');
      return;
    }

    const hasProfile = await ensureProfile();
    if (!hasProfile) {
      console.error('[Store] setNeedleMover: failed to ensure profile');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('needle_movers')
      .insert({
        user_id: user.id,
        content,
        date: today,
      })
      .select()
      .single();
    if (error) {
      console.error('[Store] setNeedleMover error:', error.message);
      return;
    }
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
    const { user, ensureProfile } = get();
    if (!user) {
      console.error('[Store] createGoal: no user');
      return;
    }

    // Ensure profile exists before creating goal
    const hasProfile = await ensureProfile();
    if (!hasProfile) {
      console.error('[Store] createGoal: failed to ensure profile');
      return;
    }
    
    try {
      // If making active, deactivate any existing active goal
      if (status === 'active') {
        const { error: deactivateError } = await supabase
          .from('goals')
          .update({ status: 'paused' })
          .eq('user_id', user.id)
          .eq('status', 'active');
        if (deactivateError) console.error('[Store] deactivate active goal error:', deactivateError.message);
      }

      const { data: goal, error: goalError } = await supabase
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

      if (goalError) {
        console.error('[Store] createGoal insert error:', goalError.message);
        return;
      }

      if (goal && themes.length > 0) {
        const { error: themesError } = await supabase
          .from('supporting_themes')
          .insert(themes.map((name) => ({ goal_id: goal.id, name })));
        if (themesError) console.error('[Store] insert themes error:', themesError.message);
      }

      await get().fetchGoals();
    } catch (err) {
      console.error('[Store] createGoal unexpected error:', err);
    }
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
    const { user, ensureProfile } = get();
    if (!user) {
      console.error('[Store] addReflection: no user');
      return;
    }

    const hasProfile = await ensureProfile();
    if (!hasProfile) {
      console.error('[Store] addReflection: failed to ensure profile');
      return;
    }

    const { data, error } = await supabase
      .from('reflections')
      .insert({
        user_id: user.id,
        mood,
        energy_level: energy,
        note,
      })
      .select()
      .single();
    if (error) {
      console.error('[Store] addReflection error:', error.message);
      return;
    }
    if (data) {
      set((state) => ({ reflections: [data, ...state.reflections] }));
    }
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) {
      console.error('[Store] updateProfile: no user');
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    if (error) {
      console.error('[Store] updateProfile error:', error.message, error.details, error.hint);
      return;
    }
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
