// ============================================================
// Client HTTP générique — prêt pour le backend Spring Boot.
//
// Configuration (dans .env ou .env.local) :
//   VITE_API_BASE_URL=http://localhost:8080/api
//   VITE_USE_MOCK=true            # bascule sur les mocks locaux
//
// Stockage du JWT : localStorage["souk_token"]
//   - http.setToken("xxx")  / http.clearToken()
//   - injecté automatiquement dans l'en-tête Authorization
//
// Utilisation :
//   const products = await http.get<Product[]>("/products");
//   const created  = await http.post<Product>("/products", payload);
// ============================================================

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ??
  "http://localhost:8080/api";

/** Bascule globale mock <-> backend. Défaut : true tant que Spring Boot n'est pas connecté. */
export const USE_MOCK: boolean =
  String(import.meta.env.VITE_USE_MOCK ?? "true").toLowerCase() !== "false";

const TOKEN_KEY = "souk_token";

// ---------------- Token JWT ----------------
function readToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
function writeToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch { /* storage indisponible */ }
}

// ---------------- Erreurs ----------------
export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// ---------------- Helpers ----------------
type Query = Record<string, string | number | boolean | undefined | null>;

function buildUrl(path: string, query?: Query): string {
  const url = new URL(
    path.startsWith("http") ? path : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`,
  );
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function parseResponse<T>(res: Response): Promise<T> {
  const ct = res.headers.get("content-type") ?? "";
  const isJson = ct.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const message =
      (isJson && body && typeof body === "object" && "message" in (body as object)
        ? String((body as { message: unknown }).message)
        : null) ??
      (typeof body === "string" && body) ||
      res.statusText ||
      `HTTP ${res.status}`;
    throw new ApiError(message, res.status, body);
  }

  return body as T;
}

interface RequestOptions {
  query?: Query;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Désactiver l'injection automatique du JWT (route publique). */
  skipAuth?: boolean;
}

async function request<T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
  opts: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(opts.headers ?? {}),
  };

  const token = opts.skipAuth ? null : readToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload: BodyInit | undefined;
  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      payload = body; // laisser le navigateur fixer le boundary
    } else {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
  }

  let res: Response;
  try {
    res = await fetch(buildUrl(path, opts.query), {
      method,
      headers,
      body: payload,
      credentials: "include",
      signal: opts.signal,
    });
  } catch (err) {
    throw new ApiError(
      err instanceof Error ? err.message : "Erreur réseau",
      0,
      err,
    );
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return parseResponse<T>(res);
}

// ---------------- API publique ----------------
export const http = {
  baseUrl: API_BASE_URL,
  useMock: USE_MOCK,

  // Auth helpers
  getToken: readToken,
  setToken: (token: string | null) => writeToken(token),
  clearToken: () => writeToken(null),

  // Méthodes HTTP
  get:    <T = unknown>(path: string, opts?: RequestOptions)             => request<T>("GET", path, undefined, opts),
  post:   <T = unknown>(path: string, body?: unknown, opts?: RequestOptions) => request<T>("POST", path, body, opts),
  put:    <T = unknown>(path: string, body?: unknown, opts?: RequestOptions) => request<T>("PUT", path, body, opts),
  patch:  <T = unknown>(path: string, body?: unknown, opts?: RequestOptions) => request<T>("PATCH", path, body, opts),
  delete: <T = unknown>(path: string, opts?: RequestOptions)             => request<T>("DELETE", path, undefined, opts),
};

export type { RequestOptions };
