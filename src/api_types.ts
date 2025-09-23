export const OPENNOTE_BASE_URL = "https://api.opennote.com";

export type ModelChoices = "picasso";
export type VideoStatusChoices = "pending" | "completed" | "failed" | "status_error";
export type MessageRoleChoices = "user" | "assistant" | "system";

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

export interface Flashcard {
    front: string 
    back: string
}

export interface FlashcardCreateRequest {
    set_description: string
    count?: number
    set_name?: string
}

export interface FlashcardCreateResponse {
    success: boolean 
    message?: string
    set_name?: string
    flashcards?: Flashcard[]
    timestamp: string
}



export interface PracticeProblem {
  problem_type: "mcq" | "frq" | "selectall"
  problem_statement: string
  correct_answer?: string | string[] // for MCQ
  difficulty: "easy" | "medium" | "hard"
  answer_choices?: Record<string, string>;  // Only for MCQ
  explanation?: string;
  scoring_details?: string;  // Only for FRQ
  include_graph: boolean;
  graph_description?: string;
  graph_url?: string;
  user_answer?: string | string[];  // User's selected option(s) or textarea response
}

export interface PracticeProblemSet {
  set_id: string; 
  set_name?: string;
  problems?: PracticeProblem[];
  cost?: number;
}

export interface PracticeProblemSetJobCreateRequest { 
  set_description: string;
  count?: number;
  set_name?: string;
  search_for_problems?: boolean;
  webhook_url?: string;
}

export interface PracticeProblemSetJobCreateResponse {
  success: boolean;
  message?: string;
  set_id?: string;
  timestamp: string;
}

export interface PracticeProblemSetStatusResponse {
  set_id: string;
  success: boolean;   
  status: "pending" | "completed" | "failed" | "status_error";
  message?: string;
  total_problems: number; 
  completed_problems: number;
  response?: PracticeProblemSet;
  timestamp: string;
}

export interface GradeFRQRequest {
  problem: PracticeProblem;
}

export interface GradeFRQResponse {
  success: boolean;   
  timestamp: string;
  score: number;
  explanation: string;
  max_score: number;
  percentage: number;
}

// Journal Editor Types
export interface ImportFromMarkdownRequest {
  markdown: string;
  title?: string;
}

export interface ImportFromMarkdownResponse {
  success: boolean;
  message?: string;
  journal_id?: string;
  journal_url?: string;
  timestamp: string;
}

// ProseMirror Model Types
export interface Mark {
  type: string;
  attrs?: BlockAttrs;
}

export interface BlockAttrs {
  id?: string;
  level?: number; // For headings
  [key: string]: any;
}

export interface BlockNode {
  type: string;
  attrs?: BlockAttrs;
  content?: BlockNode[];
  marks?: Mark[];
  text?: string;
  [key: string]: any;
}

export interface ModelInfoResponse {
  success: boolean;
  message?: string;
  model?: BlockNode;
  timestamp: string;
}

// Edit Journal Operation Types
export interface CreateNodeOperation {
  type: "create_node";
  nodeType: string;
  params: any[];
  referenceId?: string;
  position?: "before" | "after";
}

export interface UpdateNodeOperation {
  type: "update_node";
  nodeId: string;
  node: Record<string, any>;
}

export interface DeleteNodeOperation {
  type: "delete_node";
  nodeId: string;
}

export interface InsertNodeOperation {
  type: "insert_node";
  referenceId?: string;
  node: any;
  position: "before" | "after";
}

export interface BatchCreateOperation {
  type: "batch_create";
  nodes: Record<string, any>[];
}

export interface BatchUpdateOperation {
  type: "batch_update";
  updates: Record<string, any>[];
}

export interface BatchDeleteOperation {
  type: "batch_delete";
  nodeIds: string[];
}

export type EditOperation = 
  | CreateNodeOperation
  | UpdateNodeOperation
  | DeleteNodeOperation
  | InsertNodeOperation
  | BatchCreateOperation
  | BatchUpdateOperation
  | BatchDeleteOperation;

export interface EditJournalRequest {
  journal_id: string;
  operations: EditOperation[];
  sync_realtime_state?: boolean; // Whether to directly update the state of the journal to all connected users. WARNING: Operations through synced states CANNOT be undone, and will remove Ctrl+Z functionality for all users for the changes made.
}

export interface OperationResultData {
  created?: boolean;
  nodeId?: string;
  updated?: string;
  deleted?: string;
  inserted?: boolean;
  batchCreated?: number;
  nodeIds?: string[];
  batchUpdated?: number;
  batchDeleted?: number;
}

export interface EditResults {
  operation: "create_node" | "update_node" | "delete_node" | "insert_node" | "batch_create" | "batch_update" | "batch_delete";
  success: boolean;
  error?: string;
  data?: OperationResultData;
}

export interface EditJournalResponse {
  success: boolean;
  message?: string;
  journal_id: string;
  results: EditResults[];
  timestamp: string;
}
