import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FeatureRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FeatureRequestModal: React.FC<FeatureRequestModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        feature: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');

        try {
            const response = await fetch('/api/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to send email');

            setStatus('success');
            setFormData({ name: '', email: '', feature: '' });
            setTimeout(() => {
                onClose();
                setStatus('idle');
            }, 2000);
        } catch (error) {
            console.error('Error sending email:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

                <div className="relative w-full max-w-md transform rounded-lg bg-white dark:bg-gray-800 p-6 text-left shadow-xl transition-all">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Request a New Feature
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                         px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                                         focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500
                                         bg-white dark:bg-gray-700"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                         px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                                         focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500
                                         bg-white dark:bg-gray-700"
                            />
                        </div>

                        <div>
                            <label htmlFor="feature" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Feature Request
                            </label>
                            <textarea
                                id="feature"
                                required
                                maxLength={1000}
                                value={formData.feature}
                                onChange={(e) => setFormData(prev => ({ ...prev, feature: e.target.value }))}
                                rows={4}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                         px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                                         focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500
                                         bg-white dark:bg-gray-700"
                            />
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {formData.feature.length}/1000 characters
                            </p>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-md bg-blue-600 dark:bg-blue-500 px-4 py-2 text-sm font-medium text-white
                                         hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500
                                         focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>

                        {status === 'success' && (
                            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                                Feature request submitted successfully!
                            </p>
                        )}
                        {status === 'error' && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                Failed to submit request. Please try again.
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FeatureRequestModal; 