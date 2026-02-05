import { ExamResult } from '../types';

const STORAGE_KEY = 'DIEM10TIN_HISTORY';

export const saveExamResult = (result: ExamResult): void => {
  try {
    const existing = getExamHistory();
    const updated = [result, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save result', error);
  }
};

export const getExamHistory = (): ExamResult[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Failed to load history', error);
    return [];
  }
};

export const clearHistory = (): void => {
    localStorage.removeItem(STORAGE_KEY);
}