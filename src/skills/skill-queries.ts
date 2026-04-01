/**
 * Skill: queries — fetches search query analytics with automatic
 * date range defaults (last 7 days) and formats a ranked table.
 */
import { apiGet } from "../client.js";

export interface QueryRow {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface QueriesReport {
  host_id: string;
  date_from: string;
  date_to: string;
  total_clicks: number;
  total_impressions: number;
  top_queries: QueryRow[];
  raw: unknown;
}

function defaultDateRange(): { date_from: string; date_to: string } {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 7);
  return {
    date_from: from.toISOString().slice(0, 10),
    date_to: to.toISOString().slice(0, 10),
  };
}

export async function runQueriesSkill(
  hostId: string,
  dateFrom?: string,
  dateTo?: string,
): Promise<QueriesReport> {
  const range = dateFrom && dateTo
    ? { date_from: dateFrom, date_to: dateTo }
    : defaultDateRange();

  const raw = await apiGet(
    `/hosts/${hostId}/search-queries/all/history`,
    range,
  ) as Record<string, unknown>;

  const queries: QueryRow[] = Array.isArray(raw)
    ? (raw as QueryRow[])
    : [];

  const totalClicks = queries.reduce((s, q) => s + (q.clicks || 0), 0);
  const totalImpressions = queries.reduce((s, q) => s + (q.impressions || 0), 0);

  const top = [...queries].sort((a, b) => b.clicks - a.clicks).slice(0, 20);

  return {
    host_id: hostId,
    date_from: range.date_from,
    date_to: range.date_to,
    total_clicks: totalClicks,
    total_impressions: totalImpressions,
    top_queries: top,
    raw,
  };
}
