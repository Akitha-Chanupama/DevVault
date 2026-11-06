import { HttpMethod, BodyType, HeaderItem, QueryItem, ApiResponseDetails } from '../types';

export function constructRequestUrl(baseUrl: string, queryParams: QueryItem[]): string {
  try {
    const url = new URL(baseUrl);
    queryParams.forEach((p) => {
      if (p.enabled && p.key.trim()) {
        url.searchParams.append(p.key.trim(), p.value);
      }
    });
    return url.toString();
  } catch {
    return baseUrl;
  }
}

export async function executeHttpRequest(params: {
  method: HttpMethod;
  url: string;
  headers: HeaderItem[];
  queryParams: QueryItem[];
  bodyType: BodyType;
  bodyContent: string;
  timeoutMs?: number;
  abortSignal?: AbortSignal;
}): Promise<ApiResponseDetails> {
  const finalUrl = constructRequestUrl(params.url, params.queryParams);

  const requestHeaders = new Headers();
  params.headers.forEach((h) => {
    if (h.enabled && h.key.trim()) {
      requestHeaders.set(h.key.trim(), h.value);
    }
  });

  let body: BodyInit | undefined = undefined;
  if (params.method !== 'GET' && params.method !== 'HEAD' && params.bodyType !== 'none') {
    if (params.bodyType === 'json') {
      if (!requestHeaders.has('Content-Type')) {
        requestHeaders.set('Content-Type', 'application/json');
      }
      body = params.bodyContent;
    } else if (params.bodyType === 'urlencoded') {
      if (!requestHeaders.has('Content-Type')) {
        requestHeaders.set('Content-Type', 'application/x-www-form-urlencoded');
      }
      body = params.bodyContent;
    } else {
      body = params.bodyContent;
    }
  }

  const start = performance.now();
  try {
    const response = await fetch(finalUrl, {
      method: params.method,
      headers: requestHeaders,
      body,
      signal: params.abortSignal,
    });

    const durationMs = Math.round(performance.now() - start);

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      responseHeaders[key] = val;
    });

    const text = await response.text();
    let isJson = false;
    let formattedData = text;

    try {
      const parsed = JSON.parse(text);
      formattedData = JSON.stringify(parsed, null, 2);
      isJson = true;
    } catch {
      // Plain text or HTML
      isJson = false;
    }

    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      data: formattedData,
      isJson,
      durationMs,
    };
  } catch (err) {
    const durationMs = Math.round(performance.now() - start);
    const errorMsg = (err as Error).message || '';
    const isCors =
      errorMsg.includes('Failed to fetch') ||
      errorMsg.includes('NetworkError') ||
      errorMsg.includes('Load failed');

    return {
      status: 0,
      statusText: isCors ? 'Network / CORS Error' : 'Request Failed',
      headers: {},
      data: isCors
        ? `Browser Network / CORS Restriction: The browser blocked this cross-origin request because the destination origin does not return the required 'Access-Control-Allow-Origin' header for client-side web requests.\n\nNote: Public APIs that support CORS (like jsonplaceholder, pokeapi, github) or APIs that explicitly enable CORS can be queried directly.`
        : `Request Error: ${errorMsg}`,
      isJson: false,
      durationMs,
      isCorsError: isCors,
    };
  }
}
