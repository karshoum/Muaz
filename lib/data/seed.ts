import type { Product, ProductInput } from '@/lib/data/types';

/** بيانات تجريبية لعرض الموقع فور تشغيله — تُحذف بزر واحد من لوحة التحكم */
const DEMO: Array<Omit<ProductInput, 'images'> & { image: string }> = [
  {
    code: 'ALR-BR-1042',
    name: 'سرير ملكي فاخر مبطّن',
    description:
      'سرير مزدوج بتصميم ملكي عصري، ظهر مبطّن بقماش مخملي فاخر مع خياطة هندسية، وهيكل خشب زان مقاوم للرطوبة. المقاس 200×180 سم.',
    price: 450000,
    oldPrice: 520000,
    category: 'bedrooms',
    rating: 5,
    featured: true,
    published: true,
    inStock: true,
    isDemo: true,
    image: '/images/categories/bedrooms.svg',
  },
  {
    code: 'ALR-BR-1108',
    name: 'غرفة نوم كاملة موديل الراقي',
    description:
      'طقم غرفة نوم متكامل يشمل السرير وكومودينتين وتسريحة بمرآة ودولاب ستة أبواب، بتشطيب خشبي دافئ ولمسات ذهبية.',
    price: 1250000,
    oldPrice: null,
    category: 'bedrooms',
    rating: 5,
    featured: true,
    published: true,
    inStock: true,
    isDemo: true,
    image: '/images/categories/bedrooms.svg',
  },
  {
    code: 'ALR-KD-2031',
    name: 'غرفة أطفال بسريرين',
    description:
      'غرفة أطفال آمنة بحواف دائرية وألوان هادئة، تشمل سريرين ووحدة أدراج ومكتبة كتب مدمجة. خامات صديقة للبيئة.',
    price: 680000,
    oldPrice: 750000,
    category: 'kids',
    rating: 4,
    featured: true,
    published: true,
    inStock: true,
    isDemo: true,
    image: '/images/categories/kids.svg',
  },
  {
    code: 'ALR-KD-2077',
    name: 'سرير أطفال دورين مع سلّم',
    description:
      'سرير دورين موفّر للمساحة بسلّم آمن وحواجز جانبية، مثالي لغرف الأطفال الصغيرة. يتحمّل حتى 90 كجم لكل دور.',
    price: 395000,
    oldPrice: null,
    category: 'kids',
    rating: 4,
    featured: false,
    published: true,
    inStock: true,
    isDemo: true,
    image: '/images/categories/kids.svg',
  },
  {
    code: 'ALR-WD-3015',
    name: 'دولاب ملابس حديث سحّاب',
    description:
      'دولاب بأربعة أبواب سحّاب انسيابية ومرآة كاملة، مع تقسيمات داخلية ورفوف قابلة للتعديل وإضاءة LED داخلية.',
    price: 520000,
    oldPrice: 590000,
    category: 'wardrobes',
    rating: 5,
    featured: true,
    published: true,
    inStock: true,
    isDemo: true,
    image: '/images/categories/wardrobes.svg',
  },
  {
    code: 'ALR-WD-3062',
    name: 'دولاب هندسي بستة أبواب',
    description:
      'دولاب واسع بتصميم هندسي مميز وواجهات بخطوط ذهبية رفيعة، مساحة تخزين كبيرة تكفي احتياج غرفة نوم كاملة.',
    price: 735000,
    oldPrice: null,
    category: 'wardrobes',
    rating: 5,
    featured: false,
    published: true,
    inStock: true,
    isDemo: true,
    image: '/images/categories/wardrobes.svg',
  },
  {
    code: 'ALR-LV-4023',
    name: 'طقم غرفة معيشة مودرن',
    description:
      'كنبة ثلاثية مع كرسيين مفردين وطاولة وسط رخامية، تنجيد قماشي مقاوم للبقع بلون بيج دافئ يناسب كل الديكورات.',
    price: 890000,
    oldPrice: 980000,
    category: 'living',
    rating: 5,
    featured: true,
    published: true,
    inStock: true,
    isDemo: true,
    image: '/images/categories/living.svg',
  },
  {
    code: 'ALR-LV-4091',
    name: 'ركنة زاوية فاخرة L',
    description:
      'ركنة على شكل حرف L تتسع لسبعة أشخاص، إسفنج عالي الكثافة يحافظ على شكله، مع وسائد ظهر إضافية.',
    price: 1150000,
    oldPrice: null,
    category: 'living',
    rating: 4,
    featured: false,
    published: true,
    inStock: true,
    isDemo: true,
    image: '/images/categories/living.svg',
  },
  {
    code: 'ALR-DN-5044',
    name: 'طاولة طعام رخامية لثمانية أشخاص',
    description:
      'طاولة طعام بسطح رخامي طبيعي وقاعدة معدنية ذهبية، مع ثمانية كراسي مبطّنة مريحة. تحفة تليق بمناسباتك.',
    price: 960000,
    oldPrice: 1090000,
    category: 'dining',
    rating: 5,
    featured: true,
    published: true,
    inStock: true,
    isDemo: true,
    image: '/images/categories/dining.svg',
  },
  {
    code: 'ALR-DN-5087',
    name: 'طقم سفرة خشبي لستة أشخاص',
    description:
      'طاولة طعام خشبية بتشطيب طبيعي مع ستة كراسي، تصميم بسيط وأنيق يناسب المساحات المتوسطة.',
    price: 615000,
    oldPrice: null,
    category: 'dining',
    rating: 4,
    featured: false,
    published: true,
    inStock: true,
    isDemo: true,
    image: '/images/categories/dining.svg',
  },
  {
    code: 'ALR-DC-6019',
    name: 'وحدة تلفزيون بإضاءة خلفية',
    description:
      'وحدة تلفزيون عصرية بأدراج مخفية وإضاءة LED خلفية قابلة لتغيير اللون، تتسع لشاشة حتى 75 بوصة.',
    price: 340000,
    oldPrice: 385000,
    category: 'decor',
    rating: 4,
    featured: true,
    published: true,
    inStock: true,
    isDemo: true,
    image: '/images/categories/decor.svg',
  },
  {
    code: 'ALR-DC-6055',
    name: 'مرآة ديكور دائرية بإطار ذهبي',
    description:
      'مرآة حائط دائرية قطر 80 سم بإطار معدني ذهبي، لمسة أنيقة تضيف اتساعاً وإشراقاً لأي غرفة.',
    price: 125000,
    oldPrice: null,
    category: 'decor',
    rating: 5,
    featured: false,
    published: true,
    inStock: true,
    isDemo: true,
    image: '/images/categories/decor.svg',
  },
];

/** توليد المنتجات التجريبية بمعرّفات وتواريخ */
export function buildSeedProducts(): Product[] {
  const now = Date.now();
  return DEMO.map((item, index) => {
    const { image, ...rest } = item;
    const createdAt = new Date(now - index * 3_600_000).toISOString();
    return {
      ...rest,
      id: `demo-${index + 1}`,
      images: [
        {
          id: `demo-img-${index + 1}`,
          url: image,
          backgroundRemoved: false,
        },
      ],
      createdAt,
      updatedAt: createdAt,
    } satisfies Product;
  });
}
