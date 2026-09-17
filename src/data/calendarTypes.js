// Data + translations for the Calendar hub page (/calendar).
//
// The backend currently exposes a single, India-wide Panchang/festival feed
// (see calendarController.js) — there's no per-tradition data source yet.
// So each "calendar type" card here is a navigation entry into the same
// Panchang view (SpiritualCalendar), parameterized by `slug`. That keeps the
// UI honest about what's actually available today, while giving the page a
// clear seam to hang real per-tradition data on later (e.g. a `tradition`
// query param on the existing /api/calendar endpoints).

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'mr', label: 'मराठी' },
  { code: 'bn', label: 'বাংলা' },
];

export const DEFAULT_LANG = 'en';

// Icon is a lucide-react component name, resolved in CalendarHub.jsx —
// kept as a string here so this file stays framework-agnostic data.
export const CALENDAR_TYPES = [
  { slug: 'hindu', icon: 'Flame' },
  { slug: 'indian', icon: 'Landmark' },
  { slug: 'tamil', icon: 'Flower2' },
  { slug: 'telugu', icon: 'Sun' },
  { slug: 'kannada', icon: 'Drum' },
  { slug: 'malayalam', icon: 'Waves' },
  { slug: 'gujarati', icon: 'Gem' },
  { slug: 'marathi', icon: 'Mountain' },
  { slug: 'bengali', icon: 'Music' },
  { slug: 'odia', icon: 'Sparkles' },
  { slug: 'jain', icon: 'Leaf' },
  { slug: 'iskcon', icon: 'Users' },
  { slug: 'assamese', icon: 'Feather' },
];

