import { z } from "zod";
import { apiGet, apiPost } from "../client.js";

export const getIndexingSchema = z.object({
  host_id: z.string().describe("Host ID from get_hosts"),
});

export async function handleGetIndexing(params: z.infer<typeof getIndexingSchema>): Promise<string> {
  const data = await apiGet(`/hosts/${params.host_id}/summary/`);
  return JSON.stringify(data, null, 2);
}

export const submitUrlSchema = z.object({
  host_id: z.string().describe("Host ID from get_hosts"),
  url: z.string().url().describe("URL to submit for re-indexing"),
});

export async function handleSubmitUrl(params: z.infer<typeof submitUrlSchema>): Promise<string> {
  const data = await apiPost(`/hosts/${params.host_id}/recrawl/queue/`, { url: params.url });
  return JSON.stringify(data, null, 2);
}
