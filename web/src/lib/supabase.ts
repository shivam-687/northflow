import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client that stores session in cookies (so proxy/server can read it)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Profile {
  id: string;
  name: string | null;
  email: string;
  avatar_url: string | null;
  timezone: string | null;
  created_at: string;
}

export type GoalStatus = 'active' | 'future' | 'paused' | 'completed' | 'archived';

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: GoalStatus;
  started_at: string | null;
  completed_at: string | null;
  archived_at: string | null;
  created_at: string;
  supporting_themes?: SupportingTheme[];
}

export interface SupportingTheme {
  id: string;
  goal_id: string;
  name: string;
  created_at: string;
}

export type ActivityTag = 'goal' | 'learning' | 'admin' | 'noise';

export interface Activity {
  id: string;
  user_id: string;
  goal_id: string | null;
  content: string;
  tag: ActivityTag;
  created_at: string;
}

export type NeedleMoverStatus = 'pending' | 'done' | 'carried';

export interface NeedleMover {
  id: string;
  user_id: string;
  content: string;
  status: NeedleMoverStatus;
  date: string;
  created_at: string;
}

export interface Reflection {
  id: string;
  user_id: string;
  mood: string | null;
  energy_level: number | null;
  note: string | null;
  created_at: string;
}

export interface WeeklySummary {
  id: string;
  user_id: string;
  summary_text: string;
  alignment_score: number | null;
  week_start: string;
  created_at: string;
}
