import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BannersSectionProps {
  banners: any[];
  locale: string;
}

export default function BannersSection({ banners, locale }: BannersSectionProps) {
  if (!banners || banners.length === 0) return null;

  return (
    <section className="py-8 container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {banners.map((banner) => {
          const title = locale === 'ar' ? banner.titleAr : banner.titleEn;
          
          const bannerContent = (
            <div className="relative w-full aspect-[21/9] md:aspect-[4/3] lg:aspect-[16/9] rounded-md overflow-hidden shadow-sm group">
              <Image 
                src={banner.image} 
                alt={title || 'Banner'} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Optional overlay if text is present */}
              {title && (
                <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-6">
                  <h3 className="text-white text-xl md:text-2xl font-bold drop-shadow-md">{title}</h3>
                </div>
              )}
            </div>
          );

          if (banner.link) {
            const isExternal = banner.link.startsWith('http');
            const formattedLink = isExternal 
              ? banner.link 
              : `/${locale}${banner.link.startsWith('/') ? '' : '/'}${banner.link}`;
              
            return (
              <Link key={banner.id} href={formattedLink} className="block w-full">
                {bannerContent}
              </Link>
            );
          }

          return <div key={banner.id}>{bannerContent}</div>;
        })}
      </div>
    </section>
  );
}
