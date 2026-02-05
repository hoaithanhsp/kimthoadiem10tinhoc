import { GoogleGenAI } from "@google/genai";
import { Question, AIModelId } from "../types";
import { STORAGE_KEYS, FALLBACK_ORDER, DEFAULT_MODEL } from "../constants";

const getApiKey = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.API_KEY);
};

const getSelectedModel = (): AIModelId => {
  return (localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL) as AIModelId) || DEFAULT_MODEL;
};

const getAIClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key chưa được cấu hình. Vui lòng nhập API Key trong phần Cài đặt.");
  }
  return new GoogleGenAI({ apiKey });
};

// Fallback logic: thử model tiếp theo nếu gặp lỗi
const callWithFallback = async <T>(
  operation: (model: AIModelId) => Promise<T>,
  startModel?: AIModelId
): Promise<T> => {
  const selectedModel = startModel || getSelectedModel();
  const startIndex = FALLBACK_ORDER.indexOf(selectedModel as typeof FALLBACK_ORDER[number]);
  const modelsToTry = [
    ...FALLBACK_ORDER.slice(startIndex >= 0 ? startIndex : 0),
    ...FALLBACK_ORDER.slice(0, startIndex >= 0 ? startIndex : 0),
  ];

  let lastError: Error | null = null;

  for (const model of modelsToTry) {
    try {
      console.log(`[GeminiService] Đang thử với model: ${model}`);
      return await operation(model as AIModelId);
    } catch (error) {
      console.warn(`[GeminiService] Model ${model} gặp lỗi:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));

      // Nếu lỗi là về API key không hợp lệ, không thử model khác
      if (lastError.message.includes('API key') || lastError.message.includes('401') || lastError.message.includes('403')) {
        throw lastError;
      }
    }
  }

  throw lastError || new Error("Tất cả các model đều gặp lỗi");
};

export const explainQuestionWithAI = async (question: Question): Promise<string> => {
  return callWithFallback(async (model) => {
    const ai = getAIClient();

    let contentPrompt = `Tôi đang ôn thi THPTQG môn Tin học. Hãy giải thích chi tiết câu hỏi sau giúp tôi:\n\n`;
    contentPrompt += `Câu hỏi: ${question.question}\n`;

    if (question.type === 'multiple_choice' && question.options) {
      contentPrompt += `Các lựa chọn:\n${question.options.join('\n')}\n`;
      contentPrompt += `Đáp án đúng là: ${question.correctAnswer}\n`;
    } else if (question.type === 'true_false_group' && question.subQuestions) {
      contentPrompt += `Các phát biểu con:\n`;
      question.subQuestions.forEach(sq => {
        contentPrompt += `- ${sq.text} (${sq.isCorrect ? 'Đúng' : 'Sai'})\n`;
      });
    }

    contentPrompt += `\nHãy giải thích ngắn gọn, dễ hiểu tại sao đáp án lại như vậy và cung cấp thêm kiến thức liên quan nếu cần.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: contentPrompt,
    });

    return response.text || "Không thể tải giải thích từ AI.";
  });
};

export const generateStudyPlan = async (weakTopics: string[]): Promise<string> => {
  return callWithFallback(async (model) => {
    const ai = getAIClient();
    const prompt = `Tôi là học sinh lớp 12 đang ôn thi Tin học. Dựa trên kết quả thi thử, tôi đang yếu các phần sau: ${weakTopics.join(', ')}.
    Hãy gợi ý cho tôi một lộ trình ôn tập ngắn gọn trong 1 tuần để cải thiện các phần này.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Không thể tạo lộ trình.";
  });
};

// Kiểm tra API key có hợp lệ không
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: "Hi",
    });
    return true;
  } catch {
    return false;
  }
};

// Kiểm tra xem đã có API key chưa
export const hasApiKey = (): boolean => {
  const key = getApiKey();
  return !!key && key.trim().length > 0;
};