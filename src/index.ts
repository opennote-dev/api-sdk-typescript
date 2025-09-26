import {
  VideoCreateJobRequest,
  VideoCreateJobResponse,
  VideoJobStatusResponse,
  JournalsResponse,
  JournalContentResponse,
  OPENNOTE_BASE_URL,
  FlashcardCreateRequest,
  FlashcardCreateResponse,
  PracticeProblemSetJobCreateRequest,
  PracticeProblemSetJobCreateResponse,
  PracticeProblemSetStatusResponse,
  GradeFRQRequest,
  GradeFRQResponse,
  ImportFromMarkdownRequest,
  ImportFromMarkdownResponse,
  EditJournalRequest,
  EditJournalResponse,
  ModelInfoResponse,
  JournalDeleteResponse,
  CreateJournalRequest,
  CreateJournalResponse,
  RenameJournalRequest,
  RenameJournalResponse
} from './api_types';
import { BaseClient } from './base_client';
import {
  VideoCreateParams,
  VideoStatusParams,
  ImportFromMarkdownParams,
  EditJournalParams,
  ModelInfoParams,
  DeleteJournalParams,
  CreateJournalParams,
  RenameJournalParams,
  JournalsListParams,
  JournalContentParams,
  FlashcardsCreateParams,
  PracticeProblemSetCreateParams,
  PracticeProblemSetStatusParams,
  GradeFRQParams,
  OpennoteClientConfig,
  HealthCheckParams
} from './schemas';

export class Video {
  constructor(private client: OpennoteClient) {}

