import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useApps() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    let channel;

    async function load() {
      const { data } = await supabase.from('apps').select('*').order('sort_order', { ascending: true });
      setApps(data || []);
      setLoading(false);
    }
    load();

    channel = supabase
      .channel('apps_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'apps' }, load)
      .subscribe();

    return () => { if (channel) supabase.removeChannel(channel); };
  }, []);

  return { apps, loading };
}
