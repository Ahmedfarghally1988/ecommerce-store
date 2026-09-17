export function formatPrice(price: number | string, currency: string = 'EGP', locale: string = 'en') {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(price));
}
