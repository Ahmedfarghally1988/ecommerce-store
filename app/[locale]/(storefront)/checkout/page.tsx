"use client";

import React, { use, useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/format';
import { convertPrice } from '@/lib/currency-utils';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { createCheckoutOrder, getShippingSettings, validateCoupon } from '@/app/actions/storefront/orders';
import { getCustomerAddresses } from '@/app/actions/storefront/account';
import Breadcrumb from '@/components/storefront/Breadcrumb';

export default function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations('Storefront');
  const { items, subtotal, clearCart, isMounted, currency, exchangeRate, locale: cartLocale } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNum, setOrderNum] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    city: '',
    address: '',
    notes: '',
  });

  const [shippingSettings, setShippingSettings] = useState<{baseCost: number, freeThreshold: number | null, regions: any[]}>({ baseCost: 0, freeThreshold: null, regions: [] });
  const [shippingCost, setShippingCost] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(true);

  React.useEffect(() => {
    getShippingSettings().then(setShippingSettings);
    getCustomerAddresses().then(({ addresses, email }) => {
      setSavedAddresses(addresses);
      if (email) {
        setFormData(prev => ({ ...prev, customerEmail: email }));
      }
      if (addresses.length > 0) {
        setShowNewAddressForm(false);
        const firstAddr = addresses[0];
        setSelectedAddressId(firstAddr.id);
        setFormData(prev => ({
          ...prev,
          customerName: `${firstAddr.firstName} ${firstAddr.lastName}`.trim(),
          customerPhone: firstAddr.phone,
          city: firstAddr.city,
          address: `${firstAddr.area ? firstAddr.area + ', ' : ''}${firstAddr.address}${firstAddr.apartment ? ', ' + firstAddr.apartment : ''}`,
        }));
      }
    });
  }, []);

  const handleSelectAddress = (addr: any) => {
    setSelectedAddressId(addr.id);
    setShowNewAddressForm(false);
    setFormData(prev => ({
      ...prev,
      customerName: `${addr.firstName} ${addr.lastName}`.trim(),
      customerPhone: addr.phone,
      city: addr.city,
      address: `${addr.area ? addr.area + ', ' : ''}${addr.address}${addr.apartment ? ', ' + addr.apartment : ''}`,
    }));
  };

  React.useEffect(() => {
    let cost = shippingSettings.baseCost;
    if (formData.city) {
      const region = shippingSettings.regions.find(r => r.name === formData.city);
      if (region) cost = Number(region.cost);
    }
    const subtotalAfterDiscount = subtotal - couponDiscount;
    if (shippingSettings.freeThreshold !== null && subtotalAfterDiscount >= shippingSettings.freeThreshold) {
      cost = 0;
    }
    setShippingCost(cost);
  }, [formData.city, shippingSettings, subtotal, couponDiscount]);

  const applyCoupon = async () => {
    if (!couponCode) return;
    setValidatingCoupon(true);
    setCouponError('');
    try {
      const res = await validateCoupon(couponCode, subtotal);
      if (res.success && res.discountAmount) {
        setCouponDiscount(res.discountAmount);
      } else {
        setCouponError(res.error || 'Invalid coupon');
        setCouponDiscount(0);
      }
    } catch (e) {
      setCouponError('Error validating coupon');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Helper to get cookie
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };

      const selectedCountry = getCookie('USER_COUNTRY');
      if (selectedCountry && selectedCountry !== 'OTHER') {
        try {
          const geoRes = await fetch('https://get.geojs.io/v1/ip/country.json');
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (geoData.country && geoData.country !== selectedCountry) {
              setError(locale === 'ar' ? 'عذراً، لا يمكن تأكيد الطلب لأن موقعك الحالي لا يطابق البلد المختار في إعدادات المتجر.' : 'Sorry, the order cannot be confirmed because your current location does not match the selected country.');
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.error('Failed to validate IP location:', err);
          // Ignore error and proceed if API fails
        }
      }

      const orderData = {
        ...formData,
        couponCode: couponDiscount > 0 ? couponCode : undefined,
        currency,
        exchangeRate,
        items: items.map(item => ({
          productId: item.productId,
          variantId: item.variantId || undefined,
          productNameEn: item.nameEn || item.name || '',
          productNameAr: item.nameAr || item.name || '',
          sku: '', 
          price: Number(item.price),
          quantity: item.quantity,
        })),
      };

      const res = await createCheckoutOrder(orderData);

      if (res.success) {
        setSuccess(true);
        setOrderNum(res.orderNumber || '');
        clearCart();
      } else {
        setError(res.error || 'Failed to place order');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  if (success) {
    const isAr = locale === 'ar';
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-2xl" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="bg-green-50 border border-green-200 rounded-3xl p-12">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isAr ? 'تم تأكيد طلبك بنجاح!' : 'Order Placed Successfully!'}
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            {isAr 
              ? `رقم الطلب الخاص بك هو: ${orderNum}` 
              : `Your order number is: ${orderNum}`}
          </p>
          <p className="text-lg font-medium text-gray-800 mb-8">
            {isAr 
              ? 'تم استلام طلبك، وستتواصل الإدارة معك قريباً لتأكيد بيانات الطلب. الدفع سيكون نقداً عند الاستلام.' 
              : 'Your order has been received. The admin will contact you soon to confirm details. Payment will be Cash on Delivery.'}
          </p>
          <Link 
            href={`/${locale}/products`}
            className="inline-block bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            {isAr ? 'مواصلة التسوق' : 'Continue Shopping'}
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-lg">
        <h1 className="text-3xl font-bold mb-4">{t('checkout')}</h1>
        <div className="bg-gray-50 rounded-2xl py-12 px-4 mb-8">
          <p className="text-gray-500 text-lg mb-6">{t('emptyCart')}</p>
          <Link 
            href={`/${locale}/products`}
            className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  const isAr = locale === 'ar';

  return (
    <div className="container mx-auto px-4 py-8" dir={isAr ? 'rtl' : 'ltr'}>
      <Breadcrumb items={[{ label: t('cart'), href: `/${locale}/cart` }, { label: t('checkout') }]} locale={locale} />
      <h1 className="text-3xl font-bold mb-8 mt-6">{t('checkout')}</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-bold mb-6">{isAr ? 'بيانات التواصل' : 'Contact Info'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{isAr ? 'الاسم الكامل' : 'Full Name'} *</label>
                  <input required type="text" name="customerName" value={formData.customerName} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{isAr ? 'البريد الإلكتروني' : 'Email Address'} *</label>
                  <input required type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{isAr ? 'رقم الهاتف' : 'Phone Number'} *</label>
                  <input required type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
                <h2 className="text-xl font-bold">{isAr ? 'عنوان الشحن' : 'Shipping Address'}</h2>
                {savedAddresses.length > 0 && (
                  <button 
                    type="button" 
                    onClick={() => {
                      const willShowNew = !showNewAddressForm;
                      setShowNewAddressForm(willShowNew);
                      if (!willShowNew && savedAddresses.length > 0) {
                        const addrToSelect = savedAddresses.find(a => a.id === selectedAddressId) || savedAddresses[0];
                        handleSelectAddress(addrToSelect);
                      } else {
                        setSelectedAddressId(null);
                        setFormData(prev => ({ ...prev, city: '', address: '' }));
                      }
                    }}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    {showNewAddressForm ? (isAr ? 'العودة للعناوين المحفوظة' : 'Use saved address') : (isAr ? 'إضافة عنوان جديد' : 'Add new address')}
                  </button>
                )}
              </div>

              {!showNewAddressForm && savedAddresses.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedAddresses.map(addr => (
                    <div 
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-black bg-gray-50 shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}
                    >
                      <h3 className="font-bold text-gray-900">{addr.firstName} {addr.lastName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                      <p className="text-sm text-gray-600">{addr.city}{addr.area ? `, ${addr.area}` : ''}</p>
                      <p className="text-sm text-gray-600 mt-2" dir="ltr">{addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 ${!showNewAddressForm ? 'hidden' : 'mt-2'}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{isAr ? 'المدينة' : 'City'} *</label>
                  {shippingSettings.regions.length > 0 ? (
                    <select required={showNewAddressForm} name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none bg-white">
                      <option value="">{isAr ? 'اختر المدينة' : 'Select City'}</option>
                      {shippingSettings.regions.map(r => (
                        <option key={r.name} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input required={showNewAddressForm} type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" />
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{isAr ? 'العنوان بالتفصيل' : 'Detailed Address'} *</label>
                  <input required={showNewAddressForm} type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" placeholder={isAr ? 'الشارع، البناية، رقم الشقة...' : 'Street, Building, Apartment...'} />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4">{isAr ? 'ملاحظات إضافية (اختياري)' : 'Order Notes (Optional)'}</h2>
              <textarea name="notes" rows={3} value={formData.notes} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none"></textarea>
            </div>
            
            {/* Payment Information */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4">{isAr ? 'طريقة الدفع' : 'Payment Method'}</h2>
              <div className="p-4 border border-b border-gray-200lue-200 bg-blue-50 text-blue-800 rounded-xl flex items-start gap-3">
                <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold">{isAr ? 'الدفع عند الاستلام' : 'Cash on Delivery (COD)'}</h3>
                  <p className="text-sm text-blue-600/80 mt-1">
                    {isAr 
                      ? 'الدفع نقداً أو عبر البطاقة عند استلامك للطلب.' 
                      : 'Pay with cash or card upon delivery.'}
                  </p>
                </div>
              </div>
            </div>
            
          </form>
        </div>
        
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-2xl p-6 shadow-md sticky top-24">
            <h2 className="text-xl font-bold mb-6">{isAr ? 'ملخص الطلب' : 'Order Summary'}</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.map(item => (
                <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm">
                  <div className="flex gap-3 flex-1">
                    <span className="font-medium text-gray-500">{item.quantity}x</span>
                    <span className="text-gray-800 line-clamp-2 pr-2">{item.name} {item.variantName ? `(${item.variantName})` : ''}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{formatPrice(convertPrice(Number(item.price) * item.quantity, exchangeRate), currency, cartLocale)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between mb-2 text-gray-600">
                <span>{t('subtotal')}</span>
                <span className="font-medium text-black">{formatPrice(convertPrice(subtotal, exchangeRate), currency, cartLocale)}</span>
              </div>

              <div className="mb-4">
                <div className="flex gap-2 mb-1">
                  <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder={isAr ? 'كود الخصم' : 'Coupon Code'} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-500" />
                  <button type="button" onClick={applyCoupon} disabled={validatingCoupon} className="px-4 py-2 bg-gray-100 border border-gray-200 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                    {isAr ? 'تطبيق' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                {couponDiscount > 0 && <p className="text-xs text-green-600">{isAr ? 'تم تطبيق الخصم بنجاح' : 'Discount applied'}</p>}
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>{isAr ? 'الخصم' : 'Discount'}</span>
                  <span className="font-medium">-{formatPrice(convertPrice(couponDiscount, exchangeRate), currency, cartLocale)}</span>
                </div>
              )}

              <div className="flex justify-between mb-4 text-gray-600">
                <span>{isAr ? 'الشحن' : 'Shipping'}</span>
                <span className="font-medium">{shippingCost === 0 ? <span className="text-green-600">{isAr ? 'مجاني' : 'Free'}</span> : formatPrice(convertPrice(shippingCost, exchangeRate), currency, cartLocale)}</span>
              </div>
              <div className="border-t pt-4 border-gray-100 flex justify-between">
                <span className="font-bold text-lg">{t('total')}</span>
                <span className="font-bold text-lg">{formatPrice(convertPrice(subtotal - couponDiscount + shippingCost, exchangeRate), currency, cartLocale)}</span>
              </div>
            </div>
            
            <button 
              type="submit" 
              form="checkout-form"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-4 rounded-xl mt-8 hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading && <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
              {isAr ? 'تأكيد الطلب' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
