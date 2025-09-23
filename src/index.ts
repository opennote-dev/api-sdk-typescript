import {
  VideoCreateJobRequest,
  VideoCreateJobResponse,
  VideoJobStatusResponse,
  JournalsResponse,
  JournalContentResponse,
  VideoAPIRequestMessage,
  OPENNOTE_BASE_URL,
  ModelChoices,
  FlashcardCreateRequest,
  FlashcardCreateResponse,
  PracticeProblemSetJobCreateRequest,
  PracticeProblemSetJobCreateResponse,
  PracticeProblemSetStatusResponse,
  PracticeProblem,
  GradeFRQRequest,
  GradeFRQResponse,
  ImportFromMarkdownRequest,
  ImportFromMarkdownResponse,
  EditJournalRequest,
  EditJournalResponse,
  ModelInfoResponse,
  EditOperation
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
    extra_headers?: Record<string, string>;
    extra_body?: Record<string, any>;
  }): Promise<VideoCreateJobResponse> {
    const { extra_headers, extra_body, ...requestParams } = params;
    const request: VideoCreateJobRequest = {
      model: requestParams.model || 'picasso',
      messages: requestParams.messages,
      include_sources: requestParams.include_sources || false,
      search_for: requestParams.search_for,
      source_count: requestParams.source_count || 3,
      length: requestParams.length || 3,
      script: requestParams.script,
      upload_to_s3: requestParams.upload_to_s3 || false,
      title: requestParams.title || '',
      webhook_url: requestParams.webhook_url
    };

    return this.client.request<VideoCreateJobResponse>(
      'POST',
      '/v1/video/create',
      { 
        body: JSON.stringify(request),
        extraHeaders: extra_headers,
        extraBody: extra_body
      }
    );
  }

  async status(videoId: string, extraHeaders?: Record<string, string>): Promise<VideoJobStatusResponse> {
    if (!videoId) {
      throw new Error('video_id must be provided');
    }

    return this.client.request<VideoJobStatusResponse>(
      'GET',
      `/v1/video/status/${videoId}`,
      { extraHeaders }
    );
  }
}

export class JournalEditor {
  constructor(private client: OpennoteClient) {}

  async importFromMarkdown(markdown: string, title: string = "Imported Journal", extraHeaders?: Record<string, string>, extraBody?: Record<string, any>): Promise<ImportFromMarkdownResponse> {
    const request: ImportFromMarkdownRequest = {
      markdown,
      title
    };

    return this.client.request<ImportFromMarkdownResponse>(
      'PUT',
      '/v1/journals/editor/import_from_markdown',
      { 
        body: JSON.stringify(request),
        extraHeaders,
        extraBody
      }
    );
  }

  async edit(journalId: string, operations: EditOperation[], syncRealtimeState: boolean = true, extraHeaders?: Record<string, string>, extraBody?: Record<string, any>): Promise<EditJournalResponse> {
    const request: EditJournalRequest = {
      journal_id: journalId,
      operations,
      sync_realtime_state: syncRealtimeState
    };

    return this.client.request<EditJournalResponse>(
      'PATCH',
      '/v1/journals/editor/edit',
      { 
        body: JSON.stringify(request),
        extraHeaders,
        extraBody
      }
    );
  }

  async modelInfo(journalId: string, extraHeaders?: Record<string, string>): Promise<ModelInfoResponse> {
    if (!journalId) {
      throw new Error('journal_id must be provided');
    }

    return this.client.request<ModelInfoResponse>(
      'GET',
      `/v1/journals/editor/model/${journalId}`,
      { extraHeaders }
    );
  }

  async delete(journalId: string, extraHeaders?: Record<string, string>): Promise<ModelInfoResponse> {
    if (!journalId) {
      throw new Error('journal_id must be provided');
    }

    return this.client.request<ModelInfoResponse>(
      'DELETE',
      `/v1/journals/editor/delete/${journalId}`,
      { extraHeaders }
    );
  }
}

export class Journals {
  public editor: JournalEditor;

  constructor(private client: OpennoteClient) {
    this.editor = new JournalEditor(client);
  }

  async list(pageToken?: number, extraHeaders?: Record<string, string>): Promise<JournalsResponse> {
    const params = new URLSearchParams();
    if (pageToken !== undefined) {
      params.append('page_token', pageToken.toString());
    }

    const queryString = params.toString();
    const path = queryString ? `/v1/journals/list?${queryString}` : '/v1/journals/list';

    return this.client.request<JournalsResponse>('GET', path, { extraHeaders });
  }

