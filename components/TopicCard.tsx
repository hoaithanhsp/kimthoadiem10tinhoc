import React from 'react';
import { ArrowRight, Brain, Globe, Database, FileSpreadsheet, Code } from 'lucide-react';
import { Topic } from '../types';

interface TopicCardProps {
  topic: Topic;
  questionCount: number;
  onStart: () => void;
}

const getIconForTopic = (topic: Topic) => {
  switch (topic) {
    case Topic.AI: return <Brain className="text-purple-500" size={32} />;
    case Topic.NETWORK: return <Globe className="text-blue-500" size={32} />;
    case Topic.DB: return <Database className="text-orange-500" size={32} />;
    case Topic.OFFICE: return <FileSpreadsheet className="text-green-500" size={32} />;
    case Topic.CS: return <Code className="text-yellow-500" size={32} />;
    default: return <Brain size={32} />;
  }
};

export const TopicCard: React.FC<TopicCardProps> = ({ topic, questionCount, onStart }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            {getIconForTopic(topic)}
          </div>
          <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            ~{questionCount} câu
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{topic}</h3>
        <p className="text-gray-500 text-sm">
          Luyện tập các dạng câu hỏi trọng tâm về {topic}.
        </p>
      </div>
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <button
          onClick={onStart}
          className="w-full flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          <span>Luyện tập ngay</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};