import { createContext, useContext, useEffect, useState } from 'react';
import { CONFIG as DEFAULT_CONFIG } from '../config';
import { CONFIG_EN } from '../config.en';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useLanguage } from './LanguageContext';

const ConfigContext = createContext({ config: DEFAULT_CONFIG, loading: false, live: false });

// دمج آمن: أي حقل نص جديد نضيفه بالمستقبل بيرجع افتراضياً حتى لو نسخة الأدمن المحفوظة قديمة وما فيها هالحقل
// وأي قائمة (مزايا، فئات قنوات، باقات...) لو انحفظت فاضية أو ناقصة بالغلط، بترجع للقيمة الافتراضية
// بدل ما تصير القوائم فاضية وتظهر أزرار "عرض المزيد" بدون محتوى تحتها.
function mergeConfig(saved) {
  const s = saved || {};
  const pickList = (key) => (Array.isArray(s[key]) && s[key].length > 0 ? s[key] : DEFAULT_CONFIG[key]);
  return {
    ...DEFAULT_CONFIG,
    ...s,
    copy: { ...DEFAULT_CONFIG.copy, ...(s.copy || {}) },
    messages: { ...DEFAULT_CONFIG.messages, ...(s.messages || {}) },
    trustBadges: pickList('trustBadges'),
    features: pickList('features'),
    channelCategories: pickList('channelCategories'),
    plans: pickList('plans'),
    faq: pickList('faq'),
    quickHelp: pickList('quickHelp'),
  };
}

export function ConfigProvider({ children }) {
  const { lang } = useLanguage();
  const [savedAr, setSavedAr] = useState(null); // تعديلات الأدمن (عربي فقط) من Supabase
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
        setSavedAr(data.data);
      }
      setLoading(false);
    }

    loadInitial();

    // تحديث فوري بدون رفرش لو حدا عدّل من لوحة الأدمن وهي الصفحة مفتوحة
    channel = supabase
      .channel('site_settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, (payload) => {
        if (payload.new?.data) {
          setSavedAr(payload.new.data);
        }
      })
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  // الإنجليزية ثابتة من config.en.js — تعديلات لوحة الأدمن (عربي فقط) ما بتنطبق عليها
  const config = lang === 'en' ? CONFIG_EN : mergeConfig(savedAr);

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
