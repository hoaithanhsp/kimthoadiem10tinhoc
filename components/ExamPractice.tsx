import React, { useState, useEffect, useCallback } from 'react';
import {
    ExamStructure,
    ExamUserAnswers,
    ExamPracticeResult,
    calculateTrueFalseScore
} from '../types';
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    XCircle,
    AlertCircle,
    FileText,
    Award,
    BookOpen
} from 'lucide-react';

interface ExamPracticeProps {
    exam: ExamStructure;
    onBack: () => void;
    onFinish: (result: ExamPracticeResult) => void;
}

type ActiveTab = 'part1' | 'part2' | 'part3';

export const ExamPractice: React.FC<ExamPracticeProps> = ({ exam, onBack, onFinish }) => {
    // State
    const [activeTab, setActiveTab] = useState<ActiveTab>('part1');
    const [currentPart1Index, setCurrentPart1Index] = useState(0);
    const [answers, setAnswers] = useState<ExamUserAnswers>({
        part1: {},
        part2: {},
        part3Choice: null,
        part3: {}
    });
    const [timeLeft, setTimeLeft] = useState(50 * 60); // 50 phút
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [result, setResult] = useState<ExamPracticeResult | null>(null);

    // Timer
    useEffect(() => {
        if (isSubmitted) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isSubmitted]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Handlers Phần I
    const handlePart1Answer = (questionNumber: number, answer: 'A' | 'B' | 'C' | 'D') => {
        setAnswers(prev => ({
            ...prev,
            part1: { ...prev.part1, [questionNumber]: answer }
        }));
    };

    // Handlers Phần II & III
    const handleTrueFalseAnswer = (
        part: 'part2' | 'part3',
        questionNumber: number,
        optionId: 'a' | 'b' | 'c' | 'd',
        value: boolean
    ) => {
        setAnswers(prev => ({
            ...prev,
            [part]: {
                ...prev[part],
                [questionNumber]: {
                    ...(prev[part][questionNumber] || { a: null, b: null, c: null, d: null }),
                    [optionId]: value
                }
            }
        }));
    };

    // Chọn Phần III (Option 1 hoặc 2)
    const handlePart3Choice = (choice: 'option1' | 'option2') => {
        setAnswers(prev => ({
            ...prev,
            part3Choice: choice,
            part3: {} // Reset câu trả lời Phần III khi đổi lựa chọn
        }));
    };

    // Tính điểm
    const calculateScore = useCallback((): ExamPracticeResult => {
        // Phần I: 0.25đ/câu đúng
        let part1Correct = 0;
        exam.part1.forEach(q => {
            if (answers.part1[q.questionNumber] === q.correctAnswer) {
                part1Correct++;
            }
        });
        const part1Score = part1Correct * 0.25;

        // Phần II: Tính theo số ý đúng
        const part2Details: { questionNumber: number; correctCount: number; score: number }[] = [];
        let part2Score = 0;
        exam.part2.forEach(q => {
            const userAns = answers.part2[q.questionNumber] || {};
            let correctCount = 0;
            q.options.forEach(opt => {
                if (userAns[opt.id] === opt.isCorrect) {
                    correctCount++;
                }
            });
            const score = calculateTrueFalseScore(correctCount);
            part2Details.push({ questionNumber: q.questionNumber, correctCount, score });
            part2Score += score;
        });

        // Phần III: Tính theo số ý đúng (chỉ tính cặp đã chọn)
        const part3Details: { questionNumber: number; correctCount: number; score: number }[] = [];
        let part3Score = 0;
        const part3Questions = answers.part3Choice === 'option1' ? exam.part3Option1 : exam.part3Option2;

        if (part3Questions && answers.part3Choice) {
            part3Questions.forEach(q => {
                const userAns = answers.part3[q.questionNumber] || {};
                let correctCount = 0;
                q.options.forEach(opt => {
                    if (userAns[opt.id] === opt.isCorrect) {
                        correctCount++;
                    }
                });
                const score = calculateTrueFalseScore(correctCount);
                part3Details.push({ questionNumber: q.questionNumber, correctCount, score });
                part3Score += score;
            });
        }

        const totalScore = Math.round((part1Score + part2Score + part3Score) * 100) / 100;

        return {
            part1Score,
            part1Correct,
            part2Score,
            part2Details,
            part3Score,
            part3Details,
            totalScore
        };
    }, [exam, answers]);

    // Nộp bài
    const handleSubmit = useCallback(() => {
        if (isSubmitted) return;

        const finalResult = calculateScore();
        setResult(finalResult);
        setIsSubmitted(true);
        onFinish(finalResult);
    }, [calculateScore, isSubmitted, onFinish]);

    // Count answered questions
    const part1Answered = Object.keys(answers.part1).length;
    const part2Answered = Object.keys(answers.part2).length;
    const part3Answered = answers.part3Choice ? Object.keys(answers.part3).length : 0;

    // Render kết quả
    if (isSubmitted && result) {
        return (
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                {/* Header kết quả */}
                <div className="bg-gradient-to-r from-brand-600 to-blue-500 rounded-2xl p-8 text-white text-center">
                    <Award className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold mb-2">Hoàn thành bài thi!</h1>
                    <p className="text-blue-100">{exam.name}</p>
                </div>

                {/* Điểm tổng */}
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="text-6xl font-bold text-brand-600 mb-2">
                        {result.totalScore.toFixed(2)}
                    </div>
                    <p className="text-gray-500 text-lg">/10 điểm</p>
                </div>

                {/* Chi tiết điểm */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Phần I */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <BookOpen className="text-brand-500" size={20} />
                            Phần I - Trắc nghiệm
                        </h3>
                        <p className="text-3xl font-bold text-brand-600">{result.part1Score.toFixed(2)}/6</p>
                        <p className="text-sm text-gray-500 mt-1">{result.part1Correct}/24 câu đúng</p>
                    </div>

                    {/* Phần II */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <CheckCircle className="text-green-500" size={20} />
                            Phần II - Đúng/Sai
                        </h3>
                        <p className="text-3xl font-bold text-green-600">{result.part2Score.toFixed(2)}/2</p>
                        <div className="text-sm text-gray-500 mt-1 space-y-1">
                            {result.part2Details.map(d => (
                                <div key={d.questionNumber}>
                                    Câu {d.questionNumber}: {d.correctCount}/4 ý → {d.score}đ
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Phần III */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <CheckCircle className="text-purple-500" size={20} />
                            Phần III - Tự chọn
                        </h3>
                        <p className="text-3xl font-bold text-purple-600">{result.part3Score.toFixed(2)}/2</p>
                        <div className="text-sm text-gray-500 mt-1 space-y-1">
                            {result.part3Details.map(d => (
                                <div key={d.questionNumber}>
                                    Câu {d.questionNumber}: {d.correctCount}/4 ý → {d.score}đ
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Nút quay lại */}
                <div className="text-center">
                    <button
                        onClick={onBack}
                        className="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors"
                    >
                        Quay lại danh sách đề
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-24 space-y-4">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-wrap gap-4 justify-between items-center sticky top-20 z-40">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { if (window.confirm('Bạn có muốn thoát? Bài làm sẽ không được lưu.')) onBack(); }}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="font-bold text-gray-800 flex items-center gap-2">
                            <FileText className="text-brand-500" size={20} />
                            {exam.name}
                        </h1>
                        <p className="text-sm text-gray-500">Làm bài</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-lg font-bold">
                    <Clock className={timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-brand-600'} size={24} />
                    <span className={timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-brand-600'}>
                        {formatTime(timeLeft)}
                    </span>
                </div>

                <button
                    onClick={() => { if (window.confirm('Bạn có chắc chắn muốn nộp bài?')) handleSubmit(); }}
                    className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition shadow-sm"
                >
                    Nộp bài
                </button>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('part1')}
                        className={`flex-1 py-3 px-4 font-medium text-center transition-colors ${activeTab === 'part1'
                                ? 'bg-brand-50 text-brand-600 border-b-2 border-brand-500'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <span className="block text-sm">Phần I</span>
                        <span className="text-xs text-gray-400">{part1Answered}/24 câu</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('part2')}
                        className={`flex-1 py-3 px-4 font-medium text-center transition-colors ${activeTab === 'part2'
                                ? 'bg-brand-50 text-brand-600 border-b-2 border-brand-500'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <span className="block text-sm">Phần II</span>
                        <span className="text-xs text-gray-400">{part2Answered}/2 câu</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('part3')}
                        className={`flex-1 py-3 px-4 font-medium text-center transition-colors ${activeTab === 'part3'
                                ? 'bg-brand-50 text-brand-600 border-b-2 border-brand-500'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <span className="block text-sm">Phần III</span>
                        <span className="text-xs text-gray-400">
                            {answers.part3Choice ? `${part3Answered}/2 câu` : 'Chưa chọn'}
                        </span>
                    </button>
                </div>

                {/* Phần I Content */}
                {activeTab === 'part1' && (
                    <div className="p-6">
                        {/* Question Navigator */}
                        <div className="mb-6">
                            <p className="text-sm text-gray-500 mb-2">Chọn câu hỏi:</p>
                            <div className="grid grid-cols-8 sm:grid-cols-12 gap-2">
                                {exam.part1.map((q, idx) => {
                                    const isAnswered = answers.part1[q.questionNumber] !== undefined;
                                    const isCurrent = idx === currentPart1Index;
                                    return (
                                        <button
                                            key={q.questionNumber}
                                            onClick={() => setCurrentPart1Index(idx)}
                                            className={`aspect-square rounded-lg font-semibold text-sm transition-all ${isCurrent
                                                    ? 'bg-brand-500 text-white ring-2 ring-brand-300'
                                                    : isAnswered
                                                        ? 'bg-green-100 text-green-700 border border-green-300'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {q.questionNumber}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Current Question */}
                        <div className="border rounded-xl p-6 bg-gray-50">
                            <h3 className="font-bold text-gray-800 mb-4">
                                Câu {exam.part1[currentPart1Index].questionNumber}:
                            </h3>
                            <p className="text-lg text-gray-800 mb-6">
                                {exam.part1[currentPart1Index].question}
                            </p>

                            <div className="space-y-3">
                                {(['A', 'B', 'C', 'D'] as const).map(opt => {
                                    const q = exam.part1[currentPart1Index];
                                    const isSelected = answers.part1[q.questionNumber] === opt;
                                    return (
                                        <label
                                            key={opt}
                                            className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-brand-50 ${isSelected ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-white'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`q-${q.questionNumber}`}
                                                checked={isSelected}
                                                onChange={() => handlePart1Answer(q.questionNumber, opt)}
                                                className="mt-1 mr-3 w-5 h-5 text-brand-600"
                                            />
                                            <span className="text-gray-700">
                                                <strong>{opt}.</strong> {q.options[opt]}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>

                            {/* Navigation */}
                            <div className="flex justify-between mt-6">
                                <button
                                    disabled={currentPart1Index === 0}
                                    onClick={() => setCurrentPart1Index(p => p - 1)}
                                    className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={20} /> Câu trước
                                </button>
                                <button
                                    disabled={currentPart1Index === 23}
                                    onClick={() => setCurrentPart1Index(p => p + 1)}
                                    className="flex items-center gap-1 px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Câu sau <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Phần II Content */}
                {activeTab === 'part2' && (
                    <div className="p-6 space-y-6">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
                            <div>
                                <p className="font-medium text-yellow-800">Cách tính điểm Phần II</p>
                                <p className="text-sm text-yellow-700">
                                    1 ý đúng: 0.1đ | 2 ý đúng: 0.25đ | 3 ý đúng: 0.5đ | 4 ý đúng: 1.0đ
                                </p>
                            </div>
                        </div>

                        {exam.part2.map(q => (
                            <div key={q.questionNumber} className="border rounded-xl overflow-hidden">
                                <div className="bg-gray-100 p-4 border-b">
                                    <h3 className="font-bold text-gray-800">Câu {q.questionNumber}</h3>
                                    <p className="text-gray-700 mt-1">{q.mainText}</p>
                                </div>
                                <div className="divide-y">
                                    {q.options.map(opt => {
                                        const userAns = answers.part2[q.questionNumber]?.[opt.id];
                                        return (
                                            <div key={opt.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                                                <span className="text-gray-700 flex-1 pr-4">
                                                    <strong>{opt.id})</strong> {opt.text}
                                                </span>
                                                <div className="flex gap-2 shrink-0">
                                                    <button
                                                        onClick={() => handleTrueFalseAnswer('part2', q.questionNumber, opt.id, true)}
                                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${userAns === true
                                                                ? 'bg-green-500 text-white'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-green-100'
                                                            }`}
                                                    >
                                                        Đ
                                                    </button>
                                                    <button
                                                        onClick={() => handleTrueFalseAnswer('part2', q.questionNumber, opt.id, false)}
                                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${userAns === false
                                                                ? 'bg-red-500 text-white'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-red-100'
                                                            }`}
                                                    >
                                                        S
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Phần III Content */}
                {activeTab === 'part3' && (
                    <div className="p-6 space-y-6">
                        {/* Chọn lựa Phần III */}
                        {!answers.part3Choice && (
                            <div className="text-center py-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Chọn nhóm câu hỏi</h3>
                                <p className="text-gray-500 mb-6">Bạn chỉ được chọn làm 1 trong 2 nhóm câu hỏi sau:</p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => handlePart3Choice('option1')}
                                        className="px-8 py-4 bg-purple-100 text-purple-700 rounded-xl font-bold hover:bg-purple-200 transition-colors border-2 border-purple-300"
                                    >
                                        <span className="block text-lg">Câu 3, 4</span>
                                        <span className="text-sm font-normal">Khoa học máy tính</span>
                                    </button>
                                    <button
                                        onClick={() => handlePart3Choice('option2')}
                                        className="px-8 py-4 bg-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-200 transition-colors border-2 border-blue-300"
                                    >
                                        <span className="block text-lg">Câu 5, 6</span>
                                        <span className="text-sm font-normal">Tin học ứng dụng</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {answers.part3Choice && (
                            <>
                                <div className="flex items-center justify-between">
                                    <div className={`px-4 py-2 rounded-lg font-medium ${answers.part3Choice === 'option1'
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        Đang làm: {answers.part3Choice === 'option1' ? 'Câu 3, 4 (Khoa học máy tính)' : 'Câu 5, 6 (Tin học ứng dụng)'}
                                    </div>
                                    <button
                                        onClick={() => { if (window.confirm('Đổi nhóm câu hỏi? Câu trả lời hiện tại sẽ bị xóa.')) handlePart3Choice(answers.part3Choice === 'option1' ? 'option2' : 'option1'); }}
                                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                                    >
                                        Đổi nhóm câu hỏi
                                    </button>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                                    <AlertCircle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="font-medium text-yellow-800">Cách tính điểm Phần III</p>
                                        <p className="text-sm text-yellow-700">
                                            1 ý đúng: 0.1đ | 2 ý đúng: 0.25đ | 3 ý đúng: 0.5đ | 4 ý đúng: 1.0đ
                                        </p>
                                    </div>
                                </div>

                                {(answers.part3Choice === 'option1' ? exam.part3Option1 : exam.part3Option2).map(q => (
                                    <div key={q.questionNumber} className="border rounded-xl overflow-hidden">
                                        <div className="bg-gray-100 p-4 border-b">
                                            <h3 className="font-bold text-gray-800">Câu {q.questionNumber}</h3>
                                            <p className="text-gray-700 mt-1">{q.mainText}</p>
                                        </div>
                                        <div className="divide-y">
                                            {q.options.map(opt => {
                                                const userAns = answers.part3[q.questionNumber]?.[opt.id];
                                                return (
                                                    <div key={opt.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                                                        <span className="text-gray-700 flex-1 pr-4">
                                                            <strong>{opt.id})</strong> {opt.text}
                                                        </span>
                                                        <div className="flex gap-2 shrink-0">
                                                            <button
                                                                onClick={() => handleTrueFalseAnswer('part3', q.questionNumber, opt.id, true)}
                                                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${userAns === true
                                                                        ? 'bg-green-500 text-white'
                                                                        : 'bg-gray-100 text-gray-600 hover:bg-green-100'
                                                                    }`}
                                                            >
                                                                Đ
                                                            </button>
                                                            <button
                                                                onClick={() => handleTrueFalseAnswer('part3', q.questionNumber, opt.id, false)}
                                                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${userAns === false
                                                                        ? 'bg-red-500 text-white'
                                                                        : 'bg-gray-100 text-gray-600 hover:bg-red-100'
                                                                    }`}
                                                            >
                                                                S
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamPractice;
