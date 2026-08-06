import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getProductsWithDetails } from '@/data/mockData';

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { teamSlug, type } = filters;

  useEffect(() => {
    async function fetchProducts() {
      if (!isSupabaseConfigured) {
        setProducts(getProductsWithDetails({ teamSlug, type }));
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            team:teams(*),
            images:product_images(*),
            variants:product_variants(*)
          `)
          .order('name');

        if (teamSlug) {
          // Join filter: team slug
          const { data: teamData } = await supabase
            .from('teams')
            .select('id')
            .eq('slug', teamSlug)
            .single();
          if (teamData) {
            query = query.eq('team_id', teamData.id);
          }
        }

        if (type) {
          query = query.eq('type', type);
        }

        const { data, error: err } = await query;
        if (err) throw err;
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setProducts(getProductsWithDetails({ teamSlug, type }));
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [teamSlug, type]);

  return { products, loading, error };
}
