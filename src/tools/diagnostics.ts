import { z } from "zod";
import { apiGet } from "../client.js";

export const getDiagnosticsSchema = z.object({
  host_id: z.string().describe("Host ID from get_hosts"),
});

export async function handleGetDiagnostics(params: z.infer<typeof getDiagnosticsSchema>): Promise<string> {
  const data = await apiGet(`/hosts/${params.host_id}/diagnostics/`);
  return JSON.stringify(data, null, 2);
}
