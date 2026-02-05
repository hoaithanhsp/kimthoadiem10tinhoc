import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, Download, ExternalLink } from 'lucide-react';

interface ExamViewerProps {
    examId: string;
    examName: string;
    fileName: string;
    onBack: () => void;
}

export const ExamViewer: React.FC<ExamViewerProps> = ({ examId, examName, fileName, onBack }) => {
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const totalQuestions = 40;
    const pdfUrl = `/exams/${fileName}`;

    const goToQuestion = (num: number) => {
        if (num >= 1 && num <= totalQuestions) {
            setCurrentQuestion(num);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
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
                            <ChevronRight size={20} />
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
