import { createContext, useContext, useEffect, useState } from 'react';
import { CONFIG as DEFAULT_CONFIG } from '../config';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const ConfigContext = createContext({ config: DEFAULT_CONFIG, loading: false, live: false });

// دمج آمن: أي حقل نص جديد نضيفه بالمستقبل بيرجع افتراضياً حتى لو نسخة الأدمن المحفوظة قديمة وما فيها هالحقل
function mergeConfig(saved) {
  return {
    ...DEFAULT_CONFIG,
    ...saved,
    copy: { ...DEFAULT_CONFIG.copy, ...(saved?.copy || {}) },
    messages: { ...DEFAULT_CONFIG.messages, ...(saved?.messages || {}) },
  };
}

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let channel;

    async function loadInitial() {
      const { data, error } = await supabase.from('site_settings').select('data').eq('id', 1).single();
      if (!error && data?.data) {
        setConfig(mergeConfig(data.data));
      }
      setLoading(false);
    }

    loadInitial();

    // تحديث فوري بدون رفرش لو حدا عدّل من لوحة الأدمن وهي الصفحة مفتوحة
    channel = supabase
      .channel('site_settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, (payload) => {
        if (payload.new?.data) {
          setConfig(mergeConfig(payload.new.data));
        }
      })
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ConfigContext.Provider value={{ config, loading, live: isSupabaseConfigured }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext).config;
}

export function useConfigMeta() {
  const { loading, live } = useContext(ConfigContext);
  return { loading, live };
}
