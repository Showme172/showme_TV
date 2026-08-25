import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useLiveScores() {
  const [scores, setScores] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    let channel;

    async function load() {
      const { data } = await supabase.from('live_scores').select('*').eq('id', 1).single();
      if (data) {
        setScores(data.data || []);
        setIsLive(data.is_live);
      }
      setLoading(false);
    }
    load();

    channel = supabase
      .channel('live_scores_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_scores' }, load)
      .subscribe();

    return () => { if (channel) supabase.removeChannel(channel); };
  }, []);

  return { scores, isLive, loading };
}