export const CALENDAR_NAMES = {
  hindu: { en: 'Hindu Calendar', hi: 'हिन्दू कैलेंडर', ta: 'இந்து காலண்டர்', te: 'హిందూ క్యాలెండర్', kn: 'ಹಿಂದೂ ಕ್ಯಾಲೆಂಡರ್', ml: 'ഹിന്ദു കലണ്ടർ', gu: 'હિંદુ કેલેન્ડર', mr: 'हिंदू कॅलेंडर', bn: 'হিন্দু ক্যালেন্ডার' },
  indian: { en: 'Indian Calendar', hi: 'भारतीय कैलेंडर', ta: 'இந்திய காலண்டர்', te: 'భారతీయ క్యాలెండర్', kn: 'ಭಾರತೀಯ ಕ್ಯಾಲೆಂಡರ್', ml: 'ഇന്ത്യൻ കലണ്ടർ', gu: 'ભારતીય કેલેન્ડર', mr: 'भारतीय कॅलेंडर', bn: 'ভারতীয় ক্যালেন্ডার' },
  tamil: { en: 'Tamil Calendar', hi: 'तमिल कैलेंडर', ta: 'தமிழ் காலண்டர்', te: 'తమిళ క్యాలెండర్', kn: 'ತಮಿಳು ಕ್ಯಾಲೆಂಡರ್', ml: 'തമിഴ് കലണ്ടർ', gu: 'તમિલ કેલેન્ડર', mr: 'तमिळ कॅलेंडर', bn: 'তামিল ক্যালেন্ডার' },
  telugu: { en: 'Telugu Calendar', hi: 'तेलुगु कैलेंडर', ta: 'தெலுங்கு காலண்டர்', te: 'తెలుగు క్యాలెండర్', kn: 'ತೆಲುಗು ಕ್ಯಾಲೆಂಡರ್', ml: 'തെലുങ്ക് കലണ്ടർ', gu: 'તેલુગુ કેલેન્ડર', mr: 'तेलुगु कॅलेंडर', bn: 'তেলুগু ক্যালেন্ডার' },
  kannada: { en: 'Kannada Calendar', hi: 'कन्नड़ कैलेंडर', ta: 'கன்னட காலண்டர்', te: 'కన్నడ క్యాలెండర్', kn: 'ಕನ್ನಡ ಕ್ಯಾಲೆಂಡರ್', ml: 'കന്നഡ കലണ്ടർ', gu: 'કન્નડ કેલેન્ડર', mr: 'कन्नड कॅलेंडर', bn: 'কন্নড় ক্যালেন্ডার' },
  malayalam: { en: 'Malayalam Calendar', hi: 'मलयालम कैलेंडर', ta: 'மலையாள காலண்டர்', te: 'మలయాళ క్యాలెండర్', kn: 'ಮಲಯಾಳಂ ಕ್ಯಾಲೆಂಡರ್', ml: 'മലയാളം കലണ്ടർ', gu: 'મલયાલમ કેલેન્ડર', mr: 'मल्याळम कॅलेंडर', bn: 'মালায়ালাম ক্যালেন্ডার' },
  gujarati: { en: 'Gujarati Calendar', hi: 'गुजराती कैलेंडर', ta: 'குஜராத்தி காலண்டர்', te: 'గుజరాతీ క్యాలెండర్', kn: 'ಗುಜರಾತಿ ಕ್ಯಾಲೆಂಡರ್', ml: 'ഗുജറാത്തി കലണ്ടർ', gu: 'ગુજરાતી કેલેન્ડર', mr: 'गुजराती कॅलेंडर', bn: 'গুজরাটি ক্যালেন্ডার' },
  marathi: { en: 'Marathi Calendar', hi: 'मराठी कैलेंडर', ta: 'மராத்தி காலண்டர்', te: 'మరాఠీ క్యాలెండర్', kn: 'ಮರಾಠಿ ಕ್ಯಾಲೆಂಡರ್', ml: 'മറാത്തി കലണ്ടർ', gu: 'મરાઠી કેલેન્ડર', mr: 'मराठी कॅलेंडर', bn: 'মারাঠি ক্যালেন্ডার' },
  bengali: { en: 'Bengali Calendar', hi: 'बंगाली कैलेंडर', ta: 'வங்காள காலண்டர்', te: 'బెంగాలీ క్యాలెండర్', kn: 'ಬಂಗಾಳಿ ಕ್ಯಾಲೆಂಡರ್', ml: 'ബംഗാളി കലണ്ടർ', gu: 'બંગાળી કેલેન્ડર', mr: 'बंगाली कॅलेंडर', bn: 'বাংলা ক্যালেন্ডার' },
  odia: { en: 'Odia Calendar', hi: 'ओड़िया कैलेंडर', ta: 'ஒடியா காலண்டர்', te: 'ఒడియా క్యాలెండర్', kn: 'ಒಡಿಯಾ ಕ್ಯಾಲೆಂಡರ್', ml: 'ഒഡിയ കലണ്ടർ', gu: 'ઓડિયા કેલેન્ડર', mr: 'ओडिया कॅलेंडर', bn: 'ওড়িয়া ক্যালেন্ডার' },
  jain: { en: 'Jain Calendar', hi: 'जैन कैलेंडर', ta: 'ஜைன காலண்டர்', te: 'జైన క్యాలెండర్', kn: 'ಜೈನ ಕ್ಯಾಲೆಂಡರ್', ml: 'ജൈന കലണ്ടർ', gu: 'જૈન કેલેન્ડર', mr: 'जैन कॅलेंडर', bn: 'জৈন ক্যালেন্ডার' },
  iskcon: { en: 'ISKCON Calendar', hi: 'इस्कॉन कैलेंडर', ta: 'இஸ்கான் காலண்டர்', te: 'ఇస్కాన్ క్యాలెండర్', kn: 'ಇಸ್ಕಾನ್ ಕ್ಯಾಲೆಂಡರ್', ml: 'ഇസ്‌കോൺ കലണ്ടർ', gu: 'ઇસ્કોન કેલેન્ડર', mr: 'इस्कॉन कॅलेंडर', bn: 'ইসকন ক্যালেন্ডার' },
  assamese: { en: 'Assamese Calendar', hi: 'असमिया कैलेंडर', ta: 'அசாமிய காலண்டர்', te: 'అస్సామీ క్యాలెండర్', kn: 'ಅಸ್ಸಾಮಿ ಕ್ಯಾಲೆಂಡರ್', ml: 'അസമീസ് കലണ്ടർ', gu: 'આસામી કેલેન્ડર', mr: 'आसामी कॅलेंडर', bn: 'অসমীয়া ক্যালেন্ডার' },
};

