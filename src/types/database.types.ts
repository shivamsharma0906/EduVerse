export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: 'student' | 'teacher' | 'admin' | 'recruiter';
          plan: 'free' | 'premium' | 'pro' | 'enterprise';
          created_at: string;
          onboarding_completed: boolean;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Row']>;
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          color_hex: string | null;
          parent_subject_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['subjects']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['subjects']['Row']>;
      };
      courses: {
        Row: {
          id: string;
          subject_id: string;
          title: string;
          description: string | null;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          thumbnail_url: string | null;
          is_published: boolean;
          author_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['courses']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['courses']['Row']>;
      };
      user_progress: {
        Row: {
          user_id: string;
          lesson_id: string;
          status: 'not_started' | 'in_progress' | 'completed';
          score: number | null;
          time_spent_seconds: number;
          completed_at: string | null;
        };
        Insert: Database['public']['Tables']['user_progress']['Row'];
        Update: Partial<Database['public']['Tables']['user_progress']['Row']>;
      };
      skill_scores: {
        Row: {
          user_id: string;
          skill_slug: string;
          score: number;
          confidence: number;
          last_updated: string;
        };
        Insert: Database['public']['Tables']['skill_scores']['Row'];
        Update: Partial<Database['public']['Tables']['skill_scores']['Row']>;
      };
      user_gamification: {
        Row: {
          user_id: string;
          xp_total: number;
          coins: number;
          current_streak: number;
          longest_streak: number;
          last_activity_date: string;
        };
        Insert: Database['public']['Tables']['user_gamification']['Row'];
        Update: Partial<Database['public']['Tables']['user_gamification']['Row']>;
      };
      tutor_sessions: {
        Row: {
          id: string;
          user_id: string;
          subject_id: string | null;
          started_at: string;
          ended_at: string | null;
          message_count: number;
          summary: string | null;
          embedding: number[] | null; // pgvector (1536 float array)
        };
        Insert: Omit<Database['public']['Tables']['tutor_sessions']['Row'], 'id' | 'started_at'>;
        Update: Partial<Database['public']['Tables']['tutor_sessions']['Row']>;
      };
      tutor_messages: {
        Row: {
          id: string;
          session_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          attachments: Json | null;
          tokens_used: number;
          model_used: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tutor_messages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['tutor_messages']['Row']>;
      };
    };
    Views: {
      leaderboards: {
        Row: {
          user_id: string;
          full_name: string;
          xp_total: number;
          current_streak: number;
        };
      };
    };
  };
}
