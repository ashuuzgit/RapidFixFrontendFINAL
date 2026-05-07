import type {
  DashboardData,
  Job,
  JobsResponse,
  JobDetail,
  JobStatus,
  Booking,
  BookingsResponse,
  Bill,
  BillsResponse,
  Customer,
  CustomersResponse,
  Lead,
  LeadsResponse,
  Message,
  StaffPayload,
} from "./types";

// ── Config ────────────────────────────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";
console.log("NEXT_PUBLIC_API_URL =", process.env.NEXT_PUBLIC_API_URL);
console.log("BASE =", BASE);
const TOKEN_KEY = "repaiross_token";

export const auth = {
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  isLoggedIn: () => !!localStorage.getItem(TOKEN_KEY),
};

// ── Core fetch ────────────────────────────────────────────────────────────────

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = auth.getToken();

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw { error: data.error ?? "Request failed", status: res.status };
  }

  return data as T;
}

function qs(params: Record<string, string | number | undefined>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  login: async (
    email: string,
    password: string,
  ): Promise<{ token: string }> => {
    const res = await api<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    auth.setToken(res.token);
    return res;
  },

  me: () => api<StaffPayload>("/auth/me"),

  logout: () => auth.clearToken(),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────

export const dashboardApi = {
  get: () => api<DashboardData>("/dashboard"),
};

// ── Jobs ──────────────────────────────────────────────────────────────────────

export const jobsApi = {
  list: (
    params: {
      status?: JobStatus;
      mechanic_id?: string;
      page?: number;
      limit?: number;
    } = {},
  ) => api<JobsResponse>(`/jobs${qs(params)}`),

  get: (id: string) => api<JobDetail>(`/jobs/${id}`),

  create: (body: {
    location_id?: string;
    customer_id: string;
    vehicle_id?: string;
    mechanic_id?: string;
    service_description?: string;
    odometer_in?: number;
    estimated_completion?: string;
    booking_id?: string;
  }) => api<Job>("/jobs", { method: "POST", body: JSON.stringify(body) }),

  update: (
    id: string,
    body: {
      mechanic_id?: string;
      service_description?: string;
      estimated_completion?: string;
      odometer_in?: number;
      odometer_out?: number;
      vehicle_id?: string;
    },
  ) => api<Job>(`/jobs/${id}`, { method: "PATCH", body: JSON.stringify(body) }),

  advanceStatus: (id: string, status: JobStatus, note?: string) =>
    api<{ success: boolean; status: JobStatus; wa_sent: boolean }>(
      `/jobs/${id}/status`,
      { method: "PATCH", body: JSON.stringify({ status, note }) },
    ),

  addNote: (id: string, note: string) =>
    api(`/jobs/${id}/notes`, {
      method: "POST",
      body: JSON.stringify({ note }),
    }),
};

// ── Bookings ──────────────────────────────────────────────────────────────────

export const bookingsApi = {
  list: (
    params: {
      status?: string;
      date?: string;
      location_id?: string;
      page?: number;
      limit?: number;
    } = {},
  ) => api<BookingsResponse>(`/bookings${qs(params)}`),

  create: (body: {
    location_id: string;
    customer_id: string;
    vehicle_id?: string;
    source: string;
    slot_at?: string;
    service_notes?: string;
  }) =>
    api<Booking>("/bookings", { method: "POST", body: JSON.stringify(body) }),

  update: (
    id: string,
    body: {
      slot_at?: string;
      service_notes?: string;
      vehicle_id?: string;
      status?: string;
    },
  ) =>
    api<Booking>(`/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  confirm: (id: string) =>
    api<{ success: boolean }>(`/bookings/${id}/confirm`, { method: "POST" }),
};

// ── Bills ─────────────────────────────────────────────────────────────────────

export const billsApi = {
  list: (
    params: {
      status?: string;
      page?: number;
      limit?: number;
    } = {},
  ) => api<BillsResponse>(`/bills${qs(params)}`),

  get: (id: string) => api<Bill>(`/bills/${id}`),

  create: (body: {
    job_id: string;
    discount?: number;
    notes?: string;
    items: {
      category: "labour" | "parts";
      description: string;
      quantity: number;
      unit_price: number;
    }[];
  }) => api<Bill>("/bills", { method: "POST", body: JSON.stringify(body) }),

  update: (
    id: string,
    body: {
      discount?: number;
      notes?: string;
      items?: {
        category: "labour" | "parts";
        description: string;
        quantity: number;
        unit_price: number;
      }[];
    },
  ) =>
    api<Bill>(`/bills/${id}`, { method: "PATCH", body: JSON.stringify(body) }),

  send: (id: string, delivery_method: "whatsapp" | "email" | "both") =>
    api<Bill>(`/bills/${id}/send`, {
      method: "POST",
      body: JSON.stringify({ delivery_method }),
    }),

  recordPayment: (id: string, amount_paid: number) =>
    api<Bill>(`/bills/${id}/payment`, {
      method: "PATCH",
      body: JSON.stringify({ amount_paid }),
    }),

  getPublic: (token: string) => api<Bill>(`/bills/b/${token}`),
};

// ── Customers ─────────────────────────────────────────────────────────────────

export const customersApi = {
  list: (
    params: {
      search?: string;
      page?: number;
      limit?: number;
    } = {},
  ) => api<CustomersResponse>(`/customers${qs(params)}`),

  get: (id: string) => api<Customer>(`/customers/${id}`),

  create: (body: {
    name: string;
    phone: string;
    email?: string;
    whatsapp_opt_in?: boolean;
  }) =>
    api<Customer>("/customers", { method: "POST", body: JSON.stringify(body) }),

  update: (
    id: string,
    body: {
      name?: string;
      email?: string;
      whatsapp_opt_in?: boolean;
    },
  ) =>
    api<Customer>(`/customers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  getMessages: (id: string, params: { page?: number; limit?: number } = {}) =>
    api<{ data: Message[]; total: number }>(
      `/customers/${id}/messages${qs(params)}`,
    ),

  sendMessage: (id: string, body: string) =>
    api<Message>(`/customers/${id}/messages`, {
      method: "POST",
      body: JSON.stringify({ body }),
    }),
};

// ── Vehicles ──────────────────────────────────────────────────────────────────

export const vehiclesApi = {
  listByCustomer: (customer_id: string) =>
    api<
      {
        id: string;
        type: string;
        make: string | null;
        model: string | null;
        registration: string | null;
        year: number | null;
        color: string | null;
      }[]
    >(`/vehicles${qs({ customer_id })}`),

  create: (body: {
    customer_id: string;
    type: "car" | "bike";
    make?: string;
    model?: string;
    year?: number;
    registration?: string;
    color?: string;
  }) => api(`/vehicles`, { method: "POST", body: JSON.stringify(body) }),

  update: (
    id: string,
    body: {
      type?: "car" | "bike";
      make?: string;
      model?: string;
      year?: number;
      registration?: string;
      color?: string;
    },
  ) => api(`/vehicles/${id}`, { method: "PATCH", body: JSON.stringify(body) }),

  delete: (id: string) =>
    api<{ success: boolean }>(`/vehicles/${id}`, { method: "DELETE" }),
};

// ── Leads ─────────────────────────────────────────────────────────────────────

export const leadsApi = {
  list: (
    params: {
      status?: string;
      page?: number;
      limit?: number;
    } = {},
  ) => api<LeadsResponse>(`/leads${qs(params)}`),

  update: (
    id: string,
    body: {
      status?: string;
      assigned_to?: string;
    },
  ) =>
    api<Lead>(`/leads/${id}`, { method: "PATCH", body: JSON.stringify(body) }),

  convert: (
    id: string,
    body: {
      name: string;
      email?: string;
    },
  ) =>
    api<{ customer_id: string }>(`/leads/${id}/convert`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getMessages: (id: string) => api<Message[]>(`/leads/${id}/messages`),
};

// ── Notify ────────────────────────────────────────────────────────────────────

export const notifyApi = {
  blast: (message: string, customer_ids?: string[]) =>
    api<{ sent: number; failed: number; results: unknown[] }>("/notify/blast", {
      method: "POST",
      body: JSON.stringify({
        message,
        ...(customer_ids ? { customer_ids } : {}),
      }),
    }),
};