export const UI_TEXT = {
  en: {
    home: 'Home', calendar: 'Calendar', title: 'Calendar',
    subtitle: 'Explore festivals, auspicious dates and Panchang across Indian traditions and regional calendars.',
    langLabel: 'Lang :', viewCalendar: 'View calendar',
    festivalsSuffix: 'Festivals', year: 'Year', nextYear: 'Next Year', prevYear: 'Previous Year',
    festivalsCol: 'Festivals', noFestivals: 'No listed festivals this month.',
    introTemplate: '{name} gives you details about all the important festivals and events occurring in the upcoming year. All that awaits you next year is presented here in this exclusive {name}.',
    monthCalendarSuffix: 'Calendar', seeFullCalendar: 'See full calendar', backToYear: 'Back to year view',
    panchangDetails: 'Panchang details', tithi: 'Tithi', nakshatra: 'Nakshatra', maas: 'Month (Maas)',
    loading: 'Loading...',
  },
  hi: {
    home: 'होम', calendar: 'कैलेंडर', title: 'कैलेंडर',
    subtitle: 'भारतीय परंपराओं और क्षेत्रीय कैलेंडर के अनुसार त्योहार, शुभ तिथियाँ और पंचांग जानें।',
    langLabel: 'भाषा :', viewCalendar: 'कैलेंडर देखें',
    festivalsSuffix: 'त्योहार', year: 'वर्ष', nextYear: 'अगला वर्ष', prevYear: 'पिछला वर्ष',
    festivalsCol: 'त्योहार', noFestivals: 'इस महीने कोई त्योहार सूचीबद्ध नहीं है।',
    introTemplate: '{name} आपको आगामी वर्ष में होने वाले सभी महत्वपूर्ण त्योहारों और घटनाओं की जानकारी देता है।',
    monthCalendarSuffix: 'कैलेंडर', seeFullCalendar: 'पूरा कैलेंडर देखें', backToYear: 'वर्ष दृश्य पर वापस जाएँ',
    panchangDetails: 'पंचांग विवरण', tithi: 'तिथि', nakshatra: 'नक्षत्र', maas: 'मास',
    loading: 'लोड हो रहा है...',
  },
  ta: {
    home: 'முகப்பு', calendar: 'நாட்காட்டி', title: 'நாட்காட்டி',
    subtitle: 'இந்திய பாரம்பரியங்கள் மற்றும் பிராந்திய நாட்காட்டிகளின்படி பண்டிகைகள், சுப தினங்கள் மற்றும் பஞ்சாங்கத்தை அறியுங்கள்.',
    langLabel: 'மொழி :', viewCalendar: 'நாட்காட்டியைப் பார்க்க',
  },
  te: {
    home: 'హోమ్', calendar: 'క్యాలెండర్', title: 'క్యాలెండర్',
    subtitle: 'భారతీయ సంప్రదాయాలు మరియు ప్రాంతీయ క్యాలెండర్ల ప్రకారం పండుగలు, శుభ తేదీలు మరియు పంచాంగాన్ని తెలుసుకోండి.',
    langLabel: 'భాష :', viewCalendar: 'క్యాలెండర్ చూడండి',
  },
  kn: {
    home: 'ಹೋಮ್', calendar: 'ಕ್ಯಾಲೆಂಡರ್', title: 'ಕ್ಯಾಲೆಂಡರ್',
    subtitle: 'ಭಾರತೀಯ ಸಂಪ್ರದಾಯಗಳು ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಕ್ಯಾಲೆಂಡರ್‌ಗಳ ಪ್ರಕಾರ ಹಬ್ಬಗಳು, ಶುಭ ದಿನಾಂಕಗಳು ಮತ್ತು ಪಂಚಾಂಗವನ್ನು ತಿಳಿಯಿರಿ.',
    langLabel: 'ಭಾಷೆ :', viewCalendar: 'ಕ್ಯಾಲೆಂಡರ್ ನೋಡಿ',
  },
  ml: {
    home: 'ഹോം', calendar: 'കലണ്ടർ', title: 'കലണ്ടർ',
    subtitle: 'ഇന്ത്യൻ പാരമ്പര്യങ്ങളും പ്രാദേശിക കലണ്ടറുകളും അനുസരിച്ച് ഉത്സവങ്ങൾ, ശുഭ ദിനങ്ങൾ, പഞ്ചാംഗം എന്നിവ അറിയുക.',
    langLabel: 'ഭാഷ :', viewCalendar: 'കലണ്ടർ കാണുക',
  },
  gu: {
    home: 'હોમ', calendar: 'કેલેન્ડર', title: 'કેલેન્ડર',
    subtitle: 'ભારતીય પરંપરાઓ અને પ્રાદેશિક કેલેન્ડર મુજબ તહેવારો, શુભ તારીખો અને પંચાંગ જાણો.',
    langLabel: 'ભાષા :', viewCalendar: 'કેલેન્ડર જુઓ',
  },
  mr: {
    home: 'होम', calendar: 'कॅलेंडर', title: 'कॅलेंडर',
    subtitle: 'भारतीय परंपरा आणि प्रादेशिक कॅलेंडरनुसार सण, शुभ तारखा आणि पंचांग जाणून घ्या.',
    langLabel: 'भाषा :', viewCalendar: 'कॅलेंडर पहा',
  },
  bn: {
    home: 'হোম', calendar: 'ক্যালেন্ডার', title: 'ক্যালেন্ডার',
    subtitle: 'ভারতীয় ঐতিহ্য ও আঞ্চলিক ক্যালেন্ডার অনুযায়ী উৎসব, শুভ তারিখ এবং পঞ্জিকা জানুন।',
    langLabel: 'ভাষা :', viewCalendar: 'ক্যালেন্ডার দেখুন',
  },
};

export function calendarName(slug, lang) {
  const entry = CALENDAR_NAMES[slug];
  if (!entry) return slug;
  return entry[lang] || entry.en;
}

// Every language falls back to the English strings for any key it doesn't
// define itself — so new UI text (added for the detail pages) doesn't have
// to be translated into all 9 languages before it can ship. Only the hub's
// original labels + Hindi currently have full coverage; the rest inherit
// English for the newer keys until translated.
export function uiText(lang) {
  return { ...UI_TEXT[DEFAULT_LANG], ...(UI_TEXT[lang] || {}) };
}
