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
  mp4Url?: string;
}

export interface AutoPlayTaskDTO {
  taskId: string;
  sourceName: string;
  sourceKey: string;
  iconUrl: string;
}

export interface AutoPlayImportResultDTO {
  total: number;
  imported: number;
  skipped: number;
  failed: number;
  details: string[];
}

export interface BangumiWeekday {
  en: string;
  cn: string;
  ja: string;
  id: number;
}

export interface BangumiSubject {
  id: number;
  url: string;
  type: number;
  name: string;
  name_cn: string;
  summary: string;
  air_date: string;
  air_weekday: number;
  rating: {
    total: number;
    count: Record<string, number>;
    score: number;
  };
  rank: number;
  images?: {
    large?: string;
    common?: string;
    medium?: string;
    small?: string;
    grid?: string;
  } | null;
  collection: {
    doing: number;
  };
}

export interface BangumiCalendarDay {
  weekday: BangumiWeekday;
  items: BangumiSubject[];
}

export type TaskStatus = 'pending' | 'loading' | 'success' | 'failed';

export interface TaskStatusDTO extends AutoPlayTaskDTO {
  status: TaskStatus;
  source?: PlaySourceDTO;
}

export interface PlaySourceDTO {
  sourceName: string;
  sourceKey: string;
  episodes: EpisodeDTO[];
  success: boolean;
  errorMessage?: string;
}

export interface WatchHistoryUpdateDTO {
  metadataId: number;
  episodeIndex: number;
  sourceKey?: string;
  progressSeconds?: number;
  watchDuration?: number;
}

export interface UserWatchHistoryDTO {
  id: number;
  userId: number;
  metadataId: number;
  animeName: string;
  animeCover: string;
  episodeIndex: number;
  sourceKey: string;
  progressSeconds: number;
  watchDuration: number;
  lastWatchTime: string;
}

export interface FavoriteAddDTO {
  metadataId: number;
  note?: string;
  tags?: string;
}

export interface FavoriteUpdateDTO {
  note?: string;
  tags?: string;
}

export interface UserFavoriteDTO {
  id: number;
  userId: number;
  metadataId: number;
  animeName: string;
  animeNameCn: string;
  animeCover: string;
  score: number;
  episodes: number;
  tags: string[];
  favoriteTime: string;
  note: string;
  userTags: string;
}

export interface DanmakuMessageDTO {
  id: number;
  videoId: number;
  episodeIndex: number;
  userId: number;
  userNickname: string;
  userAvatar: string;
  content: string;
  color: string;
  danmakuType: 0 | 1 | 2;
  timePosition: number;
  createTime: string;
}

export interface DanmakuListDTO {
  videoId: number;
  episodeIndex: number;
  danmakuList: DanmakuMessageDTO[];
  total: number;
}

export interface DanmakuSendDTO {
  videoId: number;
  episodeIndex: number;
  content: string;
  color?: string;
  danmakuType?: 0 | 1 | 2;
  timePosition?: number;
}

export interface DanmakuReportDTO {
  danmakuId: number;
  reportReason?: string;
  reportType?: 0 | 1 | 2 | 3;
}

export interface DanmakuReport {
  id: number;
  danmakuId: number;
  reporterUserId: number;
  reportReason: string;
  reportType: number;
  status: number;
  handleAdminId?: number;
  handleTime?: string;
  handleResult?: string;
  createTime: string;
  updateTime: string;
  deleted: number;
}

export type DanmakuType = 0 | 1 | 2;

export const DANMAKU_TYPE_LABELS: Record<DanmakuType, string> = {
  0: '滚动',
  1: '顶部',
  2: '底部',
};

export const REPORT_TYPE_LABELS: Record<number, string> = {
  0: '垃圾广告',
  1: '恶意刷屏',
  2: '人身攻击',
  3: '其他',
};