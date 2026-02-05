import React, { useState, useEffect, useCallback } from 'react';
import { Question, UserAnswer, SubQuestion } from '../types';
import { Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Flag } from 'lucide-react';

interface QuizProps {
  questions: Question[];
  onSubmit: (answers: UserAnswer[], timeSpent: number) => void;
  onCancel: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onSubmit, onCancel }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Map<string, UserAnswer>>(new Map());
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [flagged, setFlagged] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (value: string) => {
    const q = questions[currentIdx];
    const newAnswers = new Map(answers);
    newAnswers.set(q.id, { questionId: q.id, answer: value });
    setAnswers(newAnswers);
  };

  const handleToggleTrueFalse = (subId: string, value: boolean) => {
    const q = questions[currentIdx];
    const newAnswers = new Map(answers);
    const currentAns = newAnswers.get(q.id)?.answer as Record<string, boolean> || {};
    
    newAnswers.set(q.id, {
      questionId: q.id,
      answer: { ...currentAns, [subId]: value }
    });
    setAnswers(newAnswers);
  };

  const toggleFlag = () => {
    const qId = questions[currentIdx].id;
    const newFlags = new Set(flagged);
    if (newFlags.has(qId)) newFlags.delete(qId);
    else newFlags.add(qId);
    setFlagged(newFlags);
  };

  const handleSubmit = useCallback(() => {
    const finalAnswers = Array.from(answers.values());
    const timeSpent = (45 * 60) - timeLeft;
    onSubmit(finalAnswers, timeSpent);
  }, [answers, onSubmit, timeLeft]);

  const currentQ = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;

  // Progress calculation
  const answeredCount = answers.size;
  const progressPercent = (answeredCount / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Quiz Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 flex flex-wrap gap-4 justify-between items-center sticky top-20 z-40">
        <div className="flex items-center space-x-2 text-brand-600 font-bold text-lg">
          <Clock size={24} />
          <span className={timeLeft < 300 ? 'text-red-500 animate-pulse' : ''}>
            {formatTime(timeLeft)}
          </span>
        </div>
        
        <div className="flex-grow mx-4 hidden md:block">
           <div className="flex justify-between text-xs text-gray-500 mb-1">
             <span>Tiến độ</span>
             <span>{answeredCount}/{questions.length} câu</span>
           </div>
           <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-brand-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
           </div>
        </div>

        <button 
           onClick={() => { if(window.confirm('Bạn có chắc chắn muốn nộp bài?')) handleSubmit(); }}
           className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition shadow-sm"
        >
          Nộp bài
        </button>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-h-[400px]">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-700 text-lg">Câu {currentIdx + 1}</h2>
            <button 
              onClick={toggleFlag}
              className={`p-2 rounded-full transition ${flagged.has(currentQ.id) ? 'bg-yellow-100 text-yellow-600' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              <Flag size={20} fill={flagged.has(currentQ.id) ? "currentColor" : "none"} />
            </button>
        </div>
        
        <div className="p-6 md:p-8">
          <p className="text-lg md:text-xl text-gray-800 font-medium mb-6 leading-relaxed">
            {currentQ.question}
          </p>

          {/* Multiple Choice Render */}
          {currentQ.type === 'multiple_choice' && currentQ.options && (
            <div className="space-y-3">
              {currentQ.options.map((opt) => {
                const optLetter = opt.charAt(0); // Assumes "A. ..."
                const isSelected = (answers.get(currentQ.id)?.answer as string) === optLetter;
                return (
                  <label 
                    key={opt}
                    className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-brand-50 ${
                      isSelected ? 'border-brand-500 bg-brand-50' : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${currentQ.id}`}
                      value={optLetter}
                      checked={isSelected}
                      onChange={() => handleSelectOption(optLetter)}
                      className="mt-1 mr-3 w-5 h-5 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-gray-700">{opt}</span>
                  </label>
                );
              })}
            </div>
          )}

          {/* True/False Group Render */}
          {currentQ.type === 'true_false_group' && currentQ.subQuestions && (
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-3 bg-gray-100 font-bold text-sm text-gray-700 border-b border-gray-200">
                    <div className="col-span-8 md:col-span-9">Nội dung</div>
                    <div className="col-span-2 md:col-span-1.5 text-center">Đúng</div>
                    <div className="col-span-2 md:col-span-1.5 text-center">Sai</div>
                </div>
                {currentQ.subQuestions.map((sub) => {
                    const currAns = answers.get(currentQ.id)?.answer as Record<string, boolean> || {};
                    const val = currAns[sub.id]; // true, false or undefined
                    
                    return (
                        <div key={sub.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 last:border-0 items-center hover:bg-white transition">
                            <div className="col-span-8 md:col-span-9 text-gray-800 text-sm md:text-base">{sub.text}</div>
                            <div className="col-span-2 md:col-span-1.5 flex justify-center">
                                <input 
                                    type="radio" 
                                    name={`sq-${sub.id}`}
                                    checked={val === true}
                                    onChange={() => handleToggleTrueFalse(sub.id, true)}
                                    className="w-5 h-5 text-brand-600 focus:ring-brand-500 cursor-pointer"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1.5 flex justify-center">
                                <input 
                                    type="radio" 
                                    name={`sq-${sub.id}`}
                                    checked={val === false}
                                    onChange={() => handleToggleTrueFalse(sub.id, false)}
                                    className="w-5 h-5 text-brand-600 focus:ring-brand-500 cursor-pointer"
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg md:static md:bg-transparent md:border-0 md:shadow-none md:p-0 md:mt-6 z-30">
          <div className="container mx-auto max-w-4xl flex justify-between items-center">
            <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(p => p - 1)}
                className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
                <ChevronLeft size={20} />
                <span className="hidden md:inline">Câu trước</span>
            </button>

            {/* Pagination Grid for Desktop */}
            <div className="hidden md:flex flex-wrap justify-center gap-1.5 max-w-md max-h-20 overflow-y-auto">
                {questions.map((q, idx) => {
                    const isAns = answers.has(q.id);
                    const isCurr = idx === currentIdx;
                    const isFlag = flagged.has(q.id);
                    let colorClass = "bg-white border-gray-300 text-gray-600 hover:bg-gray-100";
                    
                    if (isCurr) colorClass = "bg-brand-600 border-brand-600 text-white ring-2 ring-offset-1 ring-brand-300";
                    else if (isFlag) colorClass = "bg-yellow-100 border-yellow-400 text-yellow-700";
                    else if (isAns) colorClass = "bg-blue-50 border-blue-200 text-brand-700";

                    return (
                        <button
                            key={q.id}
                            onClick={() => setCurrentIdx(idx)}
                            className={`w-8 h-8 text-xs font-medium rounded border ${colorClass} transition-all`}
                        >
                            {idx + 1}
                        </button>
                    )
                })}
            </div>

             {/* Simple counter for Mobile */}
             <div className="md:hidden font-bold text-gray-600">
                {currentIdx + 1} / {questions.length}
             </div>

            <button
                onClick={() => {
                    if (isLast) {
                         if(window.confirm('Nộp bài ngay?')) handleSubmit();
                    } else {
                        setCurrentIdx(p => p + 1);
                    }
                }}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium text-white transition ${isLast ? 'bg-green-600 hover:bg-green-700' : 'bg-brand-600 hover:bg-brand-700'}`}
            >
                <span className="hidden md:inline">{isLast ? 'Hoàn thành' : 'Câu sau'}</span>
                {isLast ? <CheckCircle size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
      </div>
    </div>
  );
};