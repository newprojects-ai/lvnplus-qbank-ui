// Standard API client for QBank UI
// Uses fetch and typed endpoints matching backend API
import {
  PromptTemplate,
  Subject,
  Topic,
  Subtopic,
  DifficultyLevel,
  VariableCategory,
  VariableDefinition,
  TemplateVariable,
  GenerateQuestionsRequest,
  GeneratedQuestion,
  DashboardStats,
  ExportQuestionsRequest,
  AIConfig,
  AIProvider,
  AIModel,
  Task,
  Template,
} from './types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const apiClient = {
  // Prompt Templates
  getPromptTemplates: (): Promise<PromptTemplate[]> => fetchJson(`${API_BASE}/prompt-templates`),
  getPromptTemplate: (id: string): Promise<PromptTemplate> => fetchJson(`${API_BASE}/prompt-templates/${id}`),
  createPromptTemplate: (data: PromptTemplate): Promise<PromptTemplate> => fetchJson(`${API_BASE}/prompt-templates`, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
  updatePromptTemplate: (id: string, data: PromptTemplate): Promise<PromptTemplate> => fetchJson(`${API_BASE}/prompt-templates/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
  deletePromptTemplate: (id: string): Promise<void> => fetchJson(`${API_BASE}/prompt-templates/${id}`, { method: 'DELETE' }),

  // Master Data
  getSubjects: (): Promise<Subject[]> => fetchJson(`${API_BASE}/master-data/subjects`),
  getTopics: (subjectId: number): Promise<Topic[]> => fetchJson(`${API_BASE}/master-data/topics/${subjectId}`),
  getSubtopics: (topicId: number): Promise<Subtopic[]> => fetchJson(`${API_BASE}/master-data/subtopics/${topicId}`),
  getDifficultyLevels: (): Promise<DifficultyLevel[]> => fetchJson(`${API_BASE}/master-data/difficulty-levels`),

  // Variable Categories & Definitions
  getVariableCategories: (): Promise<VariableCategory[]> => fetchJson(`${API_BASE}/variable-categories`),
  createVariableCategory: (data: VariableCategory): Promise<VariableCategory> => fetchJson(`${API_BASE}/variable-categories`, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
  updateVariableCategory: (id: string, data: VariableCategory): Promise<VariableCategory> => fetchJson(`${API_BASE}/variable-categories/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
  deleteVariableCategory: (id: string): Promise<void> => fetchJson(`${API_BASE}/variable-categories/${id}`, { method: 'DELETE' }),

  getVariableDefinitions: (categoryId: string): Promise<VariableDefinition[]> => fetchJson(`${API_BASE}/variable-definitions/${categoryId}`),
  createVariableDefinition: (data: VariableDefinition): Promise<VariableDefinition> => fetchJson(`${API_BASE}/variable-definitions`, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
  updateVariableDefinition: (id: string, data: VariableDefinition): Promise<VariableDefinition> => fetchJson(`${API_BASE}/variable-definitions/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
  deleteVariableDefinition: (id: string): Promise<void> => fetchJson(`${API_BASE}/variable-definitions/${id}`, { method: 'DELETE' }),

  // Template Variables
  getTemplateVariables: (templateId: string): Promise<TemplateVariable[]> => fetchJson(`${API_BASE}/template-variables/${templateId}`),
  updateTemplateVariables: (templateId: string, data: TemplateVariable[]): Promise<TemplateVariable[]> => fetchJson(`${API_BASE}/template-variables/${templateId}`, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),

  // Questions
  generateQuestions: (data: GenerateQuestionsRequest): Promise<GeneratedQuestion[]> => fetchJson(`${API_BASE}/generate`, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
  approveQuestion: (id: string): Promise<void> => fetchJson(`${API_BASE}/questions/${id}/approve`, { method: 'POST' }),
  updateQuestion: (id: string, data: GeneratedQuestion): Promise<GeneratedQuestion> => fetchJson(`${API_BASE}/questions/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
  deleteQuestion: (id: string): Promise<void> => fetchJson(`${API_BASE}/questions/${id}`, { method: 'DELETE' }),

  // Dashboard
  getDashboardStats: (): Promise<DashboardStats> => fetchJson(`${API_BASE}/dashboard/stats`),
  // Recent Batches (added for dashboard)
  getRecentBatches: (): Promise<any[]> => fetchJson(`${API_BASE}/batches?limit=5`),

  // Export
  exportQuestions: (data: ExportQuestionsRequest): Promise<{ fileUrl: string }> => fetchJson(`${API_BASE}/export`, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),

  // Settings - AI Configurations
  getAIConfigs: (): Promise<AIConfig[]> => fetchJson(`${API_BASE}/ai/config`),
  createAIConfig: (data: AIConfig): Promise<AIConfig> => fetchJson(`${API_BASE}/ai/config`, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
  updateAIConfig: (id: string, data: AIConfig): Promise<AIConfig> => fetchJson(`${API_BASE}/ai/config/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
  deleteAIConfig: (id: string): Promise<void> => fetchJson(`${API_BASE}/ai/config/${id}`, { method: 'DELETE' }),
  testAIConfig: (id: string): Promise<{ success: boolean; message: string }> => fetchJson(`${API_BASE}/ai/config/${id}/test`, { method: 'POST' }),

  // Settings - AI Providers
  getAIProviders: (): Promise<AIProvider[]> => fetchJson(`${API_BASE}/settings/providers`),
  createAIProvider: (data: AIProvider): Promise<AIProvider> => fetchJson(`${API_BASE}/settings/providers`, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
  updateAIProvider: (id: string, data: AIProvider): Promise<AIProvider> => fetchJson(`${API_BASE}/settings/providers/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),

  // Settings - AI Models
  getAIModels: (): Promise<AIModel[]> => fetchJson(`${API_BASE}/settings/models`),
  createAIModel: (data: AIModel): Promise<AIModel> => fetchJson(`${API_BASE}/settings/models`, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
  updateAIModel: (id: string, data: AIModel): Promise<AIModel> => fetchJson(`${API_BASE}/settings/models/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),

  // Tasks
  getTasks: (): Promise<Task[]> => fetchJson(`${API_BASE}/tasks`),
  getTask: (id: string): Promise<Task> => fetchJson(`${API_BASE}/tasks/${id}`),
  createTask: (data: Task): Promise<Task> => fetchJson(`${API_BASE}/tasks`, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
  deleteTask: (id: string): Promise<void> => fetchJson(`${API_BASE}/tasks/${id}`, { method: 'DELETE' }),

  // --- Template & Master Data API ---
  getTemplates: async (): Promise<Template[]> => fetchJson(`${API_BASE}/templates`),
  createOrUpdateTemplate: async (data: Partial<Template>, method: 'POST' | 'PUT'): Promise<Response> =>
    fetch(`${API_BASE}/templates${method === 'PUT' && data.id ? `/${data.id}` : ''}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  deleteTemplate: async (id: string): Promise<Response> =>
    fetch(`${API_BASE}/templates/${id}`, { method: 'DELETE' }),
};
