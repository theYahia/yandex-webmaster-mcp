import { z } from "zod";
import { apiGet } from "../client.js";

export const getSearchQueriesSchema = z.object({
  host_id: z.string().describe("Host ID from get_hosts"),
  date_from: z.string().describe("Start date YYYY-MM-DD"),
  date_to: z.string().describe("End date YYYY-MM-DD"),
});

export async function handleGetSearchQueries(params: z.infer<typeof getSearchQueriesSchema>): Promise<string> {
  const data = await apiGet(
    `/hosts/${params.host_id}/search-queries/all/history`,
    { date_from: params.date_from, date_to: params.date_to },
  );
  return JSON.stringify(data, null, 2);
}
