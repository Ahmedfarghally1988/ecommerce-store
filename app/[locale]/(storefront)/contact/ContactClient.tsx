"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { submitContactMessage } from '@/app/actions/storefront/contact';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ContactFormInput {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export function ContactClient({ settings, locale }: { settings: Record<string, string>, locale: string }) {
  const t = useTranslations('Contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormInput>();

  const onSubmit = async (data: ContactFormInput) => {
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccess(false);
    
    try {
      const res = await submitContactMessage(data);
      if (res.success) {
        setSuccess(true);
        reset();
      } else {
        setErrorMsg(res.error || t('errorOccurred'));
      }
    } catch (error) {
      setErrorMsg(t('networkError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAr = locale === 'ar';

  // Try to extract the src from an iframe string if the user pasted the whole iframe
  let mapUrl = settings.store_location_map || '';
  if (mapUrl.includes('<iframe') && mapUrl.includes('src="')) {
    const match = mapUrl.match(/src="([^"]+)"/);
    if (match) {
      mapUrl = match[1];
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
      {/* Contact Info & Map */}
      <div className="space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('contactInfo')}</h2>
          
          <div className="space-y-4">
            {settings.contact_email && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">{t('email')}</p>
                  <a href={`mailto:${settings.contact_email}`} className="text-gray-900 font-semibold hover:text-blue-600 transition-colors" dir="ltr">
                    {settings.contact_email}
                  </a>
                </div>
              </div>
            )}

            {settings.contact_phone && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">{t('phone')}</p>
                  <a href={`tel:${settings.contact_phone}`} className="text-gray-900 font-semibold hover:text-green-600 transition-colors" dir="ltr">
                    {settings.contact_phone}
                  </a>
                </div>
              </div>
            )}

            {settings.whatsapp && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">{t('whatsapp')}</p>
                  <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-gray-900 font-semibold hover:text-green-600 transition-colors" dir="ltr">
                    +{settings.whatsapp}
                  </a>
                </div>
              </div>
            )}

            {settings.address && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 text-gray-700 rounded-xl shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">{t('address')}</p>
                  <p className="text-gray-900 font-semibold leading-relaxed">
                    {settings.address}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {mapUrl && (
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[300px]">
            <iframe 
              src={mapUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 0, borderRadius: '0.75rem' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        )}
      </div>

      {/* Contact Form */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('sendMessage')}</h2>
        <p className="text-gray-500 mb-6">{t('sendDescription')}</p>

        {success ? (
          <div className="bg-green-50 text-green-700 p-6 rounded-xl text-center border border-green-100">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-1">{t('successTitle')}</h3>
            <p className="text-sm">{t('successDesc')}</p>
            <button 
              onClick={() => setSuccess(false)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              {t('sendAnother')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                {errorMsg}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('nameLabel')}</label>
                <input 
                  {...register('name', { required: t('nameRequired') })} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                  placeholder={t('namePlaceholder')}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('emailLabel')}</label>
                <input 
                  type="email"
                  {...register('email', { required: t('emailRequired') })} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                  placeholder="email@example.com"
                  dir="ltr"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('phoneLabel')} <span className="text-gray-400 font-normal">({t('phoneOptional')})</span></label>
                <input 
                  {...register('phone')} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                  placeholder={t('phonePlaceholder')}
                  dir="ltr"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('subjectLabel')}</label>
                <input 
                  {...register('subject', { required: t('subjectRequired') })} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                  placeholder={t('subjectPlaceholder')}
                />
                {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('messageLabel')}</label>
              <textarea 
                {...register('message', { required: t('messageRequired') })} 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all min-h-[120px] resize-y"
                placeholder={t('messagePlaceholder')}
              ></textarea>
              {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <>
                  <span>{t('submitButton')}</span>
                  <Send className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
