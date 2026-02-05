import { Question, Topic } from './types';

// AI Model Configuration
export const AI_MODELS = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash Preview', description: 'Nhanh, phù hợp tác vụ đơn giản' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro Preview', description: 'Cân bằng tốc độ và chất lượng' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Ổn định, tin cậy' },
] as const;

export const DEFAULT_MODEL = 'gemini-3-pro-preview';
export const FALLBACK_ORDER = ['gemini-3-flash-preview', 'gemini-3-pro-preview', 'gemini-2.5-flash'] as const;

export const STORAGE_KEYS = {
  API_KEY: 'gemini_api_key',
  SELECTED_MODEL: 'selected_ai_model',
} as const;

export const API_KEY_GUIDE_URL = 'https://aistudio.google.com/api-keys';


export const SAMPLE_QUESTIONS: Question[] = [
  // --- AI ---
  {
    id: 'ai-1',
    type: 'multiple_choice',
    topic: Topic.AI,
    question: 'Trí tuệ nhân tạo (AI) là gì?',
    options: [
      'A. Một loại robot có hình dạng giống con người.',
      'B. Khả năng của máy tính có thể thực hiện các nhiệm vụ mang tính trí tuệ của con người.',
      'C. Một phần mềm diệt virus thông minh.',
      'D. Một hệ thống mạng máy tính toàn cầu.'
    ],
    correctAnswer: 'B',
    explanation: 'AI (Artificial Intelligence) là lĩnh vực khoa học máy tính chuyên nghiên cứu phương pháp để máy tính có thể thực hiện những công việc đòi hỏi trí tuệ của con người.'
  },
  {
    id: 'ai-2',
    type: 'true_false_group',
    topic: Topic.AI,
    question: 'Phát biểu nào sau đây về Học máy (Machine Learning) là đúng hay sai?',
    subQuestions: [
      { id: 'sq-1', text: 'Học máy là một nhánh của AI.', isCorrect: true },
      { id: 'sq-2', text: 'Học máy yêu cầu con người phải lập trình chi tiết từng bước giải quyết vấn đề.', isCorrect: false },
      { id: 'sq-3', text: 'Dữ liệu đóng vai trò quan trọng trong việc huấn luyện các mô hình học máy.', isCorrect: true },
      { id: 'sq-4', text: 'Deep Learning (Học sâu) không liên quan gì đến Machine Learning.', isCorrect: false }
    ],
    explanation: 'Machine Learning là tập con của AI, sử dụng dữ liệu để huấn luyện mô hình thay vì lập trình cứng. Deep Learning là một kỹ thuật chuyên sâu của Machine Learning.'
  },
  
  // --- MẠNG MÁY TÍNH ---
  {
    id: 'net-1',
    type: 'multiple_choice',
    topic: Topic.NETWORK,
    question: 'Giao thức nào được sử dụng để truyền tải các trang web bảo mật?',
    options: ['A. FTP', 'B. HTTP', 'C. HTTPS', 'D. SMTP'],
    correctAnswer: 'C',
    explanation: 'HTTPS (Hyper Text Transfer Protocol Secure) là phiên bản bảo mật của HTTP, sử dụng mã hóa SSL/TLS để bảo vệ dữ liệu truyền tải.'
  },
  {
    id: 'net-2',
    type: 'true_false_group',
    topic: Topic.NETWORK,
    question: 'Xét các thiết bị mạng sau, phát biểu nào đúng/sai?',
    subQuestions: [
      { id: 'net-sq-1', text: 'Router dùng để kết nối các mạng LAN với nhau hoặc kết nối LAN với Internet.', isCorrect: true },
      { id: 'net-sq-2', text: 'Switch chỉ có khả năng phát tín hiệu wifi.', isCorrect: false },
      { id: 'net-sq-3', text: 'Modem dùng để chuyển đổi tín hiệu số sang tương tự và ngược lại.', isCorrect: true },
      { id: 'net-sq-4', text: 'Địa chỉ IP là địa chỉ vật lý cố định của thiết bị mạng.', isCorrect: false }
    ],
    explanation: 'Switch kết nối các thiết bị trong cùng một mạng LAN. Địa chỉ IP là địa chỉ logic, địa chỉ MAC mới là địa chỉ vật lý.'
  },

  // --- PYTHON ---
  {
    id: 'py-1',
    type: 'multiple_choice',
    topic: Topic.CS,
    question: 'Kết quả của đoạn code Python sau là gì: `print(10 // 3)`?',
    options: ['A. 3.33', 'B. 3', 'C. 4', 'D. 1'],
    correctAnswer: 'B',
    explanation: 'Toán tử `//` trong Python thực hiện phép chia lấy phần nguyên. 10 chia 3 được 3 dư 1, nên kết quả là 3.'
  },
  {
    id: 'py-2',
    type: 'multiple_choice',
    topic: Topic.CS,
    question: 'Kiểu dữ liệu nào dùng để lưu trữ danh sách các phần tử có thứ tự và có thể thay đổi trong Python?',
    options: ['A. Tuple', 'B. Set', 'C. List', 'D. Dictionary'],
    correctAnswer: 'C',
    explanation: 'List là danh sách có thứ tự và có thể thay đổi (mutable). Tuple không thể thay đổi. Set không có thứ tự. Dictionary lưu cặp key-value.'
  },

  // --- OFFICE ---
  {
    id: 'off-1',
    type: 'multiple_choice',
    topic: Topic.OFFICE,
    question: 'Trong Excel, hàm nào dùng để tìm kiếm giá trị trong cột đầu tiên của bảng và trả về giá trị trong cùng hàng?',
    options: ['A. HLOOKUP', 'B. SEARCH', 'C. FIND', 'D. VLOOKUP'],
    correctAnswer: 'D',
    explanation: 'VLOOKUP (Vertical Lookup) dùng để tìm kiếm theo chiều dọc (cột).'
  },
  
  // --- DB ---
  {
    id: 'db-1',
    type: 'true_false_group',
    topic: Topic.DB,
    question: 'Về Khóa chính (Primary Key) trong CSDL quan hệ:',
    subQuestions: [
      { id: 'db-sq-1', text: 'Khóa chính dùng để xác định duy nhất mỗi hàng trong bảng.', isCorrect: true },
      { id: 'db-sq-2', text: 'Một bảng có thể có nhiều khóa chính.', isCorrect: false },
      { id: 'db-sq-3', text: 'Giá trị của khóa chính có thể để trống (NULL).', isCorrect: false },
      { id: 'db-sq-4', text: 'Khóa chính có thể bao gồm nhiều trường (thuộc tính).', isCorrect: true }
    ],
    explanation: 'Mỗi bảng chỉ có 1 khóa chính (dù có thể gồm nhiều trường). Khóa chính không được phép NULL và phải là duy nhất.'
  }
];

// Helper to get random questions
export const getRandomExam = (count: number = 20): Question[] => {
  const shuffled = [...SAMPLE_QUESTIONS].sort(() => 0.5 - Math.random());
  // In a real app, we would fetch more content or duplicate logic to fill 40
  // For this demo, we assume SAMPLE_QUESTIONS has enough or we loop them
  while (shuffled.length < count) {
      shuffled.push(...SAMPLE_QUESTIONS);
  }
  return shuffled.slice(0, count).map((q, idx) => ({...q, id: `${q.id}-${idx}`}));
};