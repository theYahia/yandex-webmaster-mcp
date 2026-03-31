import { z } from "zod";
import { apiGet, getUserId } from "../client.js";

export const getSearchQueriesSchema = z.object({
  host_id: z.string().describe("ID хоста из get_hosts"),
  date_from: z.string().describe("Дата начала в формате YYYY-MM-DD"),
  date_to: z.string().describe("Дата окончания в формате YYYY-MM-DD"),
});

export async function handleGetSearchQueries(params: z.infer<typeof getSearchQueriesSchema>): Promise<string> {
  const userId = await getUserId();
  const data = await apiGet(
    `/user/${userId}/hosts/${params.host_id}/search-queries/all/history`,
    { date_from: params.date_from, date_to: params.date_to },
  );
  return JSON.stringify(data, null, 2);
}
