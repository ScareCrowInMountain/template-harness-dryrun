/**
 * Database types. Regenerate after every migration:
 *   supabase gen types typescript --local > src/lib/database.types.ts
 * Hand-written placeholder for the template; CI does not check drift yet
 * (candidate for the next INCIDENTS.md row).
 */
export interface Database {
  public: {
    Tables: {
      health_checks: {
        Row: { id: number; note: string; created_at: string };
        Insert: { id?: never; note?: string; created_at?: string };
        Update: { id?: never; note?: string; created_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
