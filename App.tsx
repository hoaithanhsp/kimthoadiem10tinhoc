import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { TopicCard } from './components/TopicCard';
import { Quiz } from './components/Quiz';
import { ResultView } from './components/ResultView';
import { Stats } from './components/Stats';
import { LoginScreen } from './components/LoginScreen';
import { AuthorSection } from './components/AuthorSection';
import { Topic, Question, UserAnswer, ExamResult } from './types';
import { SAMPLE_QUESTIONS, getRandomExam } from './constants';
import { saveExamResult } from './services/storageService';

const HomePage: React.FC<{ onStartQuiz: (t: Topic | null) => void }> = ({ onStartQuiz }) => {
  const topics = Object.values(Topic);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-brand-600 to-blue-500 rounded-2xl p-8 md:p-12 text-white shadow-lg text-center md:text-left relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Luyện Thi THPTQG <br /> Môn Tin Học
          </h1>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Ngân hàng câu hỏi trắc nghiệm bám sát cấu trúc đề minh họa mới nhất.
            Hệ thống chấm điểm tự động và giải thích chi tiết bằng AI.
          </p>
          <button
            onClick={() => onStartQuiz(null)} // Mixed quiz
            className="bg-white text-brand-600 font-bold py-3 px-8 rounded-full shadow hover:bg-gray-100 hover:scale-105 transition transform"
          >
            Thi thử tổng hợp
          </button>
        </div>
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Author Section */}
      <AuthorSection />

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 border-l-4 border-brand-500 pl-3">Chủ đề ôn tập</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((t) => (
            <TopicCard
              key={t}
              topic={t}
              questionCount={SAMPLE_QUESTIONS.filter(q => q.topic === t).length + 20}
              onStart={() => onStartQuiz(t)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const QuizContainer: React.FC = () => {
  const navigate = useNavigate();
  const [activeQuiz, setActiveQuiz] = useState<Question[] | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);

  const startQuiz = (topic: Topic | null) => {
    // Generate questions. If topic is null, mix them.
    let questions = getRandomExam(20); // 20 questions for demo
    if (topic) {
      // In real app, filter properly. Here we simulate preference or mix if not enough.
      const topicQs = SAMPLE_QUESTIONS.filter(q => q.topic === topic);
      if (topicQs.length > 0) {
        questions = getRandomExam(10).map((q, i) => i < topicQs.length ? topicQs[i] : q);
      }
    }
    setActiveQuiz(questions);
    setResult(null);
  };

  const handleFinish = (answers: UserAnswer[], timeSpent: number) => {
    if (!activeQuiz) return;

    let correctCount = 0;

    // Calculate Score Logic (Simplified for Demo)
    // In real exam: each sub-question in TF group counts 0.25 points. MC counts 0.25.
    // Let's normalize to scale 10.

    let totalPointsPossible = 0;
    let earnedPoints = 0;

    activeQuiz.forEach(q => {
      const userAns = answers.find(a => a.questionId === q.id);

      if (q.type === 'multiple_choice') {
        totalPointsPossible += 1;
        if (userAns && userAns.answer === q.correctAnswer) {
          earnedPoints += 1;
          correctCount++; // Treat whole question as 1 unit for simple count
        }
      } else if (q.type === 'true_false_group' && q.subQuestions) {
        // Each sub question is 0.25 weight relative to a full MC question in this simple logic
        // Or we treat the group as 1 point total, each sub is 0.25
        totalPointsPossible += 1;
        let subCorrect = 0;
        const ansObj = (userAns?.answer as Record<string, boolean>) || {};

        q.subQuestions.forEach(sq => {
          if (ansObj[sq.id] === sq.isCorrect) subCorrect++;
        });

        earnedPoints += (subCorrect / 4);
        if (subCorrect === 4) correctCount++;
      }
    });

    const finalScore = (earnedPoints / totalPointsPossible) * 10;

    const newResult: ExamResult = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      score: finalScore,
      totalQuestions: activeQuiz.length,
      correctCount: correctCount, // Approximate "full correct" questions
      timeSpentSeconds: timeSpent,
      answers: answers,
      questions: activeQuiz
    };

    saveExamResult(newResult);
    setResult(newResult);
    setActiveQuiz(null);
  };

  if (result) {
    return <ResultView result={result} onRetry={() => setResult(null)} />;
  }

  if (activeQuiz) {
    return <Quiz questions={activeQuiz} onSubmit={handleFinish} onCancel={() => setActiveQuiz(null)} />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage onStartQuiz={startQuiz} />} />
      <Route path="/practice" element={<HomePage onStartQuiz={startQuiz} />} />
      <Route path="/stats" element={<Stats />} />
    </Routes>
  );
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập từ localStorage
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Hiển thị màn hình đăng nhập nếu chưa đăng nhập
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <Layout>
        <QuizContainer />
      </Layout>
    </HashRouter>
  );
};

export default App;