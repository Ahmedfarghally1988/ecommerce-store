"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';

export interface HeroSlideData {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  image: string;
  mobileImage?: string | null;
  buttonTextEn?: string | null;
  buttonTextAr?: string | null;
  buttonUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface HeroSliderProps {
  slides: HeroSlideData[];
  locale: string;
}

export default function HeroSlider({ slides, locale }: HeroSliderProps) {
  const isRtl = locale === 'ar';
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const total = slides?.length || 0;

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(((index % total) + total) % total);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning, total]);

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Autoplay
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(goNext, 5500);
    return () => clearInterval(timer);
  }, [total, goNext]);

  // Fallback Hero if no slides exist
  if (!slides || slides.length === 0) {
    return (
      <section className="relative w-full h-[350px] sm:h-[450px] bg-gray-950 text-white flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/20 z-0" />
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
            {isRtl ? 'أهلاً بكم في متجرنا الإلكتروني' : 'Welcome to Our Premium Store'}
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl mx-auto">
            {isRtl
              ? 'تصفح أحدث التشكيلات والمنتجات التقنية العصرية بأفضل الأسعار.'
              : 'Discover curated collections and exceptional products crafted for your lifestyle.'}
          </p>
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-2 bg-white text-gray-950 font-semibold px-8 py-3.5 rounded-md hover:bg-gray-100 transition-transform active:scale-95 shadow-xl hover:shadow-2xl"
          >
            <span>{isRtl ? 'تسوق الآن' : 'Explore Catalog'}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-md group select-none grid grid-cols-1 grid-rows-1 mt-6 md:mt-0">
      {/* Slides */}
      {slides.map((slide, index) => {
        const title = isRtl ? slide.titleAr : slide.titleEn;
        const description = isRtl ? slide.descriptionAr : slide.descriptionEn;
        const buttonText = isRtl ? slide.buttonTextAr : slide.buttonTextEn;
        const targetUrl = slide.buttonUrl
          ? (slide.buttonUrl.startsWith('http') ? slide.buttonUrl : `/${locale}${slide.buttonUrl.startsWith('/') ? '' : '/'}${slide.buttonUrl}`)
          : `/${locale}/products`;
        const isActive = index === current;

        return (
          <div
            key={slide.id}
            className={`col-start-1 row-start-1 w-full relative transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image: Full Width & Natural Proportions */}
            <div className="w-full h-[220px] sm:h-[300px] md:h-[400px]">
              {slide.mobileImage ? (
                <>
                  <img
                    src={slide.image}
                    alt={title || 'Hero slide'}
                    className="hidden sm:block w-full h-full object-cover"
                  />
                  <img
                    src={slide.mobileImage}
                    alt={title || 'Hero slide'}
                    className="sm:hidden w-full h-full object-cover"
                  />
                </>
              ) : (
                <img
                  src={slide.image}
                  alt={title || 'Hero slide'}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Clickable link over the entire slide if buttonUrl exists but no buttonText */}
            {slide.buttonUrl && !buttonText && (
              <Link href={targetUrl} className="absolute inset-0 z-[2] cursor-pointer" aria-label={title || 'Slide'} />
            )}

            {/* Text Content & CTA (Only rendered if title, description, or buttonText exist) */}
            {(title || description || buttonText) && (
              <div className="absolute inset-0 z-[3] container mx-auto px-6 sm:px-12 md:px-16 flex items-center justify-center pointer-events-none">
                <div className="max-w-3xl text-white text-center flex flex-col items-center pointer-events-auto">
                  {title && (
                    <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-snug drop-shadow-md">
                      {title}
                    </h2>
                  )}

                  {description && (
                    <p className="mt-2 sm:mt-4 text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 line-clamp-2 drop-shadow max-w-xl mx-auto">
                      {description}
                    </p>
                  )}

                  {buttonText && (
                    <div className="mt-3 sm:mt-6 flex justify-center">
                      <Link
                        href={targetUrl}
                        className="inline-flex items-center gap-2 bg-white text-gray-950 font-bold px-5 sm:px-8 py-2 sm:py-3 rounded-md text-xs sm:text-sm transition-all duration-200 hover:bg-gray-100 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
                      >
                        <span>{buttonText}</span>
                        {isRtl ? (
                          <ArrowLeft className="w-4 h-4" />
                        ) : (
                          <ArrowRight className="w-4 h-4" />
                        )}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Navigation Arrows */}
      {total > 1 && (
        <>
          <button
            onClick={isRtl ? goNext : goPrev}
            aria-label="Previous slide"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/30 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-90"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={isRtl ? goPrev : goNext}
            aria-label="Next slide"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/30 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-90"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
}
