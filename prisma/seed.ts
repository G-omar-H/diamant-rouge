// Category mapping
const categoriesMap = {
  'rings': 1,
  'bracelets': 2,
  'necklaces': 3,
  'earrings': 4,
  'watches': 5
};

// Products data array
const products = [
  // Rings
  {
    sku: 'ROUGE-PASSION-001',
    basePrice: 4999.99,
    featured: true,
    categoryId: categoriesMap['rings'],
    images: ['/images/products/IMG_7719.png'],
    translations: [
      { language: 'en', name: 'Rouge Passion Diamond Ring', description: 'A symbol of eternal love, set with a rare crimson diamond in a delicate gold setting.' },
      { language: 'fr', name: 'Bague Diamant Rouge Passion', description: "Un symbole d'amour éternel, serti d'un diamant rouge rare dans une délicate monture en or." },
      { language: 'ar', name: 'خاتم الألماس روج باشون', description: 'رمز الحب الأبدي، مرصع بألماس قرمزي نادر في إطار ذهبي رقيق.' },
    ],
    variations: [
      { type: 'Size', value: '48', addPrice: 0, inventory: 5 },
      { type: 'Size', value: '50', addPrice: 0, inventory: 7 },
      { type: 'Size', value: '52', addPrice: 0, inventory: 10 },
      { type: 'Size', value: '54', addPrice: 0, inventory: 8 },
      { type: 'Size', value: '56', addPrice: 0, inventory: 6 },
    ]
  },
  {
    sku: 'PLATINUM-SOLITAIRE-001',
    basePrice: 7999.99,
    featured: true,
    categoryId: categoriesMap['rings'],
    images: ['/images/products/IMG_8043.png', '/images/products/IMG_8145.png'],
    translations: [
      { language: 'en', name: 'Platinum Solitaire Diamond Ring', description: 'The epitome of purity, featuring a flawless 2-carat diamond in a minimalist setting.' },
      { language: 'fr', name: 'Bague Solitaire en Platine', description: 'L\'apogée de la pureté, avec un diamant sans défaut de 2 carats dans un cadre minimaliste.' },
      { language: 'ar', name: 'خاتم الألماس البلاتيني المنفرد', description: 'رمز النقاء، يضم ألماسة خالية من العيوب بوزن 2 قيراط في إطار بسيط.' },
    ],
    variations: [
      { type: 'Size', value: '48', addPrice: 0, inventory: 3 },
      { type: 'Size', value: '50', addPrice: 0, inventory: 4 },
      { type: 'Size', value: '52', addPrice: 0, inventory: 5 },
      { type: 'Size', value: '54', addPrice: 0, inventory: 4 },
      { type: 'Size', value: '56', addPrice: 0, inventory: 3 },
    ]
  },
  {
    sku: 'EMERALD-ETERNITY-001',
    basePrice: 6499.99,
    featured: false,
    categoryId: categoriesMap['rings'],
    images: ['/images/products/IMG_7621.png', '/images/products/IMG_7637.png'],
    translations: [
      { language: 'en', name: 'Emerald Eternity Band', description: 'A magnificent band of emeralds encircling the finger in an eternal embrace of vibrant green.' },
      { language: 'fr', name: 'Alliance Éternité Émeraude', description: 'Une magnifique bande d\'émeraudes encerclant le doigt dans une étreinte éternelle d\'un vert éclatant.' },
      { language: 'ar', name: 'خاتم الزمرد الأبدي', description: 'حلقة رائعة من الزمرد تحيط بالإصبع في عناق أبدي من اللون الأخضر النابض بالحياة.' },
    ],
    variations: [
      { type: 'Size', value: '48', addPrice: 0, inventory: 4 },
      { type: 'Size', value: '50', addPrice: 0, inventory: 5 },
      { type: 'Size', value: '52', addPrice: 0, inventory: 5 },
      { type: 'Size', value: '54', addPrice: 0, inventory: 3 },
    ]
  },
  {
    sku: 'SAPPHIRE-CROWN-001',
    basePrice: 5899.99,
    featured: false,
    categoryId: categoriesMap['rings'],
    images: ['/images/products/IMG_7494 - Copy.png'],
    translations: [
      { language: 'en', name: 'Royal Sapphire Crown Ring', description: 'A majestic crown design showcasing brilliant blue sapphires surrounded by pavé diamonds.' },
      { language: 'fr', name: 'Bague Couronne Saphir Royal', description: 'Un design majestueux de couronne présentant de brillants saphirs bleus entourés de diamants pavés.' },
      { language: 'ar', name: 'خاتم تاج الياقوت الملكي', description: 'تصميم تاج ملكي يعرض الياقوت الأزرق اللامع محاطًا بالماس المرصع.' },
    ],
    variations: [
      { type: 'Size', value: '48', addPrice: 0, inventory: 4 },
      { type: 'Size', value: '50', addPrice: 0, inventory: 6 },
      { type: 'Size', value: '52', addPrice: 0, inventory: 6 },
      { type: 'Size', value: '54', addPrice: 0, inventory: 4 },
    ]
  },
  {
    sku: 'DIAMOND-INFINITY-001',
    basePrice: 4299.99,
    featured: true,
    categoryId: categoriesMap['rings'],
    images: ['/images/products/IMG_7410 - Copy.png', '/images/products/IMG_7412 - Copy.png'],
    translations: [
      { language: 'en', name: 'Diamond Infinity Ring', description: 'Symbolize endless love with this elegant infinity design adorned with brilliant-cut diamonds.' },
      { language: 'fr', name: 'Bague Infini Diamants', description: 'Symbolisez l\'amour éternel avec ce design élégant d\'infini orné de diamants taille brillant.' },
      { language: 'ar', name: 'خاتم الماس إنفينيتي', description: 'يرمز للحب الأبدي مع تصميم اللانهاية الأنيق المزين بالماس المقطوع بشكل لامع.' },
    ],
    variations: [
      { type: 'Size', value: '48', addPrice: 0, inventory: 5 },
      { type: 'Size', value: '50', addPrice: 0, inventory: 8 },
      { type: 'Size', value: '52', addPrice: 0, inventory: 8 },
      { type: 'Size', value: '54', addPrice: 0, inventory: 5 },
      { type: 'Size', value: '56', addPrice: 0, inventory: 3 },
    ]
  },
  {
    sku: 'RUBY-CLUSTER-001',
    basePrice: 6199.99,
    featured: false,
    categoryId: categoriesMap['rings'],
    images: ['/images/products/IMG_7446 - Copy.png', '/images/products/IMG_7452 - Copy.png'],
    translations: [
      { language: 'en', name: 'Ruby Cluster Statement Ring', description: 'A bold arrangement of precious rubies in a floral pattern, set in 18K yellow gold.' },
      { language: 'fr', name: 'Bague Statement Grappe de Rubis', description: 'Un arrangement audacieux de rubis précieux dans un motif floral, serti dans de l\'or jaune 18 carats.' },
      { language: 'ar', name: 'خاتم مجموعة الياقوت', description: 'ترتيب جريء من الياقوت الثمين في نمط زهري، مثبت في الذهب الأصفر عيار 18.' },
    ],
    variations: [
      { type: 'Size', value: '48', addPrice: 0, inventory: 3 },
      { type: 'Size', value: '50', addPrice: 0, inventory: 4 },
      { type: 'Size', value: '52', addPrice: 0, inventory: 4 },
      { type: 'Size', value: '54', addPrice: 0, inventory: 3 },
    ]
  },

  // Bracelets
  {
    sku: 'IMPERIAL-BRACELET-001',
    basePrice: 2999.99,
    featured: true,
    categoryId: categoriesMap['bracelets'],
    images: ['/images/products/IMG_7991.jpg'],
    translations: [
      { language: 'en', name: 'Imperial Gold Bracelet', description: 'A royal statement of elegance, crafted from 24k pure gold with intricate imperial patterns.' },
      { language: 'fr', name: 'Bracelet Impérial en Or', description: 'Une déclaration royale d\'élégance, fabriquée en or pur 24 carats avec des motifs impériaux complexes.' },
      { language: 'ar', name: 'سوار الإمبراطورية الذهبي', description: 'تصريح ملكي بالأناقة، مصنوع من الذهب الخالص عيار 24 بنقوش إمبراطورية معقدة.' },
    ],
    variations: [
      { type: 'Length', value: '16cm', addPrice: 0, inventory: 12 },
      { type: 'Length', value: '18cm', addPrice: 0, inventory: 15 },
      { type: 'Length', value: '20cm', addPrice: 100, inventory: 8 },
    ]
  },
  {
    sku: 'DIAMOND-TENNIS-001',
    basePrice: 4299.99,
    featured: true,
    categoryId: categoriesMap['bracelets'],
    images: ['/images/products/IMG_7841.png', '/images/products/IMG_8012.png'],
    translations: [
      { language: 'en', name: 'Diamond Tennis Bracelet', description: 'Classic elegance defined with a continuous line of brilliant-cut diamonds set in white gold.' },
      { language: 'fr', name: 'Bracelet Tennis Diamants', description: 'L\'élégance classique définie par une ligne continue de diamants taillés brillants sertis dans l\'or blanc.' },
      { language: 'ar', name: 'سوار التنس الماسي', description: 'الأناقة الكلاسيكية المعرَّفة بخط متواصل من الماس المقطوع البراق المثبت في الذهب الأبيض.' },
    ],
    variations: [
      { type: 'Length', value: '16cm', addPrice: 0, inventory: 6 },
      { type: 'Length', value: '18cm', addPrice: 0, inventory: 8 },
      { type: 'Length', value: '20cm', addPrice: 150, inventory: 4 },
    ]
  },
  {
    sku: 'EMERALD-DECO-001',
    basePrice: 5799.99,
    featured: false,
    categoryId: categoriesMap['bracelets'],
    images: ['/images/products/IMG_7456 - Copy.png', '/images/products/IMG_7466 - Copy.png'],
    translations: [
      { language: 'en', name: 'Art Deco Emerald Bracelet', description: 'Geometric Art Deco design featuring vibrant emeralds and diamonds set in platinum.' },
      { language: 'fr', name: 'Bracelet Émeraude Art Déco', description: 'Design géométrique Art Déco orné d\'émeraudes éclatantes et de diamants sertis dans le platine.' },
      { language: 'ar', name: 'سوار الزمرد آرت ديكو', description: 'تصميم آرت ديكو هندسي يتميز بالزمرد النابض والماس المثبت في البلاتين.' },
    ],
    variations: [
      { type: 'Length', value: '16cm', addPrice: 0, inventory: 5 },
      { type: 'Length', value: '18cm', addPrice: 0, inventory: 7 },
    ]
  },
  {
    sku: 'VINTAGE-GOLD-001',
    basePrice: 3799.99,
    featured: false,
    categoryId: categoriesMap['bracelets'],
    images: ['/images/products/IMG_7258 - Copy.png', '/images/products/IMG_7260 - Copy (2).png'],
    translations: [
      { language: 'en', name: 'Vintage Filigree Gold Bracelet', description: 'Intricately crafted with vintage filigree work in 18K yellow gold with pearl accents.' },
      { language: 'fr', name: 'Bracelet en Or Filigrane Vintage', description: 'Finement travaillé avec un ouvrage en filigrane vintage en or jaune 18 carats avec des accents de perles.' },
      { language: 'ar', name: 'سوار ذهبي فيليغري عتيق', description: 'مشغول بدقة بعمل فيليغري عتيق من الذهب الأصفر عيار 18 مع لمسات لؤلؤية.' },
    ],
    variations: [
      { type: 'Length', value: '16cm', addPrice: 0, inventory: 6 },
      { type: 'Length', value: '18cm', addPrice: 0, inventory: 6 },
    ]
  },
  {
    sku: 'SAPPHIRE-WAVE-001',
    basePrice: 4599.99,
    featured: true,
    categoryId: categoriesMap['bracelets'],
    images: ['/images/products/IMG_7282 - Copy.png', '/images/products/IMG_7292 - Copy.png'],
    translations: [
      { language: 'en', name: 'Sapphire Wave Bangle', description: 'Undulating waves of blue sapphires and pavé diamonds in a striking bangle design.' },
      { language: 'fr', name: 'Bracelet Jonc Vague Saphir', description: 'Vagues ondulantes de saphirs bleus et diamants pavés dans un design de jonc saisissant.' },
      { language: 'ar', name: 'إسورة موجة الياقوت', description: 'موجات متموجة من الياقوت الأزرق والماس المرصع في تصميم إسورة ملفت.' },
    ],
    variations: [
      { type: 'Size', value: 'Small', addPrice: 0, inventory: 4 },
      { type: 'Size', value: 'Medium', addPrice: 0, inventory: 5 },
      { type: 'Size', value: 'Large', addPrice: 0, inventory: 4 },
    ]
  },

  // Necklaces
  {
    sku: 'DIVINE-PEARL-001',
    basePrice: 3499.99,
    featured: true,
    categoryId: categoriesMap['necklaces'],
    images: ['/images/products/IMG_7810.png', '/images/products/IMG_7839.png'],
    translations: [
      { language: 'en', name: 'Divine Pearl Necklace', description: 'Exquisite South Sea pearls arranged in a cascading design, showcasing timeless elegance.' },
      { language: 'fr', name: 'Collier Perle Divine', description: 'Perles exquises des mers du Sud disposées en cascade, incarnant l\'élégance intemporelle.' },
      { language: 'ar', name: 'قلادة اللؤلؤ الإلهي', description: 'لآلئ بحر الجنوب الفاخرة مرتبة في تصميم متدرج، تُظهر الأناقة الخالدة.' },
    ],
    variations: [
      { type: 'Length', value: '42cm', addPrice: 0, inventory: 10 },
      { type: 'Length', value: '45cm', addPrice: 0, inventory: 12 },
      { type: 'Length', value: '50cm', addPrice: 200, inventory: 8 },
    ]
  },
  {
    sku: 'ROYAL-SAPPHIRE-001',
    basePrice: 6299.99,
    featured: true,
    categoryId: categoriesMap['necklaces'],
    images: ['/images/products/IMG_7589.png', '/images/products/IMG_7587.2.png'],
    translations: [
      { language: 'en', name: 'Royal Sapphire Pendant', description: 'A magnificent blue sapphire surrounded by diamonds in a halo setting, suspended from an 18K white gold chain.' },
      { language: 'fr', name: 'Pendentif Saphir Royal', description: 'Un magnifique saphir bleu entouré de diamants dans un sertissage en halo, suspendu à une chaîne en or blanc 18 carats.' },
      { language: 'ar', name: 'قلادة الياقوت الملكي', description: 'ياقوتة زرقاء رائعة محاطة بالماس في إطار هالة، معلقة من سلسلة ذهبية بيضاء عيار 18.' },
    ],
    variations: [
      { type: 'Length', value: '42cm', addPrice: 0, inventory: 8 },
      { type: 'Length', value: '45cm', addPrice: 0, inventory: 9 },
      { type: 'Length', value: '50cm', addPrice: 150, inventory: 6 },
    ]
  },
  {
    sku: 'DIAMOND-RIVIERE-001',
    basePrice: 8999.99,
    featured: false,
    categoryId: categoriesMap['necklaces'],
    images: ['/images/products/IMG_7319 - Copy.png', '/images/products/IMG_7331 - Copy.png'],
    translations: [
      { language: 'en', name: 'Diamond Rivière Necklace', description: 'A classic river of graduated diamonds totaling 10 carats, creating a sparkling cascade around the neck.' },
      { language: 'fr', name: 'Collier Rivière de Diamants', description: 'Une rivière classique de diamants gradués totalisant 10 carats, créant une cascade étincelante autour du cou.' },
      { language: 'ar', name: 'عقد الماس ريفييه', description: 'نهر كلاسيكي من الماس المتدرج بإجمالي 10 قيراط، مما يخلق شلالًا متلألئًا حول الرقبة.' },
    ],
    variations: [
      { type: 'Length', value: '40cm', addPrice: 0, inventory: 3 },
      { type: 'Length', value: '42cm', addPrice: 0, inventory: 4 },
      { type: 'Length', value: '45cm', addPrice: 150, inventory: 3 },
    ]
  },
  {
    sku: 'EMERALD-CASCADE-001',
    basePrice: 5699.99,
    featured: true,
    categoryId: categoriesMap['necklaces'],
    images: ['/images/products/IMG_7641,2.png', '/images/products/IMG_7793.png'],
    translations: [
      { language: 'en', name: 'Emerald Cascade Necklace', description: 'Graduated emerald droplets form a lush green cascade, interspersed with brilliant-cut diamonds.' },
      { language: 'fr', name: 'Collier Cascade d\'Émeraudes', description: 'Des gouttelettes d\'émeraude graduées forment une cascade verte luxuriante, parsemée de diamants taille brillant.' },
      { language: 'ar', name: 'قلادة شلال الزمرد', description: 'قطرات زمردية متدرجة تشكل شلالًا أخضر فاخرًا، متخللة بالماس المقطوع البراق.' },
    ],
    variations: [
      { type: 'Length', value: '42cm', addPrice: 0, inventory: 5 },
      { type: 'Length', value: '45cm', addPrice: 0, inventory: 7 },
      { type: 'Length', value: '50cm', addPrice: 200, inventory: 4 },
    ]
  },
  {
    sku: 'HERITAGE-LOCKET-001',
    basePrice: 2899.99,
    featured: false,
    categoryId: categoriesMap['necklaces'],
    images: ['/images/products/IMG_7392 - Copy.png', '/images/products/IMG_7396 - Copy.png'],
    translations: [
      { language: 'en', name: 'Heritage Diamond Locket', description: 'A vintage-inspired gold locket adorned with diamonds and sapphires on a delicate chain.' },
      { language: 'fr', name: 'Médaillon Diamant Héritage', description: 'Un médaillon en or d\'inspiration vintage orné de diamants et saphirs sur une chaîne délicate.' },
      { language: 'ar', name: 'قلادة ميدالية الماس التراثية', description: 'ميدالية ذهبية مستوحاة من الطراز القديم مزينة بالماس والياقوت على سلسلة رقيقة.' },
    ],
    variations: [
      { type: 'Chain Length', value: '42cm', addPrice: 0, inventory: 8 },
      { type: 'Chain Length', value: '45cm', addPrice: 0, inventory: 9 },
    ]
  },

  // Earrings
  {
    sku: 'SAPPHIRE-CASCADE-001',
    basePrice: 3299.99,
    featured: false,
    categoryId: categoriesMap['earrings'],
    images: ['/images/products/IMG_8570.png', '/images/products/IMG_8578.png'],
    translations: [
      { language: 'en', name: 'Sapphire Cascade Earrings', description: 'Delicate cascades of Ceylon sapphires set in white gold for an ethereal effect.' },
      { language: 'fr', name: 'Boucles d\'Oreilles Cascade de Saphirs', description: 'Délicates cascades de saphirs de Ceylan serties dans de l\'or blanc pour un effet éthéré.' },
      { language: 'ar', name: 'أقراط الياقوت المتدفقة', description: 'شلالات رقيقة من الياقوت السيلاني مرصعة في الذهب الأبيض لتأثير أثيري.' },
    ],
    variations: [
      { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 8 },
      { type: 'Metal', value: 'Rose Gold', addPrice: 150, inventory: 6 },
    ]
  },
  {
    sku: 'DIAMOND-STUD-001',
    basePrice: 2499.99,
    featured: true,
    categoryId: categoriesMap['earrings'],
    images: ['/images/products/IMG_7366 - Copy.png', '/images/products/IMG_7381 - Copy.png'],
    translations: [
      { language: 'en', name: 'Classic Diamond Studs', description: 'Timeless elegance with 2-carat brilliant-cut diamonds in a four-prong platinum setting.' },
      { language: 'fr', name: 'Clous d\'Oreilles Diamants Classiques', description: 'Élégance intemporelle avec des diamants taille brillant de 2 carats dans un sertissage à quatre griffes en platine.' },
      { language: 'ar', name: 'أقراط الماس الكلاسيكية', description: 'أناقة خالدة مع الماس المقطوع البراق بوزن 2 قيراط في إعداد من البلاتين بأربعة شعب.' },
    ],
    variations: [
      { type: 'Carat', value: '1.0', addPrice: -500, inventory: 10 },
      { type: 'Carat', value: '2.0', addPrice: 0, inventory: 8 },
      { type: 'Carat', value: '3.0', addPrice: 2000, inventory: 5 },
    ]
  },
  {
    sku: 'EMERALD-HALO-001',
    basePrice: 3799.99,
    featured: false,
    categoryId: categoriesMap['earrings'],
    images: ['/images/products/IMG_7415 - Copy.png', '/images/products/IMG_7439 - Copy.png'],
    translations: [
      { language: 'en', name: 'Emerald Halo Drop Earrings', description: 'Elegant drop earrings featuring Colombian emeralds surrounded by a halo of diamonds.' },
      { language: 'fr', name: 'Boucles d\'Oreilles Pendantes Halo Émeraude', description: 'Élégantes boucles d\'oreilles pendantes avec des émeraudes colombiennes entourées d\'un halo de diamants.' },
      { language: 'ar', name: 'أقراط هالة الزمرد المتدلية', description: 'أقراط متدلية أنيقة تتميز بالزمرد الكولومبي محاط بهالة من الماس.' },
    ],
    variations: [
      { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 7 },
      { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 6 },
    ]
  },
  {
    sku: 'PEARL-CLIMBER-001',
    basePrice: 1899.99,
    featured: false,
    categoryId: categoriesMap['earrings'],
    images: ['/images/products/IMG_0363 - Copy (2).png', '/images/products/IMG_5585 - Copy (2).png'],
    translations: [
      { language: 'en', name: 'Pearl Climber Earrings', description: 'Elegant ear climbers with graduated Akoya pearls and diamond accents in 18K gold.' },
      { language: 'fr', name: 'Boucles d\'Oreilles Grimpantes Perle', description: 'Élégantes boucles d\'oreilles grimpantes avec des perles Akoya graduées et des accents de diamants en or 18K.' },
      { language: 'ar', name: 'أقراط لؤلؤ متسلقة', description: 'أقراط أذن أنيقة متسلقة مع لآلئ أكويا متدرجة ولمسات من الماس في الذهب عيار 18.' },
    ],
    variations: [
      { type: 'Metal', value: 'Yellow Gold', addPrice: 0, inventory: 7 },
      { type: 'Metal', value: 'White Gold', addPrice: 0, inventory: 7 },
      { type: 'Metal', value: 'Rose Gold', addPrice: 0, inventory: 6 },
    ]
  },

  // Watches
  {
    sku: 'GRAND-CHRONOGRAPH-001',
    basePrice: 15999.99,
    featured: true,
    categoryId: categoriesMap['watches'],
    images: ['/images/products/IMG_8582.png', '/images/products/IMG_8586.png'],
    translations: [
      { language: 'en', name: 'Grand Tourbillon Chronograph', description: 'A masterpiece of horology featuring a hand-finished tourbillon movement and perpetual calendar.' },
      { language: 'fr', name: 'Grand Chronographe Tourbillon', description: 'Un chef-d\'œuvre d\'horlogerie avec un mouvement tourbillon fini à la main et un calendrier perpétuel.' },
      { language: 'ar', name: 'كرونوغراف توربيون غراند', description: 'تحفة فنية في صناعة الساعات تتميز بحركة توربيون مصقولة يدويًا وتقويم دائم.' },
    ],
    variations: [
      { type: 'Material', value: 'Rose Gold', addPrice: 0, inventory: 3 },
      { type: 'Material', value: 'White Gold', addPrice: 0, inventory: 3 },
      { type: 'Material', value: 'Platinum', addPrice: 4000, inventory: 2 },
    ]
  },
  {
    sku: 'LUNA-MOONPHASE-001',
    basePrice: 8499.99,
    featured: true,
    categoryId: categoriesMap['watches'],
    images: ['/images/products/IMG_8611.png', '/images/products/IMG_8620.png'],
    translations: [
      { language: 'en', name: 'Luna Moonphase Watch', description: 'Elegant timepiece with precision moonphase complication and diamond-set bezel.' },
      { language: 'fr', name: 'Montre Phase de Lune Luna', description: 'Élégante montre avec complication précise de phase de lune et lunette sertie de diamants.' },
      { language: 'ar', name: 'ساعة لونا بمراحل القمر', description: 'ساعة أنيقة مع تعقيد دقيق لمراحل القمر وإطار مرصع بالماس.' },
    ],
    variations: [
      { type: 'Material', value: 'Stainless Steel', addPrice: -1000, inventory: 8 },
      { type: 'Material', value: 'Rose Gold', addPrice: 0, inventory: 5 },
      { type: 'Material', value: 'White Gold', addPrice: 0, inventory: 5 },
    ]
  },
  {
    sku: 'AQUA-DIVER-001',
    basePrice: 6299.99,
    featured: false,
    categoryId: categoriesMap['watches'],
    images: ['/images/products/IMG_8016.png', '/images/products/IMG_8021.png'],
    translations: [
      { language: 'en', name: 'Aqua Professional Diver', description: 'Precision diving watch water-resistant to 300 meters with automatic movement and ceramic bezel.' },
      { language: 'fr', name: 'Plongeur Professionnel Aqua', description: 'Montre de plongée de précision étanche à 300 mètres avec mouvement automatique et lunette en céramique.' },
      { language: 'ar', name: 'ساعة الغوص المهنية أكوا', description: 'ساعة غوص دقيقة مقاومة للماء حتى عمق 300 متر مع حركة أوتوماتيكية وإطار سيراميك.' },
    ],
    variations: [
      { type: 'Dial Color', value: 'Blue', addPrice: 0, inventory: 6 },
      { type: 'Dial Color', value: 'Black', addPrice: 0, inventory: 6 },
      { type: 'Dial Color', value: 'Green', addPrice: 200, inventory: 4 },
    ]
  },
  {
    sku: 'HERITAGE-SKELETON-001',
    basePrice: 9999.99,
    featured: false,
    categoryId: categoriesMap['watches'],
    images: ['/images/products/IMG_8060.png', '/images/products/IMG_7067 - Copy (2).png'],
    translations: [
      { language: 'en', name: 'Heritage Skeleton Watch', description: 'An exquisite skeleton watch revealing the intricate mechanical movement, with hand-engraved bridges and plates.' },
      { language: 'fr', name: 'Montre Squelette Héritage', description: 'Une montre squelette exquise révélant le mouvement mécanique complexe, avec des ponts et des platines gravés à la main.' },
      { language: 'ar', name: 'ساعة هيكلية تراثية', description: 'ساعة هيكلية رائعة تكشف عن الحركة الميكانيكية المعقدة، مع جسور وألواح منقوشة يدويًا.' },
    ],
    variations: [
      { type: 'Material', value: 'Rose Gold', addPrice: 0, inventory: 4 },
      { type: 'Material', value: 'Platinum', addPrice: 2000, inventory: 3 },
    ]
  },
  {
    sku: 'DIAMOND-COCKTAIL-001',
    basePrice: 7299.99,
    featured: true,
    categoryId: categoriesMap['watches'],
    images: ['/images/products/IMG_7570 - Copy.png', '/images/products/IMG_7574 - Copy.png'],
    translations: [
      { language: 'en', name: 'Diamond Cocktail Watch', description: 'A glamorous diamond-encrusted cocktail watch with mother-of-pearl dial and Swiss quartz movement.' },
      { language: 'fr', name: 'Montre Cocktail Diamant', description: 'Une montre cocktail glamour incrustée de diamants avec cadran en nacre et mouvement à quartz suisse.' },
      { language: 'ar', name: 'ساعة كوكتيل ماسية', description: 'ساعة كوكتيل فاخرة مرصعة بالماس مع قرص من صدف اللؤلؤ وحركة كوارتز سويسرية.' },
    ],
    variations: [
      { type: 'Dial Color', value: 'White', addPrice: 0, inventory: 5 },
      { type: 'Dial Color', value: 'Black', addPrice: 0, inventory: 5 },
      { type: 'Dial Color', value: 'Blue', addPrice: 0, inventory: 5 },
    ]
  },
]; 