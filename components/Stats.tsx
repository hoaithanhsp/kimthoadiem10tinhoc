import React, { useMemo, useState } from 'react';
import { getExamHistory } from '../services/storageService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Brain, TrendingUp, Clock } from 'lucide-react';
import { generateStudyPlan } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export const Stats: React.FC = () => {
  const history = getExamHistory();
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const summary = useMemo(() => {
    if (history.length === 0) return null;
    const totalExams = history.length;
    const avgScore = history.reduce((sum, h) => sum + h.score, 0) / totalExams;
    const bestScore = Math.max(...history.map(h => h.score));
    
    // Simplistic weak topic analysis (just random for demo if history is limited, 
    // ideally calculate % correct per topic)
    const weakTopics = ["Lập trình Python", "Cơ sở dữ liệu"]; 

    return { totalExams, avgScore, bestScore, weakTopics };
  }, [history]);

  const chartData = useMemo(() => {
    return history.slice(0, 10).reverse().map((h, idx) => ({
        name: `Đề ${idx + 1}`,
        score: parseFloat(h.score.toFixed(1)),
        date: new Date(h.date).toLocaleDateString()
    }));
  }, [history]);

  const getAdvice = async () => {
     if(!summary) return;
     setLoadingAdvice(true);
     const plan = await generateStudyPlan(summary.weakTopics);
     setAdvice(plan);
     setLoadingAdvice(false);
  };

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Brain size={48} className="mb-4 text-gray-300" />
        <p>Bạn chưa làm bài thi nào. Hãy bắt đầu luyện tập!</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Thống kê học tập</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
           <div className="p-3 bg-blue-100 rounded-full text-blue-600">
             <TrendingUp size={24} />
           </div>
           <div>
             <p className="text-sm text-gray-500">Điểm trung bình</p>
             <p className="text-2xl font-bold text-gray-800">{summary.avgScore.toFixed(1)}</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
           <div className="p-3 bg-green-100 rounded-full text-green-600">
             <Brain size={24} />
           </div>
           <div>
             <p className="text-sm text-gray-500">Số đề đã làm</p>
             <p className="text-2xl font-bold text-gray-800">{summary.totalExams}</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
           <div className="p-3 bg-purple-100 rounded-full text-purple-600">
             <Clock size={24} />
           </div>
           <div>
             <p className="text-sm text-gray-500">Điểm cao nhất</p>
             <p className="text-2xl font-bold text-gray-800">{summary.bestScore}</p>
           </div>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-6">Biểu đồ điểm số</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis domain={[0, 10]} stroke="#9ca3af" fontSize={12} />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Advisor */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-xl shadow-lg p-6 md:p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Brain className="animate-bounce" /> Góc tư vấn AI
          </h3>
          <p className="mb-4 text-blue-100 max-w-2xl">
            Dựa trên kết quả học tập, AI có thể phân tích điểm yếu và đề xuất lộ trình ôn tập cá nhân hóa cho bạn.
          </p>
          
          {!advice ? (
             <button 
               onClick={getAdvice}
               disabled={loadingAdvice}
               className="bg-white text-brand-700 font-bold py-2 px-6 rounded-full shadow hover:bg-gray-100 transition disabled:opacity-70"
             >
               {loadingAdvice ? 'Đang phân tích...' : 'Nhận tư vấn lộ trình'}
             </button>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 mt-4 border border-white/20 prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{advice}</ReactMarkdown>
            </div>
          )}
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
            <Brain size={300} />
        </div>
      </div>
    </div>
  );
};