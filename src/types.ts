export interface WebmasterHost {
  host_id: string;
  ascii_host_url: string;
  unicode_host_url: string;
  verified: boolean;
}

export interface WebmasterHostsResponse {
  hosts: WebmasterHost[];
}

export interface WebmasterSearchQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface WebmasterIndexingResponse {
  searchable_count: number;
  excluded_count: number;
  site_error_count: number;
}
