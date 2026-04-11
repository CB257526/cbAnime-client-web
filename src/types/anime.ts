export interface AnimeHomeDTO {
  id: number;
  nameCn: string;
  imagesLarge: string;
  score: number;
  airDate: string;
  platform: string;
}

export interface AnimeDetailDTO {
  id: number;
  nameCn: string;
  name: string;
  nameCnAliases: string;
  imagesLarge: string;
  summary: string;
  airDate: string;
  platform: string;
  studio: string;
  score: number;
  episodes: number;
  tags: string[];
  metaTags: string[];
}

export interface AnimeQueryDTO {
  pageNum?: number;
  pageSize?: number;
  platform?: string;
  tag?: string;
  tagLogic?: 'AND' | 'OR';
  keyword?: string;
  orderBy?: 'score' | 'airDate' | 'episodes';
  sortDirection?: 'asc' | 'desc';
  minScore?: number;
  maxScore?: number;
}

export interface PageResult<T> {
  size: number;
  records: T[];
  current: number;
  pages: number;
  total: number;
}

export interface AnimePageResult {
  size: number;
  records: AnimeHomeDTO[];
  current: number;
  pages: number;
  total: number;
}

export interface EpisodeDTO {
  episodeName: string;
  m3u8Url: string;
}

export interface PlaySourceDTO {
  sourceName: string;
  sourceKey: string;
  episodes: EpisodeDTO[];
  success: boolean;
  errorMessage?: string;
}