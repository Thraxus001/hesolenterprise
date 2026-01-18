import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseConfig';
import { Save, Loader } from 'lucide-react';

const Settings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        storeName: '',
        storeEmail: 'hesolenterprises@gmail.com',
        currency: 'KES',
        taxRate: 16,
        shippingFee: 0,
        enableReviews: true,
        enableGuestCheckout: true
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setSettings({
                    storeName: data.store_name,
                    storeEmail: data.store_email,
                    currency: data.currency,
                    taxRate: data.tax_rate,
                    shippingFee: data.shipping_fee,
                    enableReviews: data.enable_reviews,
                    enableGuestCheckout: data.enable_guest_checkout
                });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Upsert (we assume one row, so we can fetch first to get ID or just rely on single row logic if we enforced it)
            // Ideally we get the ID from fetch, but here let's valid check

            // First get existing ID if any
            const { data: existing } = await supabase.from('settings').select('id').single();

            const payload = {
                store_name: settings.storeName,
                store_email: settings.storeEmail,
                currency: settings.currency,
                tax_rate: settings.taxRate,
                shipping_fee: settings.shippingFee,
                enable_reviews: settings.enableReviews,
                enable_guest_checkout: settings.enableGuestCheckout,
                updated_at: new Date()
            };

            let error;
            if (existing) {
                const { error: updateError } = await supabase
                    .from('settings')
                    .update(payload)
                    .eq('id', existing.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('settings')
                    .insert([payload]);
                error = insertError;
            }

            if (error) throw error;
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-1">Manage store configuration</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-green-700">{success}</p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-6">
                <div className="border-b pb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">General Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                            <input
                                type="text"
                                name="storeName"
                                value={settings.storeName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                            <input
                                type="email"
                                name="storeEmail"
                                value={settings.storeEmail}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="border-b pb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Financials</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                            <select
                                name="currency"
                                value={settings.currency}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="USD">USD ($)</option>
                                <option value="KES">KES (Ksh)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                            <input
                                type="number"
                                name="taxRate"
                                value={settings.taxRate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Base Shipping Fee</label>
                            <input
                                type="number"
                                name="shippingFee"
                                value={settings.shippingFee}
                                onChange={handleChange}
                                step="0.01"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="border-b pb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Enable Product Reviews</p>
                                <p className="text-sm text-gray-500">Allow customers to leave reviews on products</p>
                            </div>
                            <input
                                type="checkbox"
                                name="enableReviews"
                                checked={settings.enableReviews}
                                onChange={handleChange}
                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Guest Checkout</p>
                                <p className="text-sm text-gray-500">Allow customers to purchase without an account</p>
                            </div>
                            <input
                                type="checkbox"
                                name="enableGuestCheckout"
                                checked={settings.enableGuestCheckout}
                                onChange={handleChange}
                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className={`flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${saving ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                        <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
