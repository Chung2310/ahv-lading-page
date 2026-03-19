// Default backend prefix is /api/v1 (can override via VITE_API_BASE_URL).
// In dev, keep it relative (e.g. "/api/v1") to use Vite proxy and avoid CORS.
const BASE_URL = (import.meta.env.VITE_API_BASE_URL?.trim() || "/api/v1").replace(/\/+$/, "");

// ==== Common types ====

export interface Post {
  _id: string;
  title: string;
  content: string;
  status?: string;
  categoryId: string;
  imageUrl?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobDescription {
  _id: string;
  title: string;
  position?: string;
  salary?: string;
  experience?: string;
  level?: string;
  jobType?: string;
  gender?: string;
  location?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  quantity?: number;
  expiredAt?: string;
}

export interface Ticket {
  _id: string;
  fullname: string;
  phone: string;
  email: string;
  description: string;
  status?: string;
  createdAt?: string;
}

export interface Cv {
  _id: string;
  filePath: string;
  jobDescriptionId?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CoreValue {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  order?: number;
  status?: string;
}

export interface Milestone {
  _id: string;
  title: string;
  description: string;
  date: number;
  order?: number;
  status?: string;
}

export interface ManagementMember {
  _id: string;
  name: string;
  position: string;
  avatarUrl?: string;
  description?: string;
  order?: number;
  status?: string;
}

export interface OperatingField {
  _id: string;
  name: string;
  description: string;
  icon?: string;
  order?: number;
  status?: string;
}

export interface CustomerFeedback {
  _id: string;
  customerName: string;
  content: string;
  position?: string;
  company?: string;
  avatarUrl?: string;
  order?: number;
  status?: string;
}

export interface FeaturedProject {
  _id: string;
  name: string;
  description: string;
  customer?: string | null;
  industry?: string | null;
  thumbnailUrl?: string | null;
  link?: string | null;
  order?: number;
  status?: string;
}

export interface AuthUser {
  _id: string;
  name?: string;
  username?: string;
}

export interface AuthResponse {
  // Theo spec backend: { message, data: { token, user } }
  message?: string;
  data?: {
    token?: string;
    user?: AuthUser;
    accessToken?: string;
    refreshToken?: string;
  };
  // Các field dự phòng cho những nơi khác có thể dùng
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUser;
}

// ==== Auth token helpers (dùng cho các API cần Bearer token) ====

const ACCESS_TOKEN_KEY = "ahv_access_token";

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return (await res.json()) as T;
}

function buildUrl(pathname: string) {
  const base = BASE_URL || "";
  const full = `${base}${pathname}`;
  // If BASE_URL is relative (e.g. "/api/v1"), URL() needs an absolute base.
  if (/^https?:\/\//i.test(full)) return new URL(full);
  return new URL(full, window.location.origin);
}

// Helper để bóc danh sách từ nhiều format khác nhau của backend
function extractList<T = unknown>(raw: any): T[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as T[];

  if (Array.isArray(raw.data)) return raw.data as T[];
  if (Array.isArray(raw.items)) return raw.items as T[];

  if (raw.data && typeof raw.data === "object") {
    const d = raw.data;
    if (Array.isArray(d.items)) return d.items as T[];
    const firstArray = Object.values(d).find((v) => Array.isArray(v));
    if (firstArray) return firstArray as T[];
  }

  return [];
}

function extractItem<T = unknown>(raw: any): T {
  if (!raw) return raw as T;
  if (raw.data && typeof raw.data === "object") {
    // common: { data: {...} } or { data: { item: {...} } }
    const d = raw.data;
    if (d && typeof d === "object" && !Array.isArray(d)) {
      if (d.item && typeof d.item === "object") return d.item as T;
      if (d.data && typeof d.data === "object") return d.data as T;
      return d as T;
    }
  }
  if (raw.item && typeof raw.item === "object") return raw.item as T;
  return raw as T;
}

// ==== Public fetch APIs cho landing ====

export async function fetchPosts(params?: {
  page?: number;
  limit?: number;
}): Promise<Post[]> {
  const url = buildUrl("/posts");
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.limit) url.searchParams.set("limit", String(params.limit));

  const res = await fetch(url.toString(), {
    method: "GET",
  });
  const raw = await handleResponse<any>(res);
  return extractList<Post>(raw);
}

export async function fetchCoreValues(): Promise<CoreValue[]> {
  const res = await fetch(`${BASE_URL}/core-values`, {
    method: "GET",
  });
  const raw = await handleResponse<any>(res);
  return extractList<CoreValue>(raw);
}

export async function fetchMilestones(): Promise<Milestone[]> {
  const res = await fetch(`${BASE_URL}/milestones`, {
    method: "GET",
  });
  const raw = await handleResponse<any>(res);
  return extractList<Milestone>(raw);
}

export async function fetchManagementMembers(): Promise<ManagementMember[]> {
  const res = await fetch(`${BASE_URL}/management-members`, {
    method: "GET",
  });
  const raw = await handleResponse<any>(res);
  return extractList<ManagementMember>(raw);
}

export async function fetchOperatingFields(): Promise<OperatingField[]> {
  const res = await fetch(`${BASE_URL}/operating-fields`, {
    method: "GET",
  });
  const raw = await handleResponse<any>(res);
  return extractList<OperatingField>(raw);
}

export async function fetchCustomerFeedbacks(): Promise<CustomerFeedback[]> {
  const res = await fetch(`${BASE_URL}/customer-feedbacks`, {
    method: "GET",
  });
  const raw = await handleResponse<any>(res);
  return extractList<CustomerFeedback>(raw);
}

export async function fetchFeaturedProjects(): Promise<FeaturedProject[]> {
  const res = await fetch(`${BASE_URL}/featured-projects`, {
    method: "GET",
  });
  const raw = await handleResponse<any>(res);
  return extractList<FeaturedProject>(raw);
}

export async function createFeaturedProject(
  payload: Omit<FeaturedProject, "_id">
): Promise<FeaturedProject> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders(),
  };
  const res = await fetch(`${BASE_URL}/featured-projects`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse<FeaturedProject>(res);
}

