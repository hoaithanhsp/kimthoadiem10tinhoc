export type AIModelId = 'gemini-3-flash-preview' | 'gemini-3-pro-preview' | 'gemini-2.5-flash';

export type QuestionType = 'multiple_choice' | 'true_false_group';

export enum Topic {
  AI = 'Trí tuệ nhân tạo (AI)',
  NETWORK = 'Mạng máy tính & Internet',
  CS = 'Khoa học máy tính (Python)',
  OFFICE = 'Tin học ứng dụng (Office)',
  DB = 'Cơ sở dữ liệu'
}

export interface SubQuestion {
  id: string;
  text: string;
  isCorrect: boolean; // The correct answer (True or False)
}

export interface Question {
  id: string;
  type: QuestionType;
  topic: Topic;
  question: string;
  // For Multiple Choice
  options?: string[]; // [A, B, C, D]
  correctAnswer?: string; // "A", "B", "C", or "D"
  // For True/False Group
  subQuestions?: SubQuestion[];
  explanation: string;
}

export interface UserAnswer {
  questionId: string;
  // For MC: "A", "B"...
  // For TF: { subId: boolean }
  answer: string | Record<string, boolean>;
}

export interface ExamResult {
  id: string;
  date: string; // ISO string
  score: number; // 0-10
  totalQuestions: number;
  correctCount: number;
  timeSpentSeconds: number;
  answers: UserAnswer[];
  questions: Question[]; // Snapshot of questions taken
}

export interface StatSummary {
  totalExams: number;
  averageScore: number;
  bestScore: number;
  totalTimeSeconds: number;
}