export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class HttpClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string, timeout = 12000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private createHeaders(additionalHeaders?: HeadersInit): Headers {
    const headers = new Headers(additionalHeaders);
    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    const headers = this.createHeaders(options.headers);

    if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
        credentials: options.credentials ?? 'include'
      });

      clearTimeout(timer);

      if (!response.ok) {
        let errorDetail;
        try {
          errorDetail = await response.json();
        } catch {
          errorDetail = { message: 'Error de formato en la respuesta del servidor' };
        }

        const errorMessage =
          errorDetail.message || errorDetail.error || `Error HTTP: ${response.status}`;
        throw new ApiError(errorMessage, response.status, errorDetail);
      }

      return (await response.json()) as T;
    } catch (error: any) {
      if (error?.name === 'AbortError') throw new Error('Tiempo de espera agotado');
      throw error;
    }
  }

  get<T>(endpoint: string, options: RequestInit = {}) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: any, options: RequestInit = {}) {
    const opts: RequestInit = {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    };
    return this.request<T>(endpoint, opts);
  }
}
