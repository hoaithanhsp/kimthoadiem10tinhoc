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

// ============= EXAM PRACTICE TYPES (Luyện đề) =============

// Câu trắc nghiệm nhiều lựa chọn (Phần I)
export interface ExamMultipleChoice {
  questionNumber: number; // 1-24
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

// Một ý trong câu Đúng/Sai
export interface ExamTrueFalseOption {
  id: 'a' | 'b' | 'c' | 'd';
  text: string;
  isCorrect: boolean;
}

// Câu Đúng/Sai (Phần II và III)
export interface ExamTrueFalseQuestion {
  questionNumber: number; // 1-6
  mainText: string;
  options: ExamTrueFalseOption[];
}

// Cấu trúc đề thi hoàn chỉnh
export interface ExamStructure {
  id: string;
  name: string;
  part1: ExamMultipleChoice[]; // 24 câu
  part2: ExamTrueFalseQuestion[]; // 2 câu (Câu 1, 2)
  part3Option1: ExamTrueFalseQuestion[]; // 2 câu (Câu 3, 4)
  part3Option2: ExamTrueFalseQuestion[]; // 2 câu (Câu 5, 6)
}

// Đáp án của học sinh
export interface ExamUserAnswers {
  part1: Record<number, 'A' | 'B' | 'C' | 'D'>; // {1: 'A', 2: 'B', ...}
  part2: Record<number, Record<'a' | 'b' | 'c' | 'd', boolean | null>>; // {1: {a: true, b: false, ...}}
  part3Choice: 'option1' | 'option2' | null; // Chọn cặp 3,4 hoặc 5,6
  part3: Record<number, Record<'a' | 'b' | 'c' | 'd', boolean | null>>;
}

// Kết quả chấm điểm
export interface ExamPracticeResult {
  part1Score: number; // max 6.0
  part1Correct: number; // số câu đúng
  part2Score: number; // max 2.0
  part2Details: { questionNumber: number; correctCount: number; score: number }[];
  part3Score: number; // max 2.0
  part3Details: { questionNumber: number; correctCount: number; score: number }[];
  totalScore: number; // max 10.0
}

// Hàm tính điểm cho câu Đúng/Sai
export function calculateTrueFalseScore(correctCount: number): number {
  switch (correctCount) {
    case 1: return 0.1;
    case 2: return 0.25;
    case 3: return 0.5;
    case 4: return 1.0;
    default: return 0;
  }
}