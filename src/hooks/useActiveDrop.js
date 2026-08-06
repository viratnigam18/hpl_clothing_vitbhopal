import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getActiveDrop } from '@/data/mockData';

export function useActiveDrop() {
  const [drop, setDrop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDrop() {
      if (!isSupabaseConfigured) {
        setDrop(getActiveDrop());
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('drops')
          .select('*')
          .eq('is_active', true)
          .gt('ends_at', new Date().toISOString())
          .order('ends_at', { ascending: true })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
        setDrop(data || null);
      } catch (err) {
        console.error('Error fetching active drop:', err);
        setDrop(getActiveDrop());
      } finally {
        setLoading(false);
      }
    }

    fetchDrop();
  }, []);

  return { drop, loading };
}
