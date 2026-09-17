"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema, AddressInput } from '@/lib/validations/auth';
import { getCustomerAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '@/app/actions/customer/addresses';
import { Plus, Edit2, Trash2, Star, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';

interface AddressData {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  city: string;
  area?: string | null;
  address: string;
  apartment?: string | null;
  postalCode?: string | null;
  isDefault: boolean;
}

export default function AddressesPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const isAr = locale === 'ar';
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: { isDefault: false },
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await getCustomerAddresses();
      setAddresses(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditingId(null);
    reset({ firstName: '', lastName: '', phone: '', country: 'Egypt', city: '', area: '', address: '', apartment: '', postalCode: '', isDefault: false });
    setShowForm(true);
  };

  const openEdit = (addr: AddressData) => {
    setEditingId(addr.id);
    reset({ firstName: addr.firstName, lastName: addr.lastName, phone: addr.phone, country: addr.country, city: addr.city, area: addr.area || '', address: addr.address, apartment: addr.apartment || '', postalCode: addr.postalCode || '', isDefault: addr.isDefault });
    setShowForm(true);
  };

  const onSubmit = async (data: AddressInput) => {
    setSuccessMsg(''); setErrorMsg('');
    try {
      if (editingId) {
        await updateAddress(editingId, data);
        setSuccessMsg(isAr ? 'تم تحديث العنوان' : 'Address updated');
      } else {
        await createAddress(data);
        setSuccessMsg(isAr ? 'تم إضافة العنوان' : 'Address added');
      }
      setShowForm(false);
      await load();
    } catch (e: any) {
      setErrorMsg(e.message || 'Error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isAr ? 'هل تريد حذف هذا العنوان؟' : 'Delete this address?')) return;
    try {
      await deleteAddress(id);
      await load();
    } catch (e: any) { setErrorMsg(e.message); }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      await load();
    } catch (e: any) { setErrorMsg(e.message); }
  };

  return (
    <div className="space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{isAr ? 'عناويني' : 'My Addresses'}</h2>
          <button onClick={openNew} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            <Plus className="w-4 h-4" /> {isAr ? 'إضافة عنوان' : 'Add Address'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> {errorMsg}
        </div>
      )}

      {/* Address Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-b border-gray-200lue-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">{editingId ? (isAr ? 'تعديل العنوان' : 'Edit Address') : (isAr ? 'عنوان جديد' : 'New Address')}</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'firstName', labelEn: 'First Name', labelAr: 'الاسم الأول' },
                { name: 'lastName', labelEn: 'Last Name', labelAr: 'الاسم الأخير' },
                { name: 'phone', labelEn: 'Phone', labelAr: 'الهاتف' },
                { name: 'country', labelEn: 'Country', labelAr: 'الدولة' },
                { name: 'city', labelEn: 'City', labelAr: 'المدينة' },
                { name: 'area', labelEn: 'Area / District', labelAr: 'الحي / المنطقة' },
                { name: 'address', labelEn: 'Street Address', labelAr: 'عنوان الشارع' },
                { name: 'apartment', labelEn: 'Apartment / Building', labelAr: 'الشقة / المبنى' },
                { name: 'postalCode', labelEn: 'Postal Code', labelAr: 'الرمز البريدي' },
              ].map(({ name, labelEn, labelAr }) => (
                <div key={name} className={name === 'address' ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? labelAr : labelEn}</label>
                  <input
                    {...register(name as keyof AddressInput)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
                  />
                  {errors[name as keyof AddressInput] && (
                    <p className="text-xs text-red-500 mt-0.5">{errors[name as keyof AddressInput]?.message as string}</p>
                  )}
                </div>
              ))}
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isDefault')} className="rounded border-gray-300 text-blue-600" />
              <span className="text-sm text-gray-700">{isAr ? 'تعيين كعنوان افتراضي' : 'Set as default address'}</span>
            </label>
            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors disabled:opacity-50">
                {isSubmitting ? '...' : (editingId ? (isAr ? 'حفظ' : 'Save') : (isAr ? 'إضافة' : 'Add'))}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-5 py-2 rounded-xl transition-colors">
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center"><div className="animate-spin w-6 h-6 border-2 border-b border-gray-200lue-600 border-t-transparent rounded-full mx-auto" /></div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">{isAr ? 'لا توجد عناوين مضافة بعد' : 'No addresses added yet'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div key={addr.id} className={`bg-white rounded-2xl shadow-sm border p-5 transition-all ${addr.isDefault ? 'border-b border-gray-200lue-300' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  {addr.isDefault && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-2">
                      <Star className="w-3 h-3" /> {isAr ? 'العنوان الافتراضي' : 'Default'}
                    </span>
                  )}
                  <p className="font-semibold text-gray-900">{addr.firstName} {addr.lastName}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{addr.address}{addr.apartment ? `, ${addr.apartment}` : ''}</p>
                  <p className="text-sm text-gray-500">{addr.city}{addr.area ? `, ${addr.area}` : ''}, {addr.country}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{addr.phone}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!addr.isDefault && (
                    <button onClick={() => handleSetDefault(addr.id)} title={isAr ? 'تعيين كافتراضي' : 'Set default'} className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => openEdit(addr)} className="p-2 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(addr.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
