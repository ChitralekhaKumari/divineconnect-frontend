// Categorizes a festival/holiday name into a religion/type bucket so the
// Indian Calendar view can color-code entries like the reference design.
//
// The backend's festival feed (a single Google "Indian holidays" calendar,
// see googleCalendarService.js) doesn't carry a category field — it's just
// name + date. Rather than block on a data-model change, we bucket by
// keyword match against the name. It's a heuristic, not authoritative, but
// it gets the same practical result: a scannable, color-coded list.
const RULES = [
  { key: 'islamic', test: /eid|ramzan|ramadan|muharram|milad|bakrid|shab[- ]?e[- ]?barat|shab[- ]?e[- ]?qadr/i },
  { key: 'christian', test: /christmas|good friday|easter|palm sunday|all souls|maundy thursday/i },
  { key: 'sikh', test: /guru\s|gurpurab|baisakhi|khalsa|guru nanak|guru gobind/i },
  { key: 'government', test: /republic day|independence day|gandhi jayanti|constitution day|labour day|may day/i },
  { key: 'jain', test: /mahavir jayanti|paryushan|jain/i },
  { key: 'buddhist', test: /buddha purnima|buddha jayanti/i },
];

export const CATEGORIES = {
  hindu: { color: '#dc2626', dot: '#dc2626' },
  islamic: { color: '#0d9488', dot: '#0d9488' },
  christian: { color: '#2563eb', dot: '#2563eb' },
  sikh: { color: '#7c3aed', dot: '#7c3aed' },
  government: { color: '#0891b2', dot: '#0891b2' },
  jain: { color: '#c2410c', dot: '#c2410c' },
  buddhist: { color: '#65a30d', dot: '#65a30d' },
};

export function categorizeFestival(name = '') {
  for (const rule of RULES) {
    if (rule.test.test(name)) return rule.key;
  }
  return 'hindu'; // default bucket — matches the source calendar's majority content
}

export const CATEGORY_LABELS = {
  en: { hindu: 'Hindu Festivals', government: 'Gov Holidays', sikh: 'Sikh Festivals', christian: 'Christian Holidays', islamic: 'Islamic Holidays', jain: 'Jain Festivals', buddhist: 'Buddhist Festivals' },
  hi: { hindu: 'हिन्दू त्योहार', government: 'सरकारी अवकाश', sikh: 'सिख पर्व', christian: 'ईसाई अवकाश', islamic: 'इस्लामिक अवकाश', jain: 'जैन पर्व', buddhist: 'बौद्ध पर्व' },
};

export function categoryLabel(key, lang) {
  const set = CATEGORY_LABELS[lang] || CATEGORY_LABELS.en;
  return set[key] || CATEGORY_LABELS.en[key] || key;
}
