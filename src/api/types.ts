// Auto-generated types matching your backend OpenAPI/Swagger schemas

export interface PromptTemplate {
  id: string;
  name: string;
  description?: string;
}

export interface Subject {
  subject_id: number;
  name: string;
}

export interface Topic {
  topic_id: number;
  name: string;
  subject_id: number;
}

export interface Subtopic {
  subtopic_id: number;
  name: string;
  topic_id: number;
}

export interface DifficultyLevel {
  level_id: number;
  name: string;
  subject_id: number;
}

export interface VariableCategory {
  id: string;
  name: string;
}

export interface VariableDefinition {
  id: string;
  name: string;
  categoryId: string;
}

export interface TemplateVariable {
  id: string;
  name: string;
  templateId: string;
}

export interface GenerateQuestionsRequest {
  templateId: string;
  count: number;
}

export interface GeneratedQuestion {
  id: string;
  question: string;
}

export interface DashboardStats {
  totalQuestions: number;
}

export interface ExportQuestionsRequest {
  templateId: string;
}

export interface AIConfig {
  id: string;
  provider: string;
  apiKey: string;
}

export interface AIProvider {
  id: string;
  name: string;
}

export interface AIModel {
  id: string;
  name: string;
  providerId: string;
}

export interface Task {
  id: string;
  status: string;
}

// --- Added for Template & Master Data API ---
export interface Template {
  id: string;
  name: string;
  description?: string;
  subject_id?: number;
  topic_id?: number;
  subtopic_id?: number;
  difficulty_level?: number;
  level_id?: number;
  question_format: string;
  options_format: string | string[];
  solution_format: string;
  example_question?: string;
  variables?: string;
  created_at?: string;
  created_by?: string;
}

export interface Subject {
  id: number;
  subject_name: string;
}

export interface Topic {
  id: number;
  topic_name: string;
  subject_id: number;
}

export interface Subtopic {
  id: number;
  subtopic_name: string;
  topic_id: number;
}

export interface DifficultyLevel {
  level_id: number;
  level_name: string;
  level_value: number;
  purpose: string;
  characteristics: string;
  focus_area: string;
}

// Optionally add types for form data if needed
// export interface TemplateFormData { ... }
