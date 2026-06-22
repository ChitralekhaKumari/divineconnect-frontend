// ─── Stats ───────────────────────────────────────────────────────────────────
export const statsData = [
  { value: '900+', label: 'Sacred Temples' },
  { value: '50+', label: 'Expert Pandits' },
  { value: '1M+', label: 'Puja Performed' },
  { value: '24/7', label: 'Live Support' },
];

// ─── Sacred Modules ──────────────────────────────────────────────────────────
export const sacredModulesData = [
  { id: 1, icon: '🙏', title: 'Bhajan of the Day', description: 'Daily curated devotional', color: 'bg-orange-50' },
  { id: 2, icon: '📖', title: 'Prayer Book', description: 'Slokas, stotras & mantras', color: 'bg-yellow-50' },
  { id: 3, icon: '🔔', title: 'Bhajan', description: 'Sacred bhajan collection', color: 'bg-amber-50' },
  { id: 4, icon: '📅', title: 'Calendar', description: 'Hindu festivals & tithis', color: 'bg-orange-50' },
  { id: 5, icon: '⚡', title: 'Karma', description: 'Daily spiritual actions', color: 'bg-yellow-50' },
  { id: 6, icon: '🕉️', title: 'Aarti', description: 'Sacred aarti rituals', color: 'bg-amber-50' },
  { id: 7, icon: '🌿', title: 'Devotional', description: 'Stories, hymns & poems', color: 'bg-orange-50' },
  { id: 8, icon: '⏰', title: 'Puja Timers', description: 'Muhurat & puja schedules', color: 'bg-yellow-50' },
  { id: 9, icon: '🌺', title: 'Pancha Puja', description: 'Five-fold puja guide', color: 'bg-amber-50' },
  { id: 10, icon: '📿', title: 'Jap Count', description: 'Digital mala counter', color: 'bg-orange-50' },
  { id: 11, icon: '🌙', title: 'Puja e-Form', description: 'Online puja booking form', color: 'bg-yellow-50' },
  { id: 12, icon: '🎵', title: 'Sacred Artice', description: 'Spiritual articles & reads', color: 'bg-amber-50' },
];

// ─── Temples ─────────────────────────────────────────────────────────────────
export const templesData = [
  { id: 1, name: 'Kashi Vishwanath', location: 'Varanasi, Uttar Pradesh', image: '/src/assets/images/temple-kashi.jpg', tag: 'LIVE', distance: '12 temples nearby' },
  { id: 2, name: 'Meenakshi Temple', location: 'Madurai, Tamil Nadu', image: '/src/assets/images/temple-meenakshi.jpg', tag: 'POPULAR', distance: '8 temples nearby' },
  { id: 3, name: 'Tirupati Balaji', location: 'Tirupati, Andhra Pradesh', image: '/src/assets/images/temple-tirupati.jpg', tag: 'FEATURED', distance: '5 temples nearby' },
  { id: 4, name: 'Somnath Temple', location: 'Veraval, Gujarat', image: '/src/assets/images/temple-somnath.jpg', tag: 'LIVE', distance: '3 temples nearby' },
];

// ─── Pujas ───────────────────────────────────────────────────────────────────
// export const pujasData = [
//   { id: 1, name: 'Ganga Aarti', temple: 'Kashi Vishwanath', image: '/src/assets/images/ritual-aarti.jpg', price: 1100, originalPrice: 1500, rating: 4.8, reviews: 245, tag: 'BESTSELLER' },
//   { id: 2, name: 'Rudrabhishek', temple: 'Kashi Vishwanath', image: '/src/assets/images/temple-meenakshi.jpg', price: 2100, originalPrice: 2800, rating: 4.9, reviews: 189, tag: 'POPULAR' },
//   { id: 3, name: 'Satyanarayana Seva', temple: 'Tirupati Balaji', image: '/src/assets/images/temple-tirupati.jpg', price: 1500, originalPrice: 2000, rating: 4.7, reviews: 312, tag: 'FEATURED' },
//   { id: 4, name: 'Evening Aarti', temple: 'Somnath Temple', image: '/src/assets/images/temple-somnath.jpg', price: 500, originalPrice: 800, rating: 5.0, reviews: 876, tag: 'LIVE' },
// ];

