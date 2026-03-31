const BASE_URL = "https://api.webmaster.yandex.net/v4";
const TIMEOUT = 15_000;
const MAX_RETRIES = 3;

function getToken(): string {
  const token = process.env.YANDEX_WEBMASTER_TOKEN;
  if (!token) {
    throw new Error("YANDEX_WEBMASTER_TOKEN is not set");
  }
  return token;
}

export function getUserId(): string {
  const userId = process.env.YANDEX_WEBMASTER_USER_ID;
  if (!userId) {
    throw new Error("YANDEX_WEBMASTER_USER_ID is not set");
  }
  return userId;
}

async function fetchWithRetry(url: string, options: RequestInit = {}, retries = MAX_RETRIES): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);

      if (response.ok) return response;

      if (response.status >= 500 && attempt < retries) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
        console.error(`[yandex-webmaster-mcp] ${response.status} from ${url}, retry in ${delay}ms (${attempt}/${retries})`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      const body = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status}: ${response.statusText}. ${body}`);
    } catch (error) {
      clearTimeout(timer);
      if (attempt === retries) throw error;
      if (error instanceof DOMException && error.name === "AbortError") {
        console.error(`[yandex-webmaster-mcp] Timeout ${url}, retry (${attempt}/${retries})`);
        continue;
      }
      throw error;
    }
  }
  throw new Error("All retries exhausted");
}

export async function apiGet(path: string, params: Record<string, string> = {}): Promise<unknown> {
  const userId = getUserId();
  const fullPath = path.startsWith("/user/") ? path : `/user/${userId}${path}`;
  const url = new URL(fullPath, BASE_URL);
  for (const [k, v] of Object.entries(params)) {
    if (v) url.searchParams.set(k, v);
  }
  const response = await fetchWithRetry(url.toString(), {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export async function apiPost(path: string, body: unknown): Promise<unknown> {
  const userId = getUserId();
  const fullPath = path.startsWith("/user/") ? path : `/user/${userId}${path}`;
  const url = new URL(fullPath, BASE_URL);
  const response = await fetchWithRetry(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response.json();
}
