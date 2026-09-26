import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useAnnouncement() {
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let channel;

    async function load() {
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!data) {
        setAnnouncement(null);
        return;
      }

      const ageHours = (Date.now() - new Date(data.created_at).getTime()) / 3600000;
      if (ageHours < data.duration_hours) {
        setAnnouncement(data);
      } else {
        setAnnouncement(null);
      }
    }

    load();
    channel = supabase
      .channel('announcements_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, load)
      .subscribe();

    return () => { if (channel) supabase.removeChannel(channel); };
  }, []);

  return announcement;
}
