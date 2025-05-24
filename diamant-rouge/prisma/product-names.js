/**
 * Luxury jewelry fantasy name collections
 * These names are designed to evoke emotion and exclusivity
 * while being short and memorable
 */

// Collection of evocative French names for various jewelry categories
const fantasyNames = {
  rings: [
    // Elegant ring names
    'Éternité', 'Séduction', 'Passion', 'Destin', 'Promesse', 
    'Luna', 'Céleste', 'Étoile', 'Aurore', 'Soleil', 
    'Infini', 'Divine', 'Lumière', 'Victoire', 'Romance',
    'Enchantée', 'Rêveuse', 'Mystique', 'Élégance', 'Harmonie',
    'Mirage', 'Renaissance', 'Splendeur', 'Éclat', 'Oasis',
    'Royale', 'Impériale', 'Cascade', 'Duchesse', 'Comtesse'
  ],
  
  earrings: [
    // Captivating earring names
    'Cascade', 'Echo', 'Sirène', 'Ondine', 'Étincelle',
    'Murmure', 'Whisper', 'Papillon', 'Plume', 'Étoile',
    'Rosée', 'Velvet', 'Lueur', 'Mélodie', 'Diva',
    'Éclipse', 'Voltige', 'Danse', 'Harmonie', 'Crépuscule',
    'Aube', 'Nuit', 'Lune', 'Sérénité', 'Poésie'
  ],
  
  necklaces: [
    // Enchanting necklace names
    'Cascade', 'Rivière', 'Opulence', 'Élysée', 'Ariane',
    'Aphrodite', 'Vénus', 'Olympe', 'Délice', 'Délicatesse',
    'Muse', 'Étoile', 'Galaxie', 'Océane', 'Tempête',
    'Songe', 'Chimère', 'Envol', 'Arabesque', 'Aria',
    'Symphonie', 'Rhapsodie', 'Murmure', 'Caresse', 'Lumière'
  ],
  
  bracelets: [
    // Luxurious bracelet names
    'Caresse', 'Étreinte', 'Enlace', 'Lien', 'Fluidité',
    'Onde', 'Ruban', 'Cascade', 'Eclipse', 'Mirage',
    'Reflet', 'Souplesse', 'Émeraude', 'Serpentine', 'Spirale',
    'Songe', 'Arabesque', 'Vague', 'Épure', 'Rosée',
    'Secret', 'Ombre', 'Charme', 'Essence', 'Aura'
  ]
};

// Elegant adjectives to combine with material descriptions
const luxuryAdjectives = {
  fr: [
    'Précieux', 'Éblouissant', 'Magnifique', 'Somptueux', 'Exquis',
    'Raffiné', 'Prestigieux', 'Exclusif', 'Élégant', 'Éclatant',
    'Sublime', 'Gracieux', 'Majestueux', 'Enchanteur', 'Étincelant'
  ],
  en: [
    'Precious', 'Dazzling', 'Magnificent', 'Sumptuous', 'Exquisite',
    'Refined', 'Prestigious', 'Exclusive', 'Elegant', 'Radiant',
    'Sublime', 'Graceful', 'Majestic', 'Enchanting', 'Glistening'
  ],
  ar: [
    'ثمين', 'مبهر', 'رائع', 'فخم', 'رفيع',
    'أنيق', 'مرموق', 'حصري', 'أنيق', 'مشع',
    'رائع', 'رشيق', 'ملكي', 'ساحر', 'لامع'
  ]
};

/**
 * Generate a fantasy product name based on category
 * @param {string} category - Product category (rings, earrings, etc.)
 * @return {string} Fantasy product name
 */
function generateFantasyName(category) {
  const categoryNames = fantasyNames[category] || fantasyNames.rings;
  const randomIndex = Math.floor(Math.random() * categoryNames.length);
  return categoryNames[randomIndex];
}

/**
 * Generate rich product description with factual details
 * @param {string} language - Language code (fr, en, ar) 
 * @param {string} category - Product category
 * @param {string} metal - Metal type
 * @param {string} design - Design style
 * @param {string} features - Special features
 * @return {string} Detailed product description
 */
function generateRichDescription(language, category, metal, design, features) {
  if (language === 'fr') {
    const adjective = luxuryAdjectives.fr[Math.floor(Math.random() * luxuryAdjectives.fr.length)];
    return `${adjective} bijou en ${metal.toLowerCase()} avec un design ${design} mettant en valeur ${features}. Une pièce exceptionnelle alliant élégance intemporelle et artisanat minutieux de la plus haute qualité.`;
  } else if (language === 'en') {
    const adjective = luxuryAdjectives.en[Math.floor(Math.random() * luxuryAdjectives.en.length)];
    return `${adjective} ${metal.toLowerCase()} jewelry with a ${design} design showcasing ${features}. An exceptional piece combining timeless elegance and meticulous craftsmanship of the highest quality.`;
  } else {
    const adjective = luxuryAdjectives.ar[Math.floor(Math.random() * luxuryAdjectives.ar.length)];
    return `مجوهرات ${metal.toLowerCase()} ${adjective} بتصميم ${design} تعرض ${features}. قطعة استثنائية تجمع بين الأناقة الخالدة والحرفية الدقيقة بأعلى جودة.`;
  }
}

module.exports = {
  generateFantasyName,
  generateRichDescription
}; 