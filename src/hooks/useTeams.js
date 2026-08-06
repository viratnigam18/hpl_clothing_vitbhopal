import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { TEAMS } from '@/data/mockData';

export function useTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTeams() {
      if (!isSupabaseConfigured) {
        setTeams(TEAMS);
        setLoading(false);
        return;
      }

      try {
        const { data, error: err } = await supabase
          .from('teams')
          .select('*')
          .order('sort_order', { ascending: true });

        if (err) throw err;
        setTeams(data || []);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError(err.message);
        // Fallback to mock data
        setTeams(TEAMS);
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);

  return { teams, loading, error };
}
