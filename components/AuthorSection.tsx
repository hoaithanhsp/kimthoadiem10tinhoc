import React from 'react';
import { MapPin, GraduationCap, Award } from 'lucide-react';

export const AuthorSection: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-brand-600 to-blue-500 p-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Award size={20} />
                    Tác giả
                </h2>
            </div>

            <div className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Avatar */}
                    <div className="shrink-0">
                        <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-brand-100 shadow-lg">
                            <img
                                src="/images/avatar.jpg"
                                alt="Giáo viên Trần Thị Kim Thoa"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Fallback nếu ảnh không load được
                                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Trần+Thị+Kim+Thoa&background=3b82f6&color=fff&size=128';
                                }}
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="text-center sm:text-left space-y-3">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Trần Thị Kim Thoa</h3>
                            <p className="text-brand-600 font-medium flex items-center gap-1 justify-center sm:justify-start mt-1">
                                <GraduationCap size={16} />
                                Giáo viên Tin học
                            </p>
                        </div>

                        <div className="text-gray-600 space-y-1 text-sm">
                            <p className="font-semibold">Trường THPT Hoàng Diệu</p>
                            <p className="flex items-center gap-1 justify-center sm:justify-start text-gray-500">
                                <MapPin size={14} />
                                Số 1 Mạc Đĩnh Chi, phường Phú Lợi, thành phố Cần Thơ
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorSection;
