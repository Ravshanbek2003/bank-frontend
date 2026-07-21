import axios from "axios";

import type {
  Bank,
  CategoryMeta,
  Change,
  ChangeStatus,
  DashboardData,
  Paginated,
  ScanRun,
  Snapshot,
} from "./types";

const baseURL = 'https://bot.jayronmed.uz';

export const http = axios.create({ baseURL, timeout: 60000 });

const unwrap = <T>(p: Promise<{ data: { data: T } }>) =>
  p.then((r) => r.data.data);

// --- Dashboard ---
export const getDashboard = () =>
  unwrap<DashboardData>(http.get("/api/dashboard"));

// --- Categories ---
export const getCategories = () =>
  unwrap<CategoryMeta[]>(http.get("/api/categories"));

// --- Banks ---
export const getBanks = (params?: { q?: string; active?: string }) =>
  unwrap<Bank[]>(http.get("/api/banks", { params }));

export const getBank = (slug: string) =>
  unwrap<Bank>(http.get(`/api/banks/${slug}`));

export const updateBankSources = (slug: string, sources: Bank["sources"]) =>
  unwrap<Bank>(http.put(`/api/banks/${slug}/sources`, { sources }));

// --- Snapshots ---
export const getSnapshots = (params?: {
  bankSlug?: string;
  category?: string;
  latest?: string;
  page?: number;
  limit?: number;
}) =>
  http
    .get<Paginated<Snapshot>>("/api/snapshots", { params })
    .then((r) => r.data);

export const getSnapshot = (id: string) =>
  unwrap<Snapshot>(http.get(`/api/snapshots/${id}`));

// --- Changes ---
export const getChanges = (params?: {
  status?: string;
  bankSlug?: string;
  category?: string;
  page?: number;
  limit?: number;
}) =>
  http.get<Paginated<Change>>("/api/changes", { params }).then((r) => r.data);

export const getChange = (id: string) =>
  unwrap<Change>(http.get(`/api/changes/${id}`));

export const reviewChange = (id: string, status: ChangeStatus, note?: string) =>
  unwrap<Change>(http.patch(`/api/changes/${id}/review`, { status, note }));

// --- Scan ---
export const triggerScan = (body?: { bankSlug?: string; category?: string }) =>
  http.post("/api/scan", body || {}).then((r) => r.data);

export const getScanRuns = (params?: { page?: number; limit?: number }) =>
  http
    .get<Paginated<ScanRun>>("/api/scan/runs", { params })
    .then((r) => r.data);

export const getScanRun = (id: string) =>
  unwrap<ScanRun>(http.get(`/api/scan/runs/${id}`));
