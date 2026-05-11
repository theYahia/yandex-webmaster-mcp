import { z } from "zod";
import { apiGet } from "../client.js";

export const getSearchQueriesSchema = z.object({
  host_id: z.string().describe("Host ID from get_hosts"),
  date_from: z.string().describe("Start date YYYY-MM-DD"),
  date_to: z.string().describe("End date YYYY-MM-DD"),
  limit: z
    .number()
    .int()
    .min(1)
    .max(500)
    .optional()
    .describe("Max queries to return (1-500, default 100)"),
  order_by: z
    .enum(["TOTAL_SHOWS", "TOTAL_CLICKS", "AVG_SHOW_POSITION", "AVG_CLICK_POSITION"])
    .optional()
    .describe("Sort indicator (default TOTAL_SHOWS)"),
});

export async function handleGetSearchQueries(
  params: z.infer<typeof getSearchQueriesSchema>,
): Promise<string> {
  // Use /popular for per-query rows (text, clicks, shows, CTR, position).
  // The /all/history endpoint that was previously called returns only a
  // time-series of aggregate indicators — not what "search query analytics"
  // means in the tool description.
  const data = await apiGet(
    `/hosts/${params.host_id}/search-queries/popular`,
    {
      date_from: params.date_from,
      date_to: params.date_to,
      order_by: params.order_by ?? "TOTAL_SHOWS",
      // Repeated param — see apiGet for array handling.
      query_indicator: [
        "TOTAL_SHOWS",
        "TOTAL_CLICKS",
        "AVG_SHOW_POSITION",
        "AVG_CLICK_POSITION",
      ],
      limit: String(params.limit ?? 100),
    },
  );
  return JSON.stringify(data, null, 2);
}
