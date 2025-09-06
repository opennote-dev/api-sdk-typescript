import {
  VideoCreateJobRequest,
  VideoCreateJobResponse,
  VideoJobStatusResponse,
  JournalsResponse,
  JournalContentResponse,
  VideoAPIRequestMessage,
  OPENNOTE_BASE_URL,
  ModelChoices,
  FlashcardCreateResponse,
  FlashcardCreateRequest,
  PracticeProblemSetJobCreateResponse,
  PracticeProblemSetStatusResponse,
  PracticeProblem,
  GradeFRQResponse,
  GradeFRQRequest
} from './api_types';
import { BaseClient } from './base_client';

export class Video {
  constructor(private client: OpennoteClient) {}

  async create(params: {
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
  }): Promise<VideoCreateJobResponse> {
    const request: VideoCreateJobRequest = {
      model: params.model || 'picasso',
      messages: params.messages,
      include_sources: params.include_sources || false,
      search_for: params.search_for,
      source_count: params.source_count || 3,
      length: params.length || 3,
      script: params.script,
      upload_to_s3: params.upload_to_s3 || false,
      title: params.title || '',
      webhook_url: params.webhook_url || '' // Optional, sends final status to this URL as POST
    };

    return this.client.request<VideoCreateJobResponse>(
      'POST',
      '/v1/video/create',
      { body: JSON.stringify(request) }
    );
  }

  async status(videoId: string): Promise<VideoJobStatusResponse> {
    if (!videoId) {
      throw new Error('video_id must be provided');
    }

    return this.client.request<VideoJobStatusResponse>(
      'GET',
      `/v1/video/status/${videoId}`
    );
  }
}

export class Journals {
  constructor(private client: OpennoteClient) {}

  async list(pageToken?: number): Promise<JournalsResponse> {
    const params = new URLSearchParams();
    if (pageToken !== undefined) {
      params.append('page_token', pageToken.toString());
    }

    const queryString = params.toString();
    const path = queryString ? `/v1/journals/list?${queryString}` : '/v1/journals/list';

    return this.client.request<JournalsResponse>('GET', path);
  }

  async content(journalId: string): Promise<JournalContentResponse> {
    if (!journalId) {
      throw new Error('journal_id must be provided');
    }

    return this.client.request<JournalContentResponse>(
      'GET',
      `/v1/journals/content/${journalId}`
    );
  }
}

export class Flashcards {
  constructor(private client: OpennoteClient) {}
  
  async create(params: {
    set_description: string;
    count?: number;
    set_name?: string;
  }): Promise<FlashcardCreateResponse> {
    return this.client.request<FlashcardCreateResponse>('POST', '/v1/interactives/flashcards/create', { body: JSON.stringify(params) });
  }
}

export class PracticeProblems {
  constructor(private client: OpennoteClient) {}

  async create(params: {
    set_description: string;
    count?: number;
    set_name?: string;
    search_for_problems?: boolean;
    webhook_url?: string;
  }): Promise<PracticeProblemSetJobCreateResponse> {
    return this.client.request<PracticeProblemSetJobCreateResponse>('POST', '/v1/interactives/practice/create', { body: JSON.stringify(params) });
  }

  async status(set_id: string): Promise<PracticeProblemSetStatusResponse> {
    return this.client.request<PracticeProblemSetStatusResponse>('GET', `/v1/interactives/practice/status/${set_id}`);
  }

  async grade(problem: PracticeProblem): Promise<GradeFRQResponse> {
    return this.client.request<GradeFRQResponse>('POST', `/v1/interactives/practice/grade`, { body: JSON.stringify({ problem: problem }) });
  }
}

export class OpennoteClient extends BaseClient {
  public video: Video;
  public journals: Journals;
  public flashcards: Flashcards;
  public practice: PracticeProblems;

  constructor(
    apiKey: string,
    baseUrl: string = OPENNOTE_BASE_URL,
    timeout: number = 60000,
    maxRetries: number = 3
  ) {
    super(apiKey, baseUrl, timeout, maxRetries);
    this.video = new Video(this);
    this.journals = new Journals(this);
    this.flashcards = new Flashcards(this);
    this.practice = new PracticeProblems(this);
  }

  async request<T>(
    method: string,
    path: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        method,
        headers: {
          ...this.getHeaders(),
          ...(options?.headers || {})
        },
        signal: controller.signal
      });

      return this.processResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async health(): Promise<{ status: string }> {
    return this.request<{ status: string }>('GET', '/v1/health');
  }
}

// Export all types
export * from './api_types';
// Export errors with renamed ValidationError to avoid conflict
export {
  OpennoteAPIError,
  AuthenticationError,
  InsufficientCreditsError,
  ValidationError as OpennoteValidationError,
  RateLimitError,
  ServerError,
  BaseClient
} from './base_client';

// For backward compatibility
export const OpennoteVideoClient = OpennoteClient;