const { PrismaClient } = require("@prisma/client");


async function seed() {
  const count = await prisma.heroSlide.count();
  if (count === 0) {
    await prisma.heroSlide.createMany({
      data: [
        {
          titleEn: "Next-Gen Smartphone Experience",
          titleAr: "تجربة الجيل القادم من الهواتف الذكية",
          descriptionEn:
            "Discover the all-new iPhone 15 Pro & Galaxy S24 Ultra with cutting-edge titanium craft and AI capabilities.",
          descriptionAr:
            "اكتشف هاتف iPhone 15 Pro و Galaxy S24 Ultra الجديد كلياً مع تصميم التيتانيوم وميزات الذكاء الاصطناعي الفائقة.",
          image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1920&auto=format&fit=crop",
          mobileImage:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
          buttonTextEn: "Explore Flagships",
          buttonTextAr: "استكشف الهواتف",
          buttonUrl: "/products",
          sortOrder: 0,
          isActive: true,
        },
        {
          titleEn: "Elevate Your Lifestyle",
          titleAr: "ارتقِ بأسلوب حياتك العصري",
          descriptionEn:
            "Premium audio, wearable tech, and accessories designed for uncompromising performance and modern design.",
          descriptionAr:
            "أجهزة صوتية ذكية وإكسسوارات متطورة مصممة لأداء استثنائي وتصميم فائق الأناقة.",
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1920&auto=format&fit=crop",
          mobileImage:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
          buttonTextEn: "Shop Audio & Wearables",
          buttonTextAr: "تسوق الصوتيات والإكسسوارات",
          buttonUrl: "/products",
          sortOrder: 1,
          isActive: true,
        },
        {
          titleEn: "Exclusive Season Discounts",
          titleAr: "تخفيضات وعروض حصرية للموسم",
          descriptionEn:
            "Save up to 30% on curated top-rated tech. Limited-time offers with free express shipping.",
          descriptionAr:
            "وفر حتى 30% على أحدث وأفضل المنتجات الإلكترونية. عروض لفترة محدودة مع شحن سريع ومجاني.",
          image:
            "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=1920&auto=format&fit=crop",
          mobileImage:
            "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=800&auto=format&fit=crop",
          buttonTextEn: "Discover Offers",
          buttonTextAr: "اكتشف العروض",
          buttonUrl: "/products",
          sortOrder: 2,
          isActive: true,
        },
      ],
    });
    console.log("Seeded 3 initial hero slides successfully.");
  } else {
    console.log("Hero slides already exist:", count);
  }
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
