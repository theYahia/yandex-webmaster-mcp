/**
 * Skill: indexing — combines get_indexing + submit_url + get_diagnostics
 * into a single high-level "check and fix indexing" workflow.
 */
import { apiGet, apiPost } from "../client.js";

export interface IndexingReport {
  host_id: string;
  summary: unknown;
  diagnostics: unknown;
  submitted_urls: string[];
}

export async function runIndexingSkill(
  hostId: string,
  urlsToSubmit: string[] = [],
): Promise<IndexingReport> {
  const [summary, diagnostics] = await Promise.all([
    apiGet(`/hosts/${hostId}/summary/`),
    apiGet(`/hosts/${hostId}/diagnostics/`),
  ]);

  const submitted: string[] = [];
  for (const url of urlsToSubmit) {
    try {
      await apiPost(`/hosts/${hostId}/recrawl/queue/`, { url });
      submitted.push(url);
    } catch {
      // skip failed submissions
    }
  }

  return {
    host_id: hostId,
    summary,
    diagnostics,
    submitted_urls: submitted,
  };
}
