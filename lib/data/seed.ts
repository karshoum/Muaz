import type { Product, ProductInput } from '@/lib/data/types';

/**
 * كتالوج المعرض المبدئي — قطع حقيقية من معرض الراقي الهندسي بصورها.
 *
 * كل القطع تبدأ **غير منشورة** وبسعر صفر عن قصد: تظهر للمدير في لوحة
 * التحكم جاهزة بصورها وأسمائها، ولا يراها العملاء حتى يضع المدير السعر
 * ويفعّل "منشور للعملاء". هكذا لا يظهر سعر خاطئ لأي زائر.
 */
const CATALOG: Array<Omit<ProductInput, 'images'> & { image: string }> = [
  {
    code: 'ALR-LV-1201',
    name: 'كنبة ملكية خضراء بنقش ذهبي',
    description:
      'كنبة ثلاثية بتصميم ملكي، تنجيد مخمل أخضر مع أزرار وهيكل خشبي محفور بالكامل ومطلي بالذهبي. قطعة مميزة تليق بصالون الضيوف.',
    price: 0,
    oldPrice: null,
    category: 'living',
    rating: 5,
    featured: true,
    published: false,
    inStock: true,
    isDemo: false,
    image: '/images/products/sofa-royal-green.jpg',
  },
  {
    code: 'ALR-LV-1202',
    name: 'كنبة ملكية بنفسجية بنقش ذهبي',
    description:
      'طقم جلوس ملكي بتنجيد مخمل بنفسجي وهيكل محفور مطلي بالذهبي، يشمل الكنبة الثلاثية والكراسي المفردة. فخامة واضحة بلمسة عربية.',
    price: 0,
    oldPrice: null,
    category: 'living',
    rating: 5,
    featured: true,
    published: false,
    inStock: true,
    isDemo: false,
    image: '/images/products/sofa-royal-purple.jpg',
  },
  {
    code: 'ALR-LV-1203',
    name: 'كنبة ثلاثية وردية مبطّنة',
    description:
      'كنبة ثلاثية بتنجيد قماشي وردي وظهر مبطّن بأزرار ذهبية، بأذرع دائرية مريحة وأرجل خشبية. مناسبة لغرف المعيشة المتوسطة.',
    price: 0,
    oldPrice: null,
    category: 'living',
    rating: 5,
    featured: true,
    published: false,
    inStock: true,
    isDemo: false,
    image: '/images/products/sofa-pink-3seater.jpg',
  },
  {
    code: 'ALR-LV-1204',
    name: 'كرسي فردي وردي بأزرار ذهبية',
    description:
      'كرسي مفرد مريح بتنجيد وردي وظهر مبطّن بأزرار ذهبية، بأذرع عريضة وأرجل خشبية بحلية ذهبية. يكمّل الطقم الوردي أو يُستخدم منفرداً.',
    price: 0,
    oldPrice: null,
    category: 'living',
    rating: 5,
    featured: false,
    published: false,
    inStock: true,
    isDemo: false,
    image: '/images/products/armchair-pink.jpg',
  },
  {
    code: 'ALR-LV-1205',
    name: 'كنبة ثلاثية بخطوط طولية',
    description:
      'كنبة ثلاثية بتنجيد مخمل وردي وخطوط طولية بارزة في الظهر، بتصميم عصري بسيط وأرجل ذهبية. متوفرة كطقم كامل عند الطلب.',
    price: 0,
    oldPrice: null,
    category: 'living',
    rating: 4,
    featured: false,
    published: false,
    inStock: true,
    isDemo: false,
    image: '/images/products/sofa-channel-3seater.jpg',
  },
  {
    code: 'ALR-LV-1206',
    name: 'كنبة ثلاثية عنابي وبيج',
    description:
      'كنبة ثلاثية بتنجيد مزدوج اللون: عنابي بنقش هندسي ذهبي مع بيج، وأرجل ذهبية. تصميم يجمع بين الجرأة والأناقة.',
    price: 0,
    oldPrice: null,
    category: 'living',
    rating: 4,
    featured: false,
    published: false,
    inStock: true,
    isDemo: false,
    image: '/images/products/sofa-maroon-3seater.jpg',
  },
  {
    code: 'ALR-LV-1207',
    name: 'كنبة ثنائية مذهبة فاخرة',
    description:
      'كنبة ثنائية بتنجيد مذهب لامع مع تفاصيل سوداء منقوشة، بتصميم منحني مميز. قطعة لافتة لمن يبحث عن الفخامة.',
    price: 0,
    oldPrice: null,
    category: 'living',
    rating: 4,
    featured: false,
    published: false,
    inStock: true,
    isDemo: false,
    image: '/images/products/sofa-gold-2seater.jpg',
  },
  {
    code: 'ALR-LV-1208',
    name: 'كنبة ثلاثية بنفسجية وكريمية',
    description:
      'كنبة ثلاثية بخطوط طولية بتنجيد بنفسجي وكريمي، بتصميم عصري مريح وظهر مرتفع. متوفرة مع كراسي مفردة مطابقة.',
    price: 0,
    oldPrice: null,
    category: 'living',
    rating: 4,
    featured: false,
    published: false,
    inStock: true,
    isDemo: false,
    image: '/images/products/sofa-purple-3seater.jpg',
  },
  {
    code: 'ALR-LV-1209',
    name: 'طقم جلوس بنفسجي وكريمي',
    description:
      'طقم متكامل يشمل الكنبة الثلاثية والكراسي المفردة بتنجيد بنفسجي وكريمي وظهر مرتفع مريح. مناسب لصالون العائلة.',
    price: 0,
    oldPrice: null,
    category: 'living',
    rating: 4,
    featured: false,
    published: false,
    inStock: true,
    isDemo: false,
    image: '/images/products/set-purple-cream.jpg',
  },
  {
    code: 'ALR-LV-1210',
    name: 'ركنة كريمية بوسائد',
    description:
      'ركنة واسعة بتنجيد كريمي مبطّن بأزرار، تتسع لعدد كبير من الجلوس، وتأتي مع وسائد زينة وطاولة وسط وبوفات مطابقة.',
    price: 0,
    oldPrice: null,
    category: 'living',
    rating: 4,
    featured: false,
    published: false,
    inStock: true,
    isDemo: false,
    image: '/images/products/sectional-cream.jpg',
  },
  {
    code: 'ALR-LV-1211',
    name: 'كرسي استرخاء عنابي (تشيز لونج)',
    description:
      'كرسي استرخاء بتصميم منحني مميز، تنجيد مخمل عنابي مع جانب كريمي وأزرار ذهبية. إضافة أنيقة لغرفة النوم أو الصالون.',
    price: 0,
    oldPrice: null,
    category: 'living',
    rating: 5,
    featured: false,
    published: false,
    inStock: true,
    isDemo: false,
    image: '/images/products/chaise-maroon.jpg',
  },
  {
    code: 'ALR-DC-1212',
    name: 'بوفيه أبيض بزخارف ذهبية',
    description:
      'بوفيه بابين ودرج علوي، تشطيب أبيض مع زخارف محفورة ومطلية بالذهبي وأرجل منحنية. مناسب للصالة أو مدخل المنزل.',
    price: 0,
    oldPrice: null,
    category: 'decor',
    rating: 5,
    featured: true,
    published: false,
    inStock: true,
    isDemo: false,
    image: '/images/products/cabinet-white-gold.jpg',
  },
  {
    code: 'ALR-DC-1213',
    name: 'بوف تخزين مربّع مبطّن',
    description:
      'بوف مربّع بغطاء مبطّن بأزرار ومساحة تخزين داخلية، بتنجيد مخمل وأرجل ذهبية. يجمع بين الجلوس والتخزين.',
    price: 0,
    oldPrice: null,
    category: 'decor',
    rating: 4,
    featured: false,
    published: false,
    inStock: true,
    isDemo: false,
    image: '/images/products/pouf-storage.jpg',
  },
  {
    code: 'ALR-DC-1214',
    name: 'طقم صواني خشبية متداخلة',
    description:
      'طقم صواني خشبية متداخلة بأحجام متدرجة، متوفر بألوان متعددة: أسود، ذهبي، فضي، بني، أحمر ورمادي. عملي وأنيق للضيافة.',
    price: 0,
    oldPrice: null,
    category: 'decor',
    rating: 4,
    featured: false,
    published: false,
    inStock: true,
    isDemo: false,
    image: '/images/products/trays-wooden-set.jpg',
  },
];

/** توليد قطع الكتالوج بمعرّفات وتواريخ */
export function buildSeedProducts(): Product[] {
  const now = Date.now();
  return CATALOG.map((item, index) => {
    const { image, ...rest } = item;
    const createdAt = new Date(now - index * 60_000).toISOString();
    return {
      ...rest,
      id: `alragy-${index + 1}`,
      images: [
        {
          id: `alragy-img-${index + 1}`,
          url: image,
          backgroundRemoved: false,
        },
      ],
      createdAt,
      updatedAt: createdAt,
    } satisfies Product;
  });
}