  async create(params: VideoCreateParams): Promise<VideoCreateJobResponse> {
    const { extra_headers, extra_body, ...requestParams } = params;
    const request: VideoCreateJobRequest = {
      model: requestParams.model || 'picasso',
      messages: requestParams.messages,
      include_sources: requestParams.include_sources ?? false,
      search_for: requestParams.search_for,
      source_count: requestParams.source_count ?? 3,
      length: requestParams.length ?? 3,
      script: requestParams.script,
      upload_to_s3: requestParams.upload_to_s3 ?? false,
      title: requestParams.title ?? '',
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

  async status(params: VideoStatusParams): Promise<VideoJobStatusResponse> {
    const { video_id, extra_headers } = params;
    if (!video_id) {
      throw new Error('video_id must be provided');
    }

    return this.client.request<VideoJobStatusResponse>(
      'GET',
      `/v1/video/status/${video_id}`,
      { extraHeaders: extra_headers }
    );
  }
}

export class JournalEditor {
  constructor(private client: OpennoteClient) {}

  async importFromMarkdown(params: ImportFromMarkdownParams): Promise<ImportFromMarkdownResponse> {
    const { markdown, title = "Imported Journal", extra_headers, extra_body } = params;
    const request: ImportFromMarkdownRequest = {
      markdown,
      title
    };

    return this.client.request<ImportFromMarkdownResponse>(
      'PUT',
      '/v1/journals/editor/import_from_markdown',
      { 
        body: JSON.stringify(request),
        extraHeaders: extra_headers,
        extraBody: extra_body
      }
    );
  }

  async edit(params: EditJournalParams): Promise<EditJournalResponse> {
    const { journal_id, operations, sync_realtime_state = true, extra_headers, extra_body } = params;
    const request: EditJournalRequest = {
      journal_id,
      operations,
      sync_realtime_state
    };

    return this.client.request<EditJournalResponse>(
      'PATCH',
      '/v1/journals/editor/edit',
      { 
        body: JSON.stringify(request),
        extraHeaders: extra_headers,
        extraBody: extra_body
      }
    );
  }

  async modelInfo(params: ModelInfoParams): Promise<ModelInfoResponse> {
    const { journal_id, extra_headers } = params;
    if (!journal_id) {
      throw new Error('journal_id must be provided');
    }

    return this.client.request<ModelInfoResponse>(
      'GET',
      `/v1/journals/editor/model/${journal_id}`,
      { extraHeaders: extra_headers }
    );
  }

  async delete(params: DeleteJournalParams): Promise<JournalDeleteResponse> {
    const { journal_id, extra_headers } = params;
    if (!journal_id) {
      throw new Error('journal_id must be provided');
    }

    return this.client.request<JournalDeleteResponse>(
      'DELETE',
      `/v1/journals/editor/delete/${journal_id}`,
      { extraHeaders: extra_headers }
    );
  }
}

export class Journals {
  public editor: JournalEditor;

  constructor(private client: OpennoteClient) {
    this.editor = new JournalEditor(client);
  }

  async create(params: CreateJournalParams): Promise<CreateJournalResponse> {
    const { title, extra_headers, extra_body } = params;
    const request: CreateJournalRequest = {
      title
    };

    return this.client.request<CreateJournalResponse>(
      'PUT',
      '/v1/journals/editor/create',
      { 
        body: JSON.stringify(request),
        extraHeaders: extra_headers,
        extraBody: extra_body
      }
    );
  }

  async rename(params: RenameJournalParams): Promise<RenameJournalResponse> {
    const { journal_id, title, extra_headers, extra_body } = params;
    const request: RenameJournalRequest = {
      journal_id,
      title
    };

    return this.client.request<RenameJournalResponse>(
      'PATCH',
      '/v1/journals/editor/rename',
      { 
        body: JSON.stringify(request),
        extraHeaders: extra_headers,
        extraBody: extra_body
      }
    );
  }

  async list(params: JournalsListParams = {}): Promise<JournalsResponse> {
    const { page_token, extra_headers } = params;
    const urlParams = new URLSearchParams();
    if (page_token !== undefined) {
      urlParams.append('page_token', page_token.toString());
    }

    const queryString = urlParams.toString();
    const path = queryString ? `/v1/journals/list?${queryString}` : '/v1/journals/list';

    return this.client.request<JournalsResponse>('GET', path, { extraHeaders: extra_headers });
  }

  async content(params: JournalContentParams): Promise<JournalContentResponse> {
    const { journal_id, extra_headers } = params;
    if (!journal_id) {
      throw new Error('journal_id must be provided');
    }

    return this.client.request<JournalContentResponse>(
      'GET',
      `/v1/journals/content/${journal_id}`,
      { extraHeaders: extra_headers }
    );
  }
}

export class Flashcards {
  constructor(private client: OpennoteClient) {}
  
  async create(params: FlashcardsCreateParams): Promise<FlashcardCreateResponse> {
    const { set_description, count = 10, set_name, extra_headers, extra_body } = params;
    if (!set_description) {
      throw new Error('set_description must be provided');
    }

    const request: FlashcardCreateRequest = {
      set_description,
      count,
      set_name
    };

    return this.client.request<FlashcardCreateResponse>(
      'POST',
      '/v1/interactives/flashcards/create',
      { 
        body: JSON.stringify(request),
        extraHeaders: extra_headers,
        extraBody: extra_body
      }
    );
  }
}

export class PracticeProblemSets {
  constructor(private client: OpennoteClient) {}

  async create(params: PracticeProblemSetCreateParams): Promise<PracticeProblemSetJobCreateResponse> {
    const { 
      set_description, 
      count = 5, 
      set_name, 
      search_for_problems = false, 
      webhook_url,
      extra_headers,
      extra_body
    } = params;
    
    const request: PracticeProblemSetJobCreateRequest = {
      set_description,
      count,
      set_name,
      search_for_problems,
      webhook_url
    };

    return this.client.request<PracticeProblemSetJobCreateResponse>(
      'POST',
      '/v1/interactives/practice/create',
      { 
        body: JSON.stringify(request),
        extraHeaders: extra_headers,
        extraBody: extra_body
      }
    );
  }

  async status(params: PracticeProblemSetStatusParams): Promise<PracticeProblemSetStatusResponse> {
    const { set_id, extra_headers } = params;
    return this.client.request<PracticeProblemSetStatusResponse>(
      'GET',
      `/v1/interactives/practice/status/${set_id}`,
      { extraHeaders: extra_headers }
    );
  }

  async grade(params: GradeFRQParams): Promise<GradeFRQResponse> {
    const { problem, extra_headers, extra_body } = params;
    const request: GradeFRQRequest = {
      problem
    };

    return this.client.request<GradeFRQResponse>(
      'POST',
      '/v1/interactives/practice/grade',
      { 
        body: JSON.stringify(request),
        extraHeaders: extra_headers,
        extraBody: extra_body
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

  constructor(config: OpennoteClientConfig) {
    const {
      api_key = process?.env.OPENNOTE_API_KEY || '',
      base_url = OPENNOTE_BASE_URL,
      timeout = 60000,
      max_retries = 3,
      default_headers,
      default_body
    } = config;
    
    super(api_key, base_url, timeout, max_retries, default_headers, default_body);
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

  async _health(params: HealthCheckParams = {}): Promise<string> {
    const { extra_headers } = params;
    const url = `${this.baseUrl}/v1/health`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const headers = this.getHeaders(extra_headers);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.text();
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

// Export all types
export * from './api_types';
export * from './block_types';
export * from './block_type_converters';
export * from './schemas';

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