export const pujasData = [
  {
    id: 1,
    temple: 'KASHI VISHWANATH',
    name: 'Ganga Aarti',
    duration: '45 mins',
    price: 1100,
    image: '/src/assets/images/ritual-aarti.jpg',
  },
  {
    id: 2,
    temple: 'KASHI VISHWANATH',
    name: 'Rudrabhishek',
    duration: '1.5 hours',
    price: 2100,
    image: '/src/assets/images/temple-kashi.jpg',
  },
  {
    id: 3,
    temple: 'TIRUPATI BALAJI',
    name: 'Suprabhatam Seva',
    duration: '30 mins',
    price: 3500,
    image: '/src/assets/images/temple-tirupati.jpg',
  },
  {
    id: 4,
    temple: 'SOMNATH TEMPLE',
    name: 'Evening Aarti',
    duration: '30 mins',
    price: 501,
    image: '/src/assets/images/temple-somnath.jpg',
  },
];

// ─── Puja Tracker Steps ───────────────────────────────────────────────────────
export const trackerStepsData = [
  { id: 1, icon: '📝', label: 'Booking' },
  { id: 2, icon: '👨‍⚕️', label: 'Pandit Assigned' },
  { id: 3, icon: '📦', label: 'Puja Samagri' },
  { id: 4, icon: '📡', label: 'Live Streaming' },
  { id: 5, icon: '📜', label: 'Prasad Delivery' },
];

// ─── Offer Items ─────────────────────────────────────────────────────────────
export const offerItemsData = [
  { id: 1, icon: '🌸', name: 'Sacred Lotus Bundle', price: '₹299', tag: 'NEW' },
  { id: 2, icon: '🪔', name: 'Mangal Kalash', price: '₹499', tag: 'SALE' },
  { id: 3, icon: '🌺', name: 'Puja Vidhi Offering', price: '₹199', tag: '' },
  { id: 4, icon: '🔔', name: 'Ganesh Coconut', price: '₹149', tag: 'HOT' },
];

// ─── Why Choose Us ────────────────────────────────────────────────────────────
export const whyChooseUsData = [
  { id: 1, icon: '📺', title: 'Live Darshan', description: 'Watch sacred rituals live from top temples across India, anytime, anywhere.' },
  { id: 2, icon: '🤖', title: 'AI Spiritual Guide', description: 'Get personalized spiritual guidance powered by AI, available 24/7 for your queries.' },
  { id: 3, icon: '🕉️', title: 'Authentic Pujas', description: 'All pujas performed by verified, experienced pandits following Vedic traditions.' },
  { id: 4, icon: '💬', title: 'Easy to Communicate', description: 'Book, track and communicate with our team seamlessly through our platform.' },
  { id: 5, icon: '✅', title: 'VAS Friendly', description: 'Reliable value-added services that support your spiritual journey end to end.' },
  { id: 6, icon: '🌍', title: 'Spiritual Couples', description: 'Dedicated spiritual programs for couples, families and communities worldwide.' },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const testimonialsData = [
  { id: 1, name: 'Priya Sharma', location: 'Mumbai', avatar: 'PS', rating: 5, text: 'DivineConnect made it possible for me to attend the Rudrabhishek puja at Kashi from my home in Mumbai. The live streaming was crystal clear and the prasad arrived on time. Truly a divine experience!' },
  { id: 2, name: 'Rajesh Iyer', location: 'Bangalore', avatar: 'RI', rating: 5, text: 'The AI Guru feature is absolutely remarkable. I got answers to my spiritual questions instantly and the recommendations for puja timings were spot on. Highly recommend to every devotee.' },
  { id: 3, name: 'Ananya Gupta', location: 'Delhi', avatar: 'AG', rating: 5, text: 'Booked a Ganesh Chaturthi puja for my family through DivineConnect. Everything was smooth — pandit was punctual, samagri was authentic, and the whole experience felt sacred. Will use again!' },
];

// ─── Footer Links ─────────────────────────────────────────────────────────────
export const footerData = {
  brand: 'DivineConnect',
  tagline: 'Your Sacred Digital Sanctuary',
  description: 'We have been steadfastly serving devotees by connecting them with the divine through technology since 2020.',
  columns: [
    { title: 'Services', links: ['Book a Puja', 'Live Darshan', 'Astrology', 'AI Guru', 'Puja Tracker'] },
    { title: 'Temples', links: ['Varanasi', 'Tirupati', 'Shirdi', 'Vrindavan', 'Haridwar'] },
    { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Press', 'Contact'] },
    { title: 'Support', links: ['Help Center', 'Privacy Policy', 'Terms of Service', 'Refund Policy'] },
  ],
};