  async content(journalId: string, extraHeaders?: Record<string, string>): Promise<JournalContentResponse> {
    if (!journalId) {
      throw new Error('journal_id must be provided');
    }

    return this.client.request<JournalContentResponse>(
      'GET',
      `/v1/journals/content/${journalId}`,
      { extraHeaders }
    );
  }
}

export class Flashcards {
  constructor(private client: OpennoteClient) {}
  
  async create(setDescription: string, count: number = 10, setName?: string, extraHeaders?: Record<string, string>, extraBody?: Record<string, any>): Promise<FlashcardCreateResponse> {
    if (!setDescription) {
      throw new Error('set_description must be provided');
    }
    if (!count) {
      throw new Error('count must be provided');
    }

    const request: FlashcardCreateRequest = {
      set_description: setDescription,
      count,
      set_name: setName
    };

    return this.client.request<FlashcardCreateResponse>(
      'POST',
      '/v1/interactives/flashcards/create',
      { 
        body: JSON.stringify(request),
        extraHeaders,
        extraBody
      }
    );
  }
}

export class PracticeProblemSets {
  constructor(private client: OpennoteClient) {}

  async create(
    setDescription: string,
    count: number = 5,
    setName?: string,
    searchForProblems: boolean = false,
    webhookUrl?: string,
    extraHeaders?: Record<string, string>,
    extraBody?: Record<string, any>
  ): Promise<PracticeProblemSetJobCreateResponse> {
    const request: PracticeProblemSetJobCreateRequest = {
      set_description: setDescription,
      count,
      set_name: setName,
      search_for_problems: searchForProblems,
      webhook_url: webhookUrl
    };

    return this.client.request<PracticeProblemSetJobCreateResponse>(
      'POST',
      '/v1/interactives/practice/create',
      { 
        body: JSON.stringify(request),
        extraHeaders,
        extraBody
      }
    );
  }

  async status(setId: string, extraHeaders?: Record<string, string>): Promise<PracticeProblemSetStatusResponse> {
    return this.client.request<PracticeProblemSetStatusResponse>(
      'GET',
      `/v1/interactives/practice/status/${setId}`,
      { extraHeaders }
    );
  }

  async grade(problem: PracticeProblem, extraHeaders?: Record<string, string>, extraBody?: Record<string, any>): Promise<GradeFRQResponse> {
    const request: GradeFRQRequest = {
      problem
    };

    return this.client.request<GradeFRQResponse>(
      'POST',
      '/v1/interactives/practice/grade',
      { 
        body: JSON.stringify(request),
        extraHeaders,
        extraBody
      }
    );
  }
}

export class Interactives {
  public practice: PracticeProblemSets;
  public flashcards: Flashcards;

  constructor(client: OpennoteClient) {
    this.practice = new PracticeProblemSets(client);
    this.flashcards = new Flashcards(client);
  }
}

export class OpennoteClient extends BaseClient {
  public video: Video;
  public journals: Journals;
  public interactives: Interactives;

  constructor(
    apiKey: string,
    baseUrl: string = OPENNOTE_BASE_URL,
    timeout: number = 60000,
    maxRetries: number = 3,
    defaultHeaders?: Record<string, string>,
    defaultBody?: Record<string, any>
  ) {
    super(apiKey, baseUrl, timeout, maxRetries, defaultHeaders, defaultBody);
    this.video = new Video(this);
    this.journals = new Journals(this);
    this.interactives = new Interactives(this);
  }

  async request<T>(
    method: string,
    path: string,
    options?: {
      body?: string;
      extraHeaders?: Record<string, string>;
      extraBody?: Record<string, any>;
      headers?: Record<string, string>;
    }
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    // Merge body if needed
    let finalBody = options?.body;
    if (finalBody && (options?.extraBody || Object.keys(this.defaultBody).length > 0)) {
      const bodyObj = JSON.parse(finalBody);
      const mergedBody = this.mergeBody(bodyObj, options?.extraBody);
      finalBody = JSON.stringify(mergedBody);
    }

    // Get headers with extra headers
    const headers = this.getHeaders(options?.extraHeaders);
    if (options?.headers) {
      Object.assign(headers, options.headers);
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: finalBody,
        signal: controller.signal
      });

      return this.processResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async health(extraHeaders?: Record<string, string>): Promise<{ status: string }> {
    return this.request<{ status: string }>('GET', '/v1/health', { extraHeaders });
  }
}

// Export all types
export * from './api_types';
export * from './block_types';
export * from './block_type_converters';

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

// Export utility functions
export * from './util/edit_operations';

// For backward compatibility
export const OpennoteVideoClient = OpennoteClient;
export const Opennote = OpennoteClient;