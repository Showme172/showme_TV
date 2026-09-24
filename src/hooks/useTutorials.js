import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useTutorials() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    let channel;

    async function load() {
      const { data } = await supabase
        .from('tutorials')
        .select('*')
        .eq('status', 'published')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });
      setTutorials(data || []);
      setLoading(false);
    }
    load();

    channel = supabase
      .channel('tutorials_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tutorials' }, load)
      .subscribe();

    return () => { if (channel) supabase.removeChannel(channel); };
  }, []);

  return { tutorials, loading };
}
