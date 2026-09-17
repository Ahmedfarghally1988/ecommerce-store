import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", weight: ["400", "500", "600", "700", "800"] });

export async function generateMetadata(): Promise<Metadata> {
  let favicon = '/favicon.ico';
  let storeName = 'مرحباً بكم في متجرنا';
  try {
    const [faviconSetting, storeNameSetting] = await Promise.all([
      prisma.setting.findUnique({ where: { key: 'favicon' } }),
      prisma.setting.findUnique({ where: { key: 'store_name' } }),
    ]);
    if (faviconSetting?.value) favicon = faviconSetting.value;
    if (storeNameSetting?.value) storeName = storeNameSetting.value;
  } catch (e) {}

  return {
    title: storeName,
    description: "أفضل تجربة تسوق إلكتروني.",
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
  };
}

import { ToastProvider } from '@/components/shared/ui/Toast';
import { CartProvider } from '@/lib/cart-context';
import prisma from '@/lib/prisma';
import { getCustomerCurrency } from '@/lib/currency';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const fontClass = locale === 'ar' ? cairo.variable : inter.variable;

  let currency = 'EGP';
  let exchangeRate = 1;
  let favicon = '';
  try {
    const [currencyObj, faviconSetting] = await Promise.all([
      getCustomerCurrency(),
      prisma.setting.findUnique({ where: { key: 'favicon' } })
    ]);
    if (currencyObj) {
      currency = currencyObj.code;
      exchangeRate = Number(currencyObj.exchangeRate);
    }
    if (faviconSetting?.value) favicon = faviconSetting.value;
  } catch (e) {}

  return (
    <html lang={locale} dir={dir} className={`${cairo.variable} ${inter.variable}`}>
      <head>
        {favicon ? (
          <>
            <link rel="icon" href={favicon} />
            <link rel="shortcut icon" href={favicon} />
            <link rel="apple-touch-icon" href={favicon} />
          </>
        ) : (
          <link rel="icon" href="/default-favicon.ico" sizes="any" />
        )}
      </head>
      <body className={`${locale === 'ar' ? 'font-cairo' : 'font-inter'} overflow-x-hidden`}>
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <CartProvider currency={currency} exchangeRate={exchangeRate} locale={locale}>
              {children}
            </CartProvider>
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
