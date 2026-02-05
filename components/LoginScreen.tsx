import React, { useState } from 'react';
import { User, Lock, BookOpen, Eye, EyeOff } from 'lucide-react';

interface LoginScreenProps {
    onLogin: () => void;
}

const CREDENTIALS = {
    username: 'Trần Thị Kim Thoa',
    password: '12345',
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate loading
        await new Promise(resolve => setTimeout(resolve, 800));

        if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
            // Lưu trạng thái đăng nhập
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('loggedInUser', username);
            onLogin();
        } else {
            setError('Tên đăng nhập hoặc mật khẩu không đúng!');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-600 via-blue-500 to-purple-600 p-4">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-brand-600 to-blue-500 p-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-4">
                        <BookOpen className="text-brand-600" size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">Điểm 10 Tin Học</h1>
                    <p className="text-blue-100 text-sm">Luyện thi THPTQG - Môn Tin học</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Đăng nhập</h2>
                        <p className="text-gray-500 text-sm mt-1">Chào mừng bạn quay trở lại!</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center animate-shake">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Username */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="text-gray-400" size={20} />
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Tên đăng nhập"
                                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition outline-none text-gray-800"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="text-gray-400" size={20} />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mật khẩu"
                                className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition outline-none text-gray-800"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition transform ${isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-brand-600 to-blue-500 hover:shadow-xl hover:scale-[1.02]'
                            }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Đang đăng nhập...
                            </span>
                        ) : (
                            'Đăng nhập'
                        )}
                    </button>

                    <p className="text-center text-gray-500 text-xs mt-4">
                        © 2024 Điểm 10 Tin Học - Trường THPT Hoàng Diệu
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;
