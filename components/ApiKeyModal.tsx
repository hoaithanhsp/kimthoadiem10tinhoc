import React, { useState, useEffect } from 'react';
import { X, Key, ExternalLink, Zap, Sparkles, Shield } from 'lucide-react';
import { AI_MODELS, DEFAULT_MODEL, STORAGE_KEYS, API_KEY_GUIDE_URL } from '../constants';
import { AIModelId } from '../types';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (apiKey: string, model: AIModelId) => void;
    forceOpen?: boolean; // Khi chưa có key, không cho phép đóng
}

const modelIcons: Record<string, React.ReactNode> = {
    'gemini-3-flash-preview': <Zap className="text-yellow-500" size={24} />,
    'gemini-3-pro-preview': <Sparkles className="text-purple-500" size={24} />,
    'gemini-2.5-flash': <Shield className="text-blue-500" size={24} />,
};

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, forceOpen = false }) => {
    const [apiKey, setApiKey] = useState('');
    const [selectedModel, setSelectedModel] = useState<AIModelId>(DEFAULT_MODEL as AIModelId);
    const [error, setError] = useState('');

    useEffect(() => {
        const savedKey = localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
        const savedModel = localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL) as AIModelId || DEFAULT_MODEL;
        setApiKey(savedKey);
        setSelectedModel(savedModel as AIModelId);
    }, [isOpen]);

    const handleSave = () => {
        if (!apiKey.trim()) {
            setError('Vui lòng nhập API Key');
            return;
        }

        localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey.trim());
        localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, selectedModel);

        onSave(apiKey.trim(), selectedModel);
        setError('');

        if (!forceOpen) {
            onClose();
        }
    };

    const handleClose = () => {
        if (forceOpen) return; // Không cho phép đóng khi chưa có key
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-brand-100 p-2 rounded-lg">
                            <Key className="text-brand-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Thiết lập API Key</h2>
                            <p className="text-sm text-gray-500">Cấu hình để sử dụng AI</p>
                        </div>
                    </div>
                    {!forceOpen && (
                        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition">
                            <X size={24} />
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* API Key Input */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            API Key <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => { setApiKey(e.target.value); setError(''); }}
                            placeholder="Nhập Gemini API Key của bạn..."
                            className={`w-full px-4 py-3 rounded-xl border-2 transition focus:outline-none focus:ring-2 focus:ring-brand-500/50 ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-brand-500'
                                }`}
                        />
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <a
                            href={API_KEY_GUIDE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium"
                        >
                            <ExternalLink size={14} />
                            Lấy API Key miễn phí tại Google AI Studio
                        </a>
                    </div>

                    {/* Model Selection */}
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700">Chọn Model AI</label>
                        <div className="space-y-2">
                            {AI_MODELS.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => setSelectedModel(model.id as AIModelId)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-left ${selectedModel === model.id
                                            ? 'border-brand-500 bg-brand-50 shadow-md'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="shrink-0">
                                        {modelIcons[model.id]}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-semibold ${selectedModel === model.id ? 'text-brand-700' : 'text-gray-800'}`}>
                                            {model.name}
                                        </p>
                                        <p className="text-sm text-gray-500">{model.description}</p>
                                    </div>
                                    {selectedModel === model.id && (
                                        <div className="shrink-0 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={handleSave}
                        className="w-full bg-gradient-to-r from-brand-600 to-blue-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition transform"
                    >
                        Lưu Cài Đặt
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApiKeyModal;
