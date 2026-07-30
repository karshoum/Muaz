/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // صور المنتجات تأتي من تخزين Supabase (نطاق *.supabase.co) أو من blob محلي.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // مكتبة تفريغ الخلفية تستخدم وحدات Node غير متوفرة في المتصفح.
    config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false };

    // تعمل المكتبة في المتصفح فقط (تُستورد ديناميكياً عند ضغط زر التفريغ).
    // نستبعدها من حزمة الخادم لأن نسخة CJS منها تحتوي صيغة ESM لا يستطيع
    // webpack تحليلها أثناء البناء.
    config.module.rules.push({
      test: /\.m?js$/,
      include: /node_modules/,
      type: 'javascript/auto',
      resolve: { fullySpecified: false },
    });

    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@imgly/background-removal': false,
      };
    }
    return config;
  },
};

export default nextConfig;
