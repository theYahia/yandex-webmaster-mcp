import { z } from "zod";
import { apiGet, getUserId } from "../client.js";

export const getIndexingSchema = z.object({
  host_id: z.string().describe("ID хоста из get_hosts"),
});

export async function handleGetIndexing(params: z.infer<typeof getIndexingSchema>): Promise<string> {
  const userId = await getUserId();
  const data = await apiGet(`/user/${userId}/hosts/${params.host_id}/summary/`);
  return JSON.stringify(data, null, 2);
}
