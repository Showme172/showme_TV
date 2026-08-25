import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    let channel;

    async function load() {
      const { data } = await supabase.from('reviews').select('*').order('sort_order', { ascending: true });
      setReviews(data || []);
      setLoading(false);
    }
    load();

    channel = supabase
      .channel('reviews_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, load)
      .subscribe();

    return () => { if (channel) supabase.removeChannel(channel); };
  }, []);

  return { reviews, loading };
}
