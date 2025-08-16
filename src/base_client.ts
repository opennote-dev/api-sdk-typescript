import { OPENNOTE_BASE_URL } from './api_types';

export class OpennoteAPIError extends Error {
  public statusCode?: number;
  public response?: Response;

  constructor(message: string, statusCode?: number, response?: Response) {
    super(message);
    this.name = 'OpennoteAPIError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

export class AuthenticationError extends OpennoteAPIError {
  constructor(message: string, statusCode?: number, response?: Response) {
    super(message, statusCode, response);
    this.name = 'AuthenticationError';
  }
}

export class InsufficientCreditsError extends OpennoteAPIError {
  constructor(message: string, statusCode?: number, response?: Response) {
    super(message, statusCode, response);
    this.name = 'InsufficientCreditsError';
  }
}

export class ValidationError extends OpennoteAPIError {
  constructor(message: string, statusCode?: number, response?: Response) {
    super(message, statusCode, response);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends OpennoteAPIError {
  public retryAfter?: number;

  constructor(message: string, retryAfter?: number, statusCode?: number, response?: Response) {
    super(message, statusCode, response);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class ServerError extends OpennoteAPIError {
  constructor(message: string, statusCode?: number, response?: Response) {
    super(message, statusCode, response);
    this.name = 'ServerError';
  }
}

export abstract class BaseClient {
  protected apiKey: string;
  protected baseUrl: string;
  protected timeout: number;
  protected maxRetries: number;

  constructor(
    apiKey: string,
    baseUrl: string = OPENNOTE_BASE_URL,
    timeout: number = 30000,
    maxRetries: number = 3
  ) {
    if (!apiKey) {
      // In browser environment, check for global variable
      const envApiKey = typeof process !== 'undefined' && process.env 
        ? process.env.OPENNOTE_API_KEY 
        : (typeof window !== 'undefined' && (window as any).OPENNOTE_API_KEY);
      
      if (!envApiKey) {
        throw new Error('OPENNOTE_API_KEY is not set');
      }
      apiKey = envApiKey;
    }

    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.timeout = timeout;
    this.maxRetries = maxRetries;
  }

  protected getHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  protected async handleResponseErrors(response: Response): Promise<void> {
    if (response.status === 401) {
      throw new AuthenticationError(
        'Invalid API key or unauthorized access',
        401,
        response
      );
    } else if (response.status === 402) {
      throw new InsufficientCreditsError(
        'Insufficient credits',
        402,
        response
      );
    } else if (response.status === 422) {
      let message = 'Validation error';
      try {
        const errorDetail = await response.json();
        message = `Validation error: ${JSON.stringify(errorDetail)}`;
      } catch {
        // Use default message
      }
      throw new ValidationError(
        message,
        422,
        response
      );
    } else if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const retryAfterInt = retryAfter ? parseInt(retryAfter, 10) : undefined;
      throw new RateLimitError(
        'Rate limit exceeded',
        retryAfterInt,
        429,
        response
      );
    } else if (response.status === 500) {
      throw new ServerError(
        'Internal server error',
        500,
        response
      );
    } else if (response.status >= 400) {
      throw new OpennoteAPIError(
        `API error: ${response.status}`,
        response.status,
        response
      );
    }
  }

  protected async processResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      await this.handleResponseErrors(response);
    }
    
    return response.json() as Promise<T>;
  }
}