export async function updateFeaturedProject(
  id: string,
  payload: Partial<Omit<FeaturedProject, "_id">>
): Promise<FeaturedProject> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders(),
  };
  const res = await fetch(`${BASE_URL}/featured-projects/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse<FeaturedProject>(res);
}

export async function deleteFeaturedProject(id: string): Promise<void> {
  const headers: HeadersInit = {
    ...authHeaders(),
  };
  const res = await fetch(`${BASE_URL}/featured-projects/${id}`, {
    method: "DELETE",
    headers,
  });
  await handleResponse(res);
}

// ==== CRUD cho các section trang chủ (Admin) ====

export async function createCoreValue(
  payload: Omit<CoreValue, "_id">
): Promise<CoreValue> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders(),
  };
  const res = await fetch(`${BASE_URL}/core-values`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse<CoreValue>(res);
}

export async function updateCoreValue(
  id: string,
  payload: Partial<Omit<CoreValue, "_id">>
): Promise<CoreValue> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders(),
  };
  const res = await fetch(`${BASE_URL}/core-values/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse<CoreValue>(res);
}

export async function deleteCoreValue(id: string): Promise<void> {
  const headers: HeadersInit = {
    ...authHeaders(),
  };
  const res = await fetch(`${BASE_URL}/core-values/${id}`, {
    method: "DELETE",
    headers,
  });
  await handleResponse(res);
}

export async function createMilestone(
  payload: Omit<Milestone, "_id">
): Promise<Milestone> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders(),
  };
  const res = await fetch(`${BASE_URL}/milestones`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse<Milestone>(res);
}

export async function updateMilestone(
  id: string,
  payload: Partial<Omit<Milestone, "_id">>
): Promise<Milestone> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders(),
  };
  const res = await fetch(`${BASE_URL}/milestones/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse<Milestone>(res);
}

export async function deleteMilestone(id: string): Promise<void> {
  const headers: HeadersInit = {
    ...authHeaders(),
  };
  const res = await fetch(`${BASE_URL}/milestones/${id}`, {
    method: "DELETE",
    headers,
  });
  await handleResponse(res);
}

export async function createManagementMember(
  payload: Omit<ManagementMember, "_id">
): Promise<ManagementMember> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders(),
  };
  const res = await fetch(`${BASE_URL}/management-members`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse<ManagementMember>(res);
}

export async function updateManagementMember(
  id: string,
  payload: Partial<Omit<ManagementMember, "_id">>
): Promise<ManagementMember> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders(),
  };
  const res = await fetch(`${BASE_URL}/management-members/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse<ManagementMember>(res);
}

