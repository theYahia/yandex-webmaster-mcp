import { z } from "zod";
import { apiGet, getUserId } from "../client.js";

export const getHostsSchema = z.object({});

export async function handleGetHosts(_params: z.infer<typeof getHostsSchema>): Promise<string> {
  const userId = await getUserId();
  const data = await apiGet(`/user/${userId}/hosts/`);
  return JSON.stringify(data, null, 2);
}
