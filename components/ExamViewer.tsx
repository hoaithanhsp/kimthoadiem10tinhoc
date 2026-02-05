import React, { useState } from 'react';
import { ChevronLeft, FileText, Download, ExternalLink, Play, BookOpen } from 'lucide-react';
import { ExamPractice } from './ExamPractice';
import { ExamStructure, ExamPracticeResult } from '../types';
import { getExamById } from '../examData';

interface ExamViewerProps {
    examId: string;
    examName: string;
    fileName: string;
    onBack: () => void;
}

type Mode = 'select' | 'view' | 'practice';

export const ExamViewer: React.FC<ExamViewerProps> = ({ examId, examName, fileName, onBack }) => {
    const [mode, setMode] = useState<Mode>('select');
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const totalQuestions = 40;
    const pdfUrl = `/exams/${fileName}`;

    // Lấy dữ liệu đề thi (nếu có)
    const examData = getExamById(examId);

    const goToQuestion = (num: number) => {
        if (num >= 1 && num <= totalQuestions) {
            setCurrentQuestion(num);
        }
    };

    const handlePracticeFinish = (result: ExamPracticeResult) => {
        // Có thể lưu kết quả vào localStorage hoặc hiển thị thông báo
        console.log('Exam result:', result);
    };

    // Mode: Select - Chọn xem đề hoặc làm bài
    if (mode === 'select') {
        return (
            <div className="space-y-6 animate-fade-in">
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
                            <FileText className="text-brand-500" size={28} />
                            {examName}
                        </h1>
                        <p className="text-gray-500 mt-1">{totalQuestions} câu hỏi | 50 phút</p>
                    </div>
                </div>

                {/* Mode Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* Xem đề PDF */}
                    <button
                        onClick={() => setMode('view')}
                        className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-brand-500 p-8 text-left transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <BookOpen size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Xem đề PDF</h3>
                        <p className="text-gray-500">
                            Xem đề thi định dạng PDF, có thể tải về và in ra để luyện tập
                        </p>
                    </button>

                    {/* Làm bài trực tiếp */}
                    <button
                        onClick={() => examData ? setMode('practice') : alert('Chức năng làm bài cho đề này đang được cập nhật!')}
                        className={`group bg-white rounded-2xl border-2 p-8 text-left transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${examData
                                ? 'border-gray-200 hover:border-green-500'
                                : 'border-gray-100 opacity-60 cursor-not-allowed'
                            }`}
                    >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${examData
                                ? 'bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white'
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                            <Play size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Làm bài trực tiếp
                            {!examData && <span className="text-sm font-normal text-orange-500 ml-2">(Sắp có)</span>}
                        </h3>
                        <p className="text-gray-500">
                            Làm bài trực tiếp trên hệ thống với chấm điểm tự động theo cấu trúc THPTQG
                        </p>
                        {examData && (
                            <div className="mt-4 text-sm text-green-600 font-medium flex items-center gap-1">
                                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                                Sẵn sàng làm bài
                            </div>
                        )}
                    </button>
                </div>

                {/* Scoring Info */}
                <div className="bg-gradient-to-r from-brand-50 to-blue-50 rounded-xl p-6 border border-brand-100 max-w-3xl mx-auto">
                    <h3 className="font-bold text-gray-800 mb-3">📊 Cách tính điểm (Cấu trúc từ 2025)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-white rounded-lg p-4 border">
                            <div className="font-bold text-brand-600 mb-1">Phần I - Trắc nghiệm</div>
                            <p className="text-gray-600">24 câu × 0.25đ = <strong>6 điểm</strong></p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border">
                            <div className="font-bold text-green-600 mb-1">Phần II - Đúng/Sai</div>
                            <p className="text-gray-600">2 câu × 1đ = <strong>2 điểm</strong></p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border">
                            <div className="font-bold text-purple-600 mb-1">Phần III - Tự chọn</div>
                            <p className="text-gray-600">2 câu × 1đ = <strong>2 điểm</strong></p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                        * Phần II & III: 1 ý đúng = 0.1đ | 2 ý = 0.25đ | 3 ý = 0.5đ | 4 ý = 1.0đ
                    </p>
                </div>
            </div>
        );
    }

    // Mode: Practice - Làm bài
    if (mode === 'practice' && examData) {
        return (
            <ExamPractice
                exam={examData}
                onBack={() => setMode('select')}
                onFinish={handlePracticeFinish}
            />
        );
    }

    // Mode: View - Xem PDF (code cũ)
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setMode('select')}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FileText className="text-brand-500" size={24} />
                            {examName}
                        </h1>
                        <p className="text-sm text-gray-500">{totalQuestions} câu hỏi</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {examData && (
                        <button
                            onClick={() => setMode('practice')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                        >
                            <Play size={18} />
                            Làm bài
                        </button>
                    )}
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-600 rounded-lg hover:bg-brand-200 transition-colors font-medium"
                    >
                        <ExternalLink size={18} />
                        Mở đề
                    </a>
                    <a
                        href={pdfUrl}
                        download
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        <Download size={18} />
                        Tải về
                    </a>
                </div>
            </div>

            {/* Question Navigation */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-800 mb-4">Chọn câu hỏi để làm</h2>
                <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
                    {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            onClick={() => goToQuestion(num)}
                            className={`aspect-square rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105 ${currentQuestion === num
                                ? 'bg-brand-500 text-white shadow-lg scale-105'
                                : 'bg-gray-100 text-gray-700 hover:bg-brand-100 hover:text-brand-600'
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>

            {/* PDF Viewer */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-brand-600 to-blue-500 p-4 flex items-center justify-between text-white">
                    <span className="font-bold">Câu {currentQuestion}</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goToQuestion(currentQuestion - 1)}
                            disabled={currentQuestion === 1}
                            className={`p-2 rounded-lg transition-colors ${currentQuestion === 1
                                ? 'bg-white/20 cursor-not-allowed'
                                : 'bg-white/30 hover:bg-white/40'
                                }`}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="px-3">
                            {currentQuestion} / {totalQuestions}
                        </span>
                        <button
                            onClick={() => goToQuestion(currentQuestion + 1)}
                            disabled={currentQuestion === totalQuestions}
                            className={`p-2 rounded-lg transition-colors ${currentQuestion === totalQuestions
                                ? 'bg-white/20 cursor-not-allowed'
                                : 'bg-white/30 hover:bg-white/40'
                                }`}
                        >
                            <ChevronLeft size={20} className="rotate-180" />
                        </button>
                    </div>
                </div>

                {/* PDF Embed */}
                <div className="aspect-[4/3] md:aspect-[16/9]">
                    <iframe
                        src={`${pdfUrl}#page=${currentQuestion}`}
                        className="w-full h-full border-0"
                        title={`${examName} - Câu ${currentQuestion}`}
                    />
                </div>
            </div>

            {/* Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                <div className="shrink-0 text-2xl">💡</div>
                <div>
                    <p className="font-semibold text-yellow-800">Mẹo</p>
                    <p className="text-sm text-yellow-700 mt-1">
                        Click vào số câu hỏi ở trên để nhảy đến câu đó trong đề. Sử dụng nút mũi tên để di chuyển qua lại giữa các câu.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ExamViewer;