export async function deleteManagementMember(id: string): Promise<void> {
  const headers: HeadersInit = {
    ...authHeaders(),
  };
  const res = await fetch(`${BASE_URL}/management-members/${id}`, {
    method: "DELETE",
    headers,
  });
  await handleResponse(res);
}

export async function createOperatingField(
  payload: Omit<OperatingField, "_id">
): Promise<OperatingField> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders(),
  };
  const res = await fetch(`${BASE_URL}/operating-fields`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse<OperatingField>(res);
}

export async function updateOperatingField(
  id: string,
  payload: Partial<Omit<OperatingField, "_id">>
): Promise<OperatingField> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders(),
  };
  const res = await fetch(`${BASE_URL}/operating-fields/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse<OperatingField>(res);
}

export async function deleteOperatingField(id: string): Promise<void> {
  const headers: HeadersInit = {
    ...authHeaders(),
  };
  const res = await fetch(`${BASE_URL}/operating-fields/${id}`, {
    method: "DELETE",
    headers,
  });
  await handleResponse(res);
}

export async function createCustomerFeedback(
  payload: Omit<CustomerFeedback, "_id">
): Promise<CustomerFeedback> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders(),
  };
  const res = await fetch(`${BASE_URL}/customer-feedbacks`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse<CustomerFeedback>(res);
}

export async function updateCustomerFeedback(
  id: string,
  payload: Partial<Omit<CustomerFeedback, "_id">>
): Promise<CustomerFeedback> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders(),
  };
  const res = await fetch(`${BASE_URL}/customer-feedbacks/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse<CustomerFeedback>(res);
}

export async function deleteCustomerFeedback(id: string): Promise<void> {
  const headers: HeadersInit = {
    ...authHeaders(),
  };
  const res = await fetch(`${BASE_URL}/customer-feedbacks/${id}`, {
    method: "DELETE",
    headers,
  });
  await handleResponse(res);
}

export async function fetchJobs(params?: {
  page?: number;
  limit?: number;
}): Promise<JobDescription[]> {
  const url = buildUrl("/jds");
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.limit) url.searchParams.set("limit", String(params.limit));

  const res = await fetch(url.toString(), {
    method: "GET",
  });
  const raw = await handleResponse<any>(res);
  return extractList<JobDescription>(raw);
}

export async function fetchCategories(params?: {
  page?: number;
  limit?: number;
  name?: string;
}): Promise<Category[]> {
  const url = new URL(`${BASE_URL}/categories`);
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.limit) url.searchParams.set("limit", String(params.limit));
  if (params?.name) url.searchParams.set("name", params.name);

  const res = await fetch(url.toString(), {
    method: "GET",
  });
  const raw = await handleResponse<any>(res);
  return extractList<Category>(raw);
}

export async function createCategory(
  payload: Omit<Category, "_id" | "createdAt" | "updatedAt">
): Promise<Category> {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Category>(res);
}

export async function updateCategory(
  id: string,
  payload: Partial<Omit<Category, "_id" | "createdAt" | "updatedAt">>
): Promise<Category> {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Category>(res);
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeaders(),
    },
  });
  await handleResponse(res);
}

export interface CreateTicketPayload {
  fullname: string;
  phone: string;
  email: string;
  description: string;
}

