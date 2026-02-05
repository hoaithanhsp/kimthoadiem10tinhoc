import React, { useState } from 'react';
import { ExamResult, Question, UserAnswer } from '../types';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Home, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { explainQuestionWithAI } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface ResultViewProps {
  result: ExamResult;
  onRetry: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onRetry }) => {
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});

  const handleAskAI = async (q: Question) => {
    setAiLoading(q.id);
    const text = await explainQuestionWithAI(q);
    setAiExplanations(prev => ({ ...prev, [q.id]: text }));
    setAiLoading(null);
  };

  const getScoreColor = (s: number) => {
    if (s >= 8) return 'text-green-600';
    if (s >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderReviewItem = (q: Question, idx: number) => {
    const userAnsObj = result.answers.find(a => a.questionId === q.id);
    let isCorrect = false;

    // Logic to determine correctness for review display
    if (q.type === 'multiple_choice') {
        const val = userAnsObj?.answer as string;
        isCorrect = val === q.correctAnswer;
    } else if (q.type === 'true_false_group' && q.subQuestions) {
        // For display purposes, we mark "correct" if ALL sub-questions are correct, 
        // or we just show detailed breakdown. Let's just calculate logic here.
        const val = userAnsObj?.answer as Record<string, boolean> || {};
        isCorrect = q.subQuestions.every(sq => val[sq.id] === sq.isCorrect);
    }

    return (
      <div key={q.id} className={`bg-white rounded-lg border shadow-sm overflow-hidden mb-6 ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
        <div className={`px-4 py-3 flex justify-between items-center ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
           <span className={`font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
              Câu {idx + 1}: {isCorrect ? 'Đúng' : 'Sai'}
           </span>
           <span className="text-xs text-gray-500 px-2 py-1 bg-white rounded border border-gray-200">{q.topic}</span>
        </div>
        
        <div className="p-4 md:p-6">
           <p className="font-medium text-gray-800 mb-4">{q.question}</p>

           {/* MC Review */}
           {q.type === 'multiple_choice' && q.options && (
             <div className="space-y-2 mb-4">
               {q.options.map(opt => {
                 const letter = opt.charAt(0);
                 const userSelected = (userAnsObj?.answer as string) === letter;
                 const isKey = letter === q.correctAnswer;
                 
                 let bg = "bg-gray-50 border-transparent";
                 if (isKey) bg = "bg-green-100 border-green-500 text-green-800";
                 else if (userSelected && !isKey) bg = "bg-red-100 border-red-500 text-red-800";

                 return (
                   <div key={opt} className={`p-3 rounded border ${bg} flex justify-between`}>
                     <span>{opt}</span>
                     {isKey && <CheckCircle size={18} className="text-green-600 shrink-0" />}
                     {userSelected && !isKey && <XCircle size={18} className="text-red-600 shrink-0" />}
                   </div>
                 )
               })}
             </div>
           )}

           {/* TF Review */}
           {q.type === 'true_false_group' && q.subQuestions && (
             <div className="bg-gray-50 rounded border border-gray-200 mb-4">
                 {q.subQuestions.map(sq => {
                    const userVal = (userAnsObj?.answer as Record<string, boolean>)?.[sq.id];
                    const correctVal = sq.isCorrect;
                    const subCorrect = userVal === correctVal;

                    return (
                       <div key={sq.id} className="p-3 border-b last:border-0 border-gray-100 grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-8 text-sm">{sq.text}</div>
                          <div className="col-span-4 text-xs flex flex-col items-end space-y-1">
                             <span className={subCorrect ? 'text-green-600 flex items-center' : 'text-red-600 flex items-center'}>
                                Bạn chọn: {userVal === true ? 'Đúng' : userVal === false ? 'Sai' : 'Trống'}
                                {subCorrect ? <CheckCircle size={12} className="ml-1"/> : <XCircle size={12} className="ml-1"/>}
                             </span>
                             <span className="text-gray-500 font-semibold">Đáp án: {correctVal ? 'Đúng' : 'Sai'}</span>
                          </div>
                       </div>
                    )
                 })}
             </div>
           )}

           <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4">
              <strong>Giải thích: </strong> {q.explanation}
           </div>

           {/* AI Help Section */}
           {aiExplanations[q.id] ? (
             <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg mt-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-2 text-purple-700 font-bold">
                  <Bot size={18} /> <span>Gia sư AI giải thích:</span>
                </div>
                <div className="text-sm text-gray-800 prose prose-sm max-w-none">
                   <ReactMarkdown>{aiExplanations[q.id]}</ReactMarkdown>
                </div>
             </div>
           ) : (
             <button 
               onClick={() => handleAskAI(q)}
               disabled={aiLoading === q.id}
               className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium transition disabled:opacity-50"
             >
               <Bot size={16} />
               {aiLoading === q.id ? 'Đang hỏi AI...' : 'Chưa hiểu? Hỏi AI chi tiết'}
             </button>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Kết quả bài thi</h2>
        <div className={`text-6xl font-extrabold my-4 ${getScoreColor(result.score)}`}>
          {result.score.toFixed(1)}
        </div>
        <p className="text-gray-500 mb-6">
          Đúng {result.correctCount}/{result.totalQuestions} câu hỏi
        </p>
        
        <div className="flex justify-center gap-4">
           <button onClick={onRetry} className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2.5 rounded-lg hover:bg-brand-700 transition">
             <RefreshCw size={20} /> Làm lại
           </button>
           <Link to="/" className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition">
             <Home size={20} /> Trang chủ
           </Link>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-6 px-2">Chi tiết bài làm</h3>
      <div>
        {result.questions.map((q, idx) => renderReviewItem(q, idx))}
      </div>
    </div>
  );
};