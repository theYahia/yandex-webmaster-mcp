import { z } from "zod";
import { apiGet } from "../client.js";

export const getHostsSchema = z.object({});

export async function handleGetHosts(_params: z.infer<typeof getHostsSchema>): Promise<string> {
  const data = await apiGet(`/hosts/`);
  return JSON.stringify(data, null, 2);
}
