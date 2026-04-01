import { z } from "zod";
import { apiGet } from "../client.js";

export const getSitemapsSchema = z.object({
  host_id: z.string().describe("Host ID from get_hosts"),
});

export async function handleGetSitemaps(params: z.infer<typeof getSitemapsSchema>): Promise<string> {
  const data = await apiGet(`/hosts/${params.host_id}/sitemaps/`);
  return JSON.stringify(data, null, 2);
}
