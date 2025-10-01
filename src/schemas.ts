import {
  VideoAPIRequestMessage,
  ModelChoices,
  EditOperation,
  PracticeProblem
} from './api_types';

// Video API Schemas
export interface VideoCreateParams {
  messages?: VideoAPIRequestMessage[];
  model?: ModelChoices;
  include_sources?: boolean;
  search_for?: string;
  source_count?: number;
  length?: number;
  script?: string;
  upload_to_s3?: boolean;
  title?: string;
  webhook_url?: string;
  extra_headers?: Record<string, string>;
  extra_body?: Record<string, any>;
}

export interface VideoStatusParams {
  video_id: string;
  extra_headers?: Record<string, string>;
}

// Journal Editor Schemas
export interface ImportFromMarkdownParams {
  markdown: string;
  title?: string;
  team_slug?: string;
  extra_headers?: Record<string, string>;
  extra_body?: Record<string, any>;
}

export interface EditJournalParams {
  journal_id: string;
  operations: EditOperation[];
  sync_realtime_state?: boolean;
  extra_headers?: Record<string, string>;
  extra_body?: Record<string, any>;
}

export interface ModelInfoParams {
  journal_id: string;
  extra_headers?: Record<string, string>;
}

export interface DeleteJournalParams {
  journal_id: string;
  extra_headers?: Record<string, string>;
}

// Journals Schemas
export interface CreateJournalParams {
  title: string;
  team_slug?: string;
  extra_headers?: Record<string, string>;
  extra_body?: Record<string, any>;
}

export interface RenameJournalParams {
  journal_id: string;
  title: string;
  extra_headers?: Record<string, string>;
  extra_body?: Record<string, any>;
}

export interface JournalsListParams {
  page_token?: number;
  extra_headers?: Record<string, string>;
}

export interface JournalContentParams {
  journal_id: string;
  extra_headers?: Record<string, string>;
}

// Flashcards Schemas
export interface FlashcardsCreateParams {
  set_description: string;
  count?: number;
  set_name?: string;
  extra_headers?: Record<string, string>;
  extra_body?: Record<string, any>;
}

// Practice Problem Sets Schemas
export interface PracticeProblemSetCreateParams {
  set_description: string;
  count?: number;
  set_name?: string;
  search_for_problems?: boolean;
  webhook_url?: string;
  extra_headers?: Record<string, string>;
  extra_body?: Record<string, any>;
}

export interface PracticeProblemSetStatusParams {
  set_id: string;
  extra_headers?: Record<string, string>;
}

export interface GradeFRQParams {
  problem: PracticeProblem;
  extra_headers?: Record<string, string>;
  extra_body?: Record<string, any>;
}

// Client Configuration Schema
export interface OpennoteClientConfig {
  api_key?: string;
  base_url?: string;
  timeout?: number;
  max_retries?: number;
  default_headers?: Record<string, string>;
  default_body?: Record<string, any>;
}

// Health Check Schema
export interface HealthCheckParams {
  extra_headers?: Record<string, string>;
}