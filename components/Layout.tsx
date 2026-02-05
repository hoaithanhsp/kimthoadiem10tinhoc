import React, { useState, useEffect } from 'react';
import { BookOpen, BarChart2, Home, FileText, Menu, X, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ApiKeyModal } from './ApiKeyModal';
import { hasApiKey } from '../services/geminiService';
import { STORAGE_KEYS } from '../constants';
import { AIModelId } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    setHasKey(hasApiKey());
    const model = localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL) || '';
    setSelectedModel(model);

    // Hiển thị modal nếu chưa có key
    if (!hasApiKey()) {
      setIsApiKeyModalOpen(true);
    }
  }, []);

  const handleApiKeySave = (_apiKey: string, model: AIModelId) => {
    setHasKey(true);
    setSelectedModel(model);
    setIsApiKeyModalOpen(false);
  };

  const navItems = [
    { label: 'Trang chủ', path: '/', icon: <Home size={20} /> },
    { label: 'Luyện đề', path: '/practice', icon: <FileText size={20} /> },
    { label: 'Thống kê', path: '/stats', icon: <BarChart2 size={20} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-brand-600 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 font-bold text-xl hover:opacity-90 transition">
              <div className="bg-white text-brand-600 p-1.5 rounded-lg">
                <BookOpen size={24} />
              </div>
              <span>Điểm 10 Tin</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition duration-200 ${isActive(item.path)
                      ? 'bg-brand-700 text-white'
                      : 'text-brand-100 hover:bg-brand-500 hover:text-white'
                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Settings Button */}
              <button
                onClick={() => setIsApiKeyModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-brand-700 hover:bg-brand-800 transition"
              >
                <Settings size={18} />
                <span className="hidden lg:inline">Cài đặt</span>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setIsApiKeyModalOpen(true)}
                className="text-white p-2"
              >
                <Settings size={22} />
              </button>
              <button
                className="text-white focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* API Key Warning Banner */}
          {!hasKey && (
            <div className="bg-red-500 text-white text-center py-2 px-4 text-sm animate-pulse">
              <button
                onClick={() => setIsApiKeyModalOpen(true)}
                className="underline font-semibold hover:text-red-100"
              >
                ⚠️ Lấy API key để sử dụng app
              </button>
            </div>
          )}
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-brand-700 pb-4 px-4 pt-2 shadow-inner">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-md ${isActive(item.path) ? 'bg-brand-800' : 'hover:bg-brand-600'
                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm">
        <p>© 2024 Điểm 10 Tin Học - Luyện thi THPTQG</p>
        <p className="mt-2">
          Powered by Google Gemini
          {selectedModel && <span className="ml-2 text-brand-400">({selectedModel})</span>}
        </p>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleApiKeySave}
        forceOpen={!hasKey}
      />
    </div>
  );
};