export async function createTicket(payload: CreateTicketPayload): Promise<void> {
  const res = await fetch(`${BASE_URL}/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  await handleResponse(res);
}

// ==== Auth APIs (dùng cho Admin) ====

export async function login(payload: {
  username: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auths`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // Chấp nhận nhiều format token khác nhau từ backend
  const raw = await handleResponse<any>(res);
  const token: string | undefined =
    raw?.data?.token || raw.accessToken || raw.token || raw.access_token;

  if (token) {
    setAccessToken(token);
  }

  return raw as AuthResponse;
}

export async function refreshToken(refreshToken: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auths/refresh`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });
  const raw = await handleResponse<any>(res);
  const token: string | undefined =
    raw?.data?.token || raw.accessToken || raw.token || raw.access_token;
  if (token) {
    setAccessToken(token);
  }
  return raw as AuthResponse;
}

export async function getMe() {
  const res = await fetch(`${BASE_URL}/auths/me`, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });
  const raw = await handleResponse<any>(res);
  // Hỗ trợ cả format { data: { user } } và { user } hoặc trả thẳng user
  return (raw?.data?.user || raw.user || raw) as AuthResponse["user"];
}

// ==== CRUD Posts cho Admin ====

export async function createPost(payload: Omit<Post, "_id">): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Post>(res);
}

export async function updatePost(
  id: string,
  payload: Partial<Omit<Post, "_id">>
): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Post>(res);
}

export async function deletePost(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeaders(),
    },
  });
  await handleResponse(res);
}

export async function getPost(id: string): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });
  const raw = await handleResponse<any>(res);
  return extractItem<Post>(raw);
}

// ==== CRUD JDs cho Admin ====

export async function createJob(
  payload: Omit<JobDescription, "_id">
): Promise<JobDescription> {
  const res = await fetch(`${BASE_URL}/jds`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<JobDescription>(res);
}

export async function updateJob(
  id: string,
  payload: Partial<Omit<JobDescription, "_id">>
): Promise<JobDescription> {
  const res = await fetch(`${BASE_URL}/jds/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<JobDescription>(res);
}

export async function deleteJob(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/jds/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeaders(),
    },
  });
  await handleResponse(res);
}

export async function getJob(id: string): Promise<JobDescription> {
  const res = await fetch(`${BASE_URL}/jds/${id}`, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });
  const raw = await handleResponse<any>(res);
  return extractItem<JobDescription>(raw);
}

// ==== Tickets cho Admin ====

export async function fetchTickets(params?: {
  page?: number;
  limit?: number;
}): Promise<Ticket[]> {
  const url = new URL(`${BASE_URL}/tickets`);
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.limit) url.searchParams.set("limit", String(params.limit));

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });
  const raw = await handleResponse<any>(res);
  return extractList<Ticket>(raw);
}

export async function getTicket(id: string): Promise<Ticket> {
  const res = await fetch(`${BASE_URL}/tickets/${id}`, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });
  const raw = await handleResponse<any>(res);
  return extractItem<Ticket>(raw);
}

export async function updateTicket(
  id: string,
  payload: Partial<Pick<Ticket, "status" | "description">>
): Promise<Ticket> {
  const res = await fetch(`${BASE_URL}/tickets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Ticket>(res);
}

export async function deleteTicket(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/tickets/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeaders(),
    },
  });
  await handleResponse(res);
}

// ==== CVs cho Admin ====

export async function fetchCvs(params?: {
  page?: number;
  limit?: number;
  jobDescriptionId?: string;
}): Promise<Cv[]> {
  const url = new URL(`${BASE_URL}/cvs`);
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.limit) url.searchParams.set("limit", String(params.limit));
  if (params?.jobDescriptionId)
    url.searchParams.set("jobDescriptionId", params.jobDescriptionId);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });
  const raw = await handleResponse<any>(res);
  return extractList<Cv>(raw);
}

export async function getCv(id: string): Promise<Cv> {
  const res = await fetch(`${BASE_URL}/cvs/${id}`, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });
  const raw = await handleResponse<any>(res);
  return extractItem<Cv>(raw);
}

export async function updateCv(
  id: string,
  payload: Partial<Pick<Cv, "status">>
): Promise<Cv> {
  const res = await fetch(`${BASE_URL}/cvs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Cv>(res);
}

export async function createCv(payload: {
  filePath: string;
  jobDescriptionId?: string;
}): Promise<Cv> {
  const res = await fetch(`${BASE_URL}/cvs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Cv>(res);
}


