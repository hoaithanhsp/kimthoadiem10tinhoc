import React, { useState } from 'react';
import { FileText, ArrowRight, ChevronLeft, Clock, CheckCircle, FolderOpen } from 'lucide-react';

interface Exam {
    id: string;
    name: string;
    fileName: string;
    questionCount: number;
    completed?: boolean;
}

// Generate 20 exams từ danh sách file
const EXAMS: Exam[] = Array.from({ length: 20 }, (_, i) => ({
    id: `exam-${i + 1}`,
    name: `Đề ${String(i + 1).padStart(2, '0')}`,
    fileName: `05${String(i + 1).padStart(2, '0')}.pdf`,
    questionCount: 40,
    completed: false,
}));

interface ExamCardProps {
    exam: Exam;
    index: number;
    onClick: () => void;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam, index, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="group bg-white rounded-xl border-2 border-gray-100 hover:border-brand-500 hover:shadow-lg p-5 text-left transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1"
            style={{
                animationDelay: `${index * 50}ms`,
            }}
        >
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-300 ${exam.completed
                        ? 'bg-green-100 text-green-600'
                        : 'bg-brand-100 text-brand-600 group-hover:bg-brand-500 group-hover:text-white'
                    }`}>
                    {exam.completed ? (
                        <CheckCircle size={28} />
                    ) : (
                        <FileText size={28} />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-lg group-hover:text-brand-600 transition-colors">
                        {exam.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <Clock size={14} />
                        {exam.questionCount} câu hỏi
                    </p>
                </div>

                {/* Arrow */}
                <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="text-brand-500" size={20} />
                </div>
            </div>
        </button>
    );
};

interface ExamListProps {
    onSelectExam: (exam: Exam) => void;
    onBack: () => void;
}

export const ExamList: React.FC<ExamListProps> = ({ onSelectExam, onBack }) => {
    const [isVisible, setIsVisible] = useState(true);

    return (
        <div className={`space-y-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <FolderOpen className="text-brand-500" size={28} />
                        Ngân hàng đề thi
                    </h1>
                    <p className="text-gray-500 mt-1">Chọn đề để bắt đầu luyện tập</p>
                </div>
            </div>

            {/* Grid of Exams */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {EXAMS.map((exam, index) => (
                    <ExamCard
                        key={exam.id}
                        exam={exam}
                        index={index}
                        onClick={() => onSelectExam(exam)}
                    />
                ))}
            </div>

            {/* Footer info */}
            <div className="bg-gradient-to-r from-brand-50 to-blue-50 rounded-xl p-6 border border-brand-100">
                <div className="flex items-center gap-4">
                    <div className="bg-brand-100 p-3 rounded-xl">
                        <FileText className="text-brand-600" size={32} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">Mẹo luyện thi</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Hoàn thành mỗi đề trong 50 phút để chuẩn bị tốt cho kỳ thi THPTQG. Sau khi làm xong, hệ thống sẽ tự động chấm điểm và giải thích chi tiết.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamList;
