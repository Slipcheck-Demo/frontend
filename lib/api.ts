import type {
  ApiErrorCode,
  ConvertResponse,
  EventMarketsResponse,
  EventsResponse,
  Sport,
  SlipResponse,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  code: ApiErrorCode;
  status: number;

  constructor(code: ApiErrorCode, status: number) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError((body.error as ApiErrorCode) ?? "upstream_error", res.status);
  }
  return body as T;
}

export function resolveCode(bookingCode: string): Promise<SlipResponse> {
  return request("/api/booking-codes/resolve", {
    method: "POST",
    body: JSON.stringify({ bookingCode }),
  });
}

export function createCode(outcomeIds: string[]): Promise<SlipResponse> {
  return request("/api/booking-codes", {
    method: "POST",
    body: JSON.stringify({ outcomeIds }),
  });
}

export function convertCode(bookingCode: string): Promise<ConvertResponse> {
  return request("/api/booking-codes/convert", {
    method: "POST",
    body: JSON.stringify({ bookingCode }),
  });
}

export function getSports(): Promise<{ sports: Sport[] }> {
  return request("/api/sports");
}

export function getEvents(sportId: string): Promise<EventsResponse> {
  return request(`/api/events?${new URLSearchParams({ sportId }).toString()}`);
}

export function getEventMarkets(eventId: number): Promise<EventMarketsResponse> {
  return request(`/api/events/${eventId}/markets`);
}
