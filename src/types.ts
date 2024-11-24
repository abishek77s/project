export interface BrowsingRecord {
  dateTime: string;
  navigatedToUrl: string;
  pageTitle: string;
}

export interface DomainStats {
  domain: string;
  visits: number;
  percentage: number;
  category: string;
}

export interface TimeStats {
  hour: number;
  visits: number;
}

export interface DailyStats {
  date: string;
  visits: number;
  topSites: Array<{
    domain: string;
    visits: number;
  }>;
}

export interface CategoryStats {
  category: string;
  visits: number;
  percentage: number;
  domains: DomainStats[];
}

export interface VideoStats {
  category: string;
  count: number;
  percentage: number;
}

export interface MediaStats {
  movies: string[];
  anime: string[];
  topVideos: Array<{
    title: string;
    views: number;
  }>;
}