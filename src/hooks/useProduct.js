import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getProductBySlug } from '@/data/mockData';

export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) {
        setLoading(false);
        return;
      }

      if (!isSupabaseConfigured) {
        setProduct(getProductBySlug(slug));
        setLoading(false);
        return;
      }

      try {
        const { data, error: err } = await supabase
          .from('products')
          .select(`
            *,
            team:teams(*),
            images:product_images(*, order: sort_order),
            variants:product_variants(*)
          `)
          .eq('slug', slug)
          .single();

        if (err) throw err;
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
        setProduct(getProductBySlug(slug));
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  return { product, loading, error };
}
