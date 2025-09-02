export const OPENNOTE_BASE_URL = "https://api.opennote.com";

export type ModelChoices = "picasso";
export type VideoStatusChoices = "pending" | "completed" | "failed" | "status_error";
export type MessageRoleChoices = "user" | "assistant";

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

export interface VideoAPIRequestMessage {
  role: MessageRoleChoices;
  content: string;
}

export interface VideoCreateJobRequest {
  model?: ModelChoices;
  messages?: VideoAPIRequestMessage[];
  include_sources?: boolean;
  search_for?: string;
  source_count?: number;
  length?: number;
  script?: string;
  upload_to_s3?: boolean;
  title?: string;
  webhook_url?: string;
}

export interface VideoCreateJobResponse {
  success: boolean;
  message?: string;
  video_id?: string;
}

export interface VideoSource {
  url: string;
  content: string;
}

export interface VideoResponse {
  success: boolean;
  error?: string;
  s3_url?: string;
  b64_video?: string;
  title?: string;
  transcript?: string;
  sources?: VideoSource[];
  cost?: number;
  model?: ModelChoices;
  timestamp?: string;
}

export interface VideoJobStatusResponse {
  success: boolean;
  message?: string;
  completion_percentage?: number;
  video_id?: string;
  status: VideoStatusChoices;
  response?: VideoResponse;
  error?: string;
}

export interface ApiResponseJournal {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface JournalsResponse {
  success: boolean;
  message?: string;
  journals?: ApiResponseJournal[];
  next_page_token?: number;
}

export interface JournalContentResponse {
  success: boolean;
  message?: string;
  title?: string;
  journal_id?: string;
  content?: string;
  timestamp: string;
}