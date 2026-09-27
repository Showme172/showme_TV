/* =========================================================================
   SHOWME TV — English site text
   Mirrors config.js exactly in shape. Edit here for English wording.
   This file is NOT editable from the admin panel — the panel only edits
   Arabic text. English stays fixed until edited here directly.
   ========================================================================= */
export const CONFIG_EN = {

  telegramUsername: "Showme_TV",
  facebookUrl: "https://www.facebook.com/share/1Asdjmeo65/",
  whatsappNumber: "963982140920",
  contactEmail: "showmetvserver@gmail.com",

  copy: {
    // Home
    heroLine: "Professional IPTV subscription.",
    heroAccent: "Channels, movies, and instant support.",
    heroSub: "Stable, professional IPTV streaming — live channels in 4K, a massive library of movies and series, with activation in minutes.",
    heroBtnSubscribe: "Subscribe Now",
    heroBtnPlans: "Plans",
    featuresEyebrow: "// Why Showme TV",
    featuresHeading: "A clean signal, without interruption.",
    featuresSub: "Every part of the service is built to keep your stream stable — from server distribution to playback on your device.",
    channelsHeading: "Over 50,000 channels, in every category.",
    channelsSub: "Try it free and see for yourself.",
    showMoreLabel: "Show more",
    showLessLabel: "Show less",
    pricingTeaserEyebrow: "// Activation",
    pricingTeaserHeading: "Your subscription starts from just €5.",
    pricingTeaserSub: "Four flexible plans for everyone.",
    pricingTeaserPrice: "€5",
    pricingTeaserPricePeriod: "/ month",
    pricingTeaserNote: "Plus 6-month, yearly, and 2-year plans with bigger savings",
    pricingTeaserBtn: "View All Plans",
    ctaHeading: "Try it now.",
    ctaBtnTrial: "Try for Free",
    ctaBtnContact: "Contact Us",

    // Pricing page
    pricingEyebrow: "Subscription Plans",
    pricingH1: "Choose the plan that fits you.",
    pricingFaqEyebrow: "// FAQ",
    pricingFaqHeading: "Got a question?",
    pricingFaqSub: "The most common questions about subscribing and activation.",
    pricingCtaHeading: "Ready to activate your subscription?",
    pricingCtaSub: "Message us now and get your login details within minutes.",
    pricingCtaBtn: "Activate Now",

    // Contact page
    contactEyebrow: "We're Here to Help",
    contactH1: "Contact Us.",
    contactIntro: "Have a question or an activation issue? Pick whichever way works best for you, or fill out the form.",
    contactInfoText: "Our team is available around the clock to answer your questions and help with activation and setup.",
    contactFormSubmit: "Send Message",

    // Downloads page
    downloadsEyebrow: "Apps",
    downloadsH1: "Available Apps.",
    downloadsSub: "Pick the app that suits your device — direct download links, always updated to the latest version.",
    downloadsEmptyState: "No apps added yet.",

    // Guides page
    guidesEyebrow: "Guides",
    guidesH1: "Guides & Videos.",
    guidesSub: "Simple step-by-step videos for everything you need to know about your subscription.",
    guidesEmptyState: "No guides added yet.",

    // Footer
    footerBrandDesc: "Professional IPTV streaming, a massive movie and series library, and instant subscription activation — with a stable, uninterrupted signal.",

    // Navigation
    navHome: "Home",
    navPricing: "Pricing",
    navDownloads: "Apps",
    navGuides: "Guides",
    navContact: "Contact Us",
    navTrialBtn: "Try Free",
    navActivateBtn: "Activate Now",

    // Live chat
    liveChatTitle: "Support",
    liveChatSubtitle: "Usually replies within minutes",
    liveChatGreeting: "Hi! What's the issue or question you have?",
    liveChatEscalateBtn: "💬 Talk to support directly"
  },

  trustBadges: [
    { icon: "shield", label: "Safe & secure payment" },
    { icon: "bolt", label: "Instant activation in minutes" },
    { icon: "headset", label: "24/7 technical support" },
    { icon: "hd", label: "Thousands of happy subscribers" }
  ],

  features: [
    { icon: "hd",      title: "Ultra 4K quality",                desc: "Crisp, clear picture on sports, movies, and live news channels, with zero quality loss." },
    { icon: "globe",   title: "Over 50,000 live channels",        desc: "Sports, news, entertainment, and international and Arabic channels, in one constantly updated guide." },
    { icon: "bolt",    title: "Instant activation",               desc: "Streaming starts within minutes of subscribing. Your activation code and setup guide arrive right after payment." },
    { icon: "shield",  title: "99.9% uptime",                     desc: "Servers distributed across multiple regions to keep your stream running even during peak times and major events." },
    { icon: "grid",    title: "Over 200,000 movies and series",   desc: "A massive on-demand library, regularly updated, working on any device you connect from." },
    { icon: "headset", title: "Round-the-clock support",          desc: "A real support team, available in Arabic, English, and German, to help you whenever you need it." },
    { icon: "devices", title: "Works on all your devices",        desc: "Android, Smart TV, Firestick, MAG, and any device that supports IPTV apps — with one account." },
    { icon: "noAds",   title: "No annoying ads",                  desc: "A completely clean viewing experience, with no ad breaks ruining your watch." },
    { icon: "tag",     title: "Clear, competitive pricing",       desc: "No hidden fees, no surprises — the price you see is the price you pay, with options to fit every budget." }
  ],

  channelCategories: [
    { icon: "sport", name: "World Sports", count: "+2,500 channels", samples: ["beIN Sports", "OSN Sports", "SSC", "Sky Sports", "beIN Max"] },
    { icon: "movie", name: "Global Streaming Platforms", count: "Full library", samples: ["Netflix", "Disney+", "Apple TV+", "OSN+", "HBO Max"] },
    { icon: "news", name: "MBC Group", count: "+15 channels", samples: ["MBC 1", "MBC 2", "MBC Action", "MBC Drama", "MBC Masr"] },
    { icon: "kids", name: "Egyptian Channels", count: "Full coverage", samples: ["ON E", "CBC", "Al Hayah", "Al Nahar", "DMC"] },
    { icon: "doc", name: "Gulf & Saudi Channels", count: "Full coverage", samples: ["Rotana Khalijia", "SBC", "Al Ekhbariya", "Saudi Sports Channels"] },
    { icon: "music", name: "Algerian, Tunisian & Moroccan Channels", count: "Full coverage", samples: ["Ennahar", "Echorouk", "Tunisia National", "2M Morocco"] },
    { icon: "globe", name: "Jordanian & Palestinian Channels", count: "Full coverage", samples: ["Al Mamlaka", "Roya", "Palestine Today", "Al Aqsa"] },
    { icon: "sport", name: "Iraqi Channels", count: "Full coverage", samples: ["Al Iraqiya", "Al Sharqiya", "Al Sumaria", "Dijlah"] },
    { icon: "movie", name: "Lebanese & Syrian Channels", count: "Full coverage", samples: ["LBC", "MTV Lebanon", "Syria Satellite", "Syria Drama"] },
    { icon: "news", name: "News & Documentaries", count: "+900 channels", samples: ["Al Jazeera", "Al Arabiya", "Sky News Arabia", "National Geographic"] }
  ],

  plans: [
    {
      name: "Monthly", price: "€5", period: "/ month", sub: "Billed monthly", perk: null,
      features: ["Over 50,000 live channels", "Full movie & series library (+200,000)", "Standard support"],
      featured: false, badge: null,
      telegramMessage: "Hi, I'd like to activate a monthly subscription (€5) with Showme TV"
    },
    {
      name: "6 Months", price: "€25", period: "/ 6 months", sub: "Instead of €30 — save 17%", perk: null,
      features: ["Over 50,000 live channels", "Full movie & series library (+200,000)", "Priority support"],
      featured: false, badge: null,
      telegramMessage: "Hi, I'd like to activate a 6-month subscription (€25) with Showme TV"
    },
    {
      name: "Yearly", price: "€35", period: "/ year", sub: "Instead of €60 — save 42%",
      perk: "🎁 Free Showme TV app with your first subscription",
      features: ["Over 50,000 live channels", "Full movie & series library (+200,000)", "Priority support & free setup"],
      featured: true, badge: "Best Value",
      telegramMessage: "Hi, I'd like to activate a yearly subscription (€35) with Showme TV"
    },
    {
      name: "2 Years", price: "€60", period: "/ 2 years", sub: "Instead of €120 — save 50%",
      perk: "🎁 Free Showme TV app with your first subscription",
      features: ["Over 50,000 live channels", "Full movie & series library (+200,000)", "Priority support & free setup"],
      featured: false, badge: "Biggest Savings",
      telegramMessage: "Hi, I'd like to activate a 2-year subscription (€60) with Showme TV"
    }
  ],

  faq: [
    { q: "How do I get my subscription after paying?", a: "As soon as payment is confirmed, we'll send you your login details (username and password) and a setup guide within minutes." },
    { q: "What devices does Showme TV work on?", a: "It works on Android, Smart TV devices, Firestick, MAG, and any device that supports standard IPTV apps." },
    { q: "Can I change my plan later?", a: "Sure, you can switch between plans anytime, and the difference is calculated based on the remaining period." },
    { q: "Is there a free trial?", a: "Yes, you can request a short free trial before subscribing to check the service's quality and stability." }
  ],

  quickHelp: [
    {
      q: "Stream keeps buffering or freezing",
      a: "Try this in order: 1) Check your internet speed (15 Mbps or more is recommended). 2) Restart the app. 3) Switch to a different server from the app settings if available. If the issue continues, contact us and we'll help directly."
    },
    {
      q: "Forgot my login details",
      a: "No problem, send us the email or phone number you subscribed with and we'll resend your details within minutes."
    },
    {
      q: "I want to renew my subscription",
      a: "You can renew with the same old account details anytime, even if the subscription ended a while ago. Pick the plan that suits you and we'll activate it right away."
    },
    {
      q: "The app won't open",
      a: "Try clearing the app's cache from your device settings, or reinstall it. If the issue continues, contact us and let us know your exact device model."
    }
  ],

  messages: {
    trial:     "Hi, I'd like a free trial of Showme TV 🎬",
    activate:  "Hi, I'd like to activate a Showme TV subscription",
    subscribe: "Hi, I'd like to subscribe to Showme TV, what's the next step?"
  }
};
