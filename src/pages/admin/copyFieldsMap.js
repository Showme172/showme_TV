// خريطة كل نصوص الموقع القابلة للتعديل، مجمّعة حسب الصفحة/القسم
// key: اسم الحقل بملف config.js (داخل CONFIG.copy)
// label: العنوان يلي بيظهر بلوحة التحكم
// long: true = مربع نص كبير (فقرة)، false/غير موجود = سطر واحد

export const COPY_GROUPS = [
  {
    title: 'الرئيسية — الهيدر',
    fields: [
      { key: 'heroLine', label: 'السطر الأول من العنوان الكبير' },
      { key: 'heroAccent', label: 'السطر الثاني (اللون الأحمر)' },
      { key: 'heroSub', label: 'الجملة التوضيحية تحت العنوان', long: true },
      { key: 'heroBtnSubscribe', label: 'زر "اشترك الآن"' },
      { key: 'heroBtnPlans', label: 'زر "الخطط"' },
    ],
  },
  {
    title: 'الرئيسية — المزايا',
    fields: [
      { key: 'featuresEyebrow', label: 'الوسم الصغير فوق العنوان' },
      { key: 'featuresHeading', label: 'عنوان القسم' },
      { key: 'featuresSub', label: 'الجملة التوضيحية', long: true },
      { key: 'showMoreLabel', label: 'زر "عرض المزيد"' },
      { key: 'showLessLabel', label: 'زر "عرض أقل"' },
    ],
  },
  {
    title: 'الرئيسية — القنوات',
    fields: [
      { key: 'channelsHeading', label: 'عنوان القسم' },
      { key: 'channelsSub', label: 'الجملة التوضيحية' },
    ],
  },
  {
    title: 'الرئيسية — تيزر الأسعار',
    fields: [
      { key: 'pricingTeaserEyebrow', label: 'الوسم الصغير' },
      { key: 'pricingTeaserHeading', label: 'العنوان' },
      { key: 'pricingTeaserSub', label: 'الجملة التوضيحية' },
      { key: 'pricingTeaserPrice', label: 'السعر المعروض (مثلاً €5)' },
      { key: 'pricingTeaserPricePeriod', label: 'المدة (مثلاً / شهر)' },
      { key: 'pricingTeaserNote', label: 'ملاحظة صغيرة تحت السعر' },
      { key: 'pricingTeaserBtn', label: 'نص الزر' },
    ],
  },
  {
    title: 'الرئيسية — قسم الدعوة الأخير',
    fields: [
      { key: 'ctaHeading', label: 'العنوان' },
      { key: 'ctaBtnTrial', label: 'زر "جرّب مجاناً"' },
      { key: 'ctaBtnContact', label: 'زر "تواصل معنا"' },
    ],
  },
  {
    title: 'صفحة الأسعار',
    fields: [
      { key: 'pricingEyebrow', label: 'الوسم الصغير' },
      { key: 'pricingH1', label: 'العنوان الرئيسي' },
      { key: 'pricingFaqEyebrow', label: 'وسم قسم الأسئلة الشائعة' },
      { key: 'pricingFaqHeading', label: 'عنوان الأسئلة الشائعة' },
      { key: 'pricingFaqSub', label: 'الجملة التوضيحية' },
      { key: 'pricingCtaHeading', label: 'عنوان قسم الدعوة الأخير' },
      { key: 'pricingCtaSub', label: 'الجملة التوضيحية' },
      { key: 'pricingCtaBtn', label: 'نص الزر' },
    ],
  },
  {
    title: 'صفحة تواصل معنا',
    fields: [
      { key: 'contactEyebrow', label: 'الوسم الصغير' },
      { key: 'contactH1', label: 'العنوان الرئيسي' },
      { key: 'contactIntro', label: 'الجملة التوضيحية', long: true },
      { key: 'contactInfoText', label: 'نص جانب طرق التواصل', long: true },
      { key: 'contactFormSubmit', label: 'نص زر إرسال الفورم' },
    ],
  },
  {
    title: 'صفحة آراء الزبائن',
    fields: [
      { key: 'reviewsEyebrow', label: 'الوسم الصغير' },
      { key: 'reviewsH1', label: 'العنوان الرئيسي' },
      { key: 'reviewsSub', label: 'الجملة التوضيحية' },
      { key: 'reviewsEmptyState', label: 'نص "ما في آراء بعد"' },
      { key: 'reviewsCtaHeading', label: 'عنوان قسم الدعوة الأخير' },
      { key: 'reviewsCtaSub', label: 'الجملة التوضيحية' },
    ],
  },
  {
    title: 'صفحة التطبيقات',
    fields: [
      { key: 'downloadsEyebrow', label: 'الوسم الصغير' },
      { key: 'downloadsH1', label: 'العنوان الرئيسي' },
      { key: 'downloadsSub', label: 'الجملة التوضيحية' },
      { key: 'downloadsEmptyState', label: 'نص "ما في تطبيقات بعد"' },
    ],
  },
  {
    title: 'شريط التنقل والفوتر',
    fields: [
      { key: 'navHome', label: 'رابط الرئيسية' },
      { key: 'navPricing', label: 'رابط الأسعار' },
      { key: 'navReviews', label: 'رابط آراء الزبائن' },
      { key: 'navDownloads', label: 'رابط التطبيقات' },
      { key: 'navContact', label: 'رابط تواصل معنا' },
      { key: 'navTrialBtn', label: 'زر "جرّب مجاناً" بالنافبار' },
      { key: 'navActivateBtn', label: 'زر "فعّل الآن" بالنافبار' },
      { key: 'footerBrandDesc', label: 'وصف البراند بالفوتر', long: true },
    ],
  },
  {
    title: 'اللايف تشات',
    fields: [
      { key: 'liveChatTitle', label: 'اسم النافذة (مثلاً "الدعم")' },
      { key: 'liveChatSubtitle', label: 'الوصف الصغير تحت الاسم' },
      { key: 'liveChatGreeting', label: 'رسالة الترحيب الأولى' },
      { key: 'liveChatEscalateBtn', label: 'زر "تحدث مع فريق الدعم"' },
    ],
  },
];
