import axiosInstance, { axiosInstanceLongTimeout } from '../utils/api';
import { Result } from '../types/auth';
import { AnimeHomeDTO, AnimeDetailDTO, AnimeQueryDTO, PageResult, PlaySourceDTO, WatchHistoryUpdateDTO, UserWatchHistoryDTO, FavoriteAddDTO, FavoriteUpdateDTO, UserFavoriteDTO, DanmakuMessageDTO, DanmakuListDTO, DanmakuSendDTO, DanmakuReportDTO } from '../types/anime';

export const animeApi = {
  getAdminRecommendList: async (): Promise<Result<AnimeHomeDTO[]>> => {
    const response = await axiosInstance.get<Result<AnimeHomeDTO[]>>('/api/metadata/recommend/admin');
    return response.data;
  },

  getPopularList: async (limit?: number): Promise<Result<AnimeHomeDTO[]>> => {
    const response = await axiosInstance.get<Result<AnimeHomeDTO[]>>('/api/metadata/popular', {
      params: { limit },
    });
    return response.data;
  },

  getLatestList: async (limit?: number): Promise<Result<AnimeHomeDTO[]>> => {
    const response = await axiosInstance.get<Result<AnimeHomeDTO[]>>('/api/metadata/latest', {
      params: { limit },
    });
    return response.data;
  },

  getRecommendList: async (limit?: number): Promise<Result<AnimeHomeDTO[]>> => {
    const response = await axiosInstance.get<Result<AnimeHomeDTO[]>>('/api/metadata/recommend', {
      params: { limit },
    });
    return response.data;
  },

  getAnimeDetail: async (id: number): Promise<Result<AnimeDetailDTO>> => {
    const response = await axiosInstance.get<Result<AnimeDetailDTO>>(`/api/metadata/detail/${id}`);
    return response.data;
  },

  searchAnime: async (keyword: string, pageNum?: number, pageSize?: number): Promise<Result<PageResult<AnimeHomeDTO>>> => {
    const response = await axiosInstance.get<Result<PageResult<AnimeHomeDTO>>>('/api/metadata/search', {
      params: { keyword, pageNum, pageSize },
    });
    return response.data;
  },

  getAnimeByPlatform: async (query: AnimeQueryDTO): Promise<Result<PageResult<AnimeHomeDTO>>> => {
    const response = await axiosInstance.get<Result<PageResult<AnimeHomeDTO>>>('/api/metadata/list/by-platform', {
      params: query,
    });
    return response.data;
  },

  getAnimeByTag: async (query: AnimeQueryDTO): Promise<Result<PageResult<AnimeHomeDTO>>> => {
    const response = await axiosInstance.get<Result<PageResult<AnimeHomeDTO>>>('/api/metadata/list/by-tag', {
      params: query,
    });
    return response.data;
  },

  getAnimeByIds: async (ids: number[]): Promise<Result<AnimeHomeDTO[]>> => {
    const response = await axiosInstance.post<Result<AnimeHomeDTO[]>>('/api/metadata/list/ids', ids);
    return response.data;
  },

  getAnimePlay: async (id: number): Promise<Result<AnimeDetailDTO>> => {
    const response = await axiosInstance.get<Result<AnimeDetailDTO>>(`/api/metadata/play/${id}`);
    return response.data;
  },

  getAnimeSources: async (id: number): Promise<Result<PlaySourceDTO[]>> => {
    const response = await axiosInstanceLongTimeout.get<Result<PlaySourceDTO[]>>(`/api/metadata/play/${id}/sources`);
    return response.data;
  },

  updateWatchHistory: async (data: WatchHistoryUpdateDTO): Promise<Result<void>> => {
    const response = await axiosInstance.put<Result<void>>('/api/metadata/watch-history', data);
    return response.data;
  },

  deleteWatchHistory: async (metadataId: number, episodeIndex: number): Promise<Result<void>> => {
    const response = await axiosInstance.delete<Result<void>>(`/api/metadata/watch-history/${metadataId}/${episodeIndex}`);
    return response.data;
  },

  clearWatchHistory: async (): Promise<Result<void>> => {
    const response = await axiosInstance.delete<Result<void>>('/api/metadata/watch-history/clear');
    return response.data;
  },

  getWatchHistoryList: async (page?: number, pageSize?: number): Promise<Result<UserWatchHistoryDTO[]>> => {
    const response = await axiosInstance.get<Result<UserWatchHistoryDTO[]>>('/api/metadata/watch-history/list', {
      params: { page, pageSize },
    });
    return response.data;
  },

  getWatchProgress: async (metadataId: number, episodeIndex: number): Promise<Result<UserWatchHistoryDTO>> => {
    const response = await axiosInstance.get<Result<UserWatchHistoryDTO>>('/api/metadata/watch-history/progress', {
      params: { metadataId, episodeIndex },
    });
    return response.data;
  },

  addFavorite: async (data: FavoriteAddDTO): Promise<Result<void>> => {
    const response = await axiosInstance.post<Result<void>>('/api/metadata/favorite', data);
    return response.data;
  },

  getFavoriteDetail: async (metadataId: number): Promise<Result<UserFavoriteDTO>> => {
    const response = await axiosInstance.get<Result<UserFavoriteDTO>>(`/api/metadata/favorite/${metadataId}`);
    return response.data;
  },

  updateFavorite: async (metadataId: number, data: FavoriteUpdateDTO): Promise<Result<void>> => {
    const response = await axiosInstance.put<Result<void>>(`/api/metadata/favorite/${metadataId}`, data);
    return response.data;
  },

  deleteFavorite: async (metadataId: number): Promise<Result<void>> => {
    const response = await axiosInstance.delete<Result<void>>(`/api/metadata/favorite/${metadataId}`);
    return response.data;
  },

  checkFavorite: async (metadataId: number): Promise<Result<boolean>> => {
    const response = await axiosInstance.get<Result<boolean>>(`/api/metadata/favorite/check/${metadataId}`);
    return response.data;
  },

  getFavoriteList: async (page?: number, pageSize?: number): Promise<Result<UserFavoriteDTO[]>> => {
    const response = await axiosInstance.get<Result<UserFavoriteDTO[]>>('/api/metadata/favorite/list', {
      params: { page, pageSize },
    });
    return response.data;
  },

  getDanmakuList: async (videoId: number, episodeIndex: number): Promise<Result<DanmakuListDTO>> => {
    const response = await axiosInstance.get<Result<DanmakuListDTO>>(`/api/danmaku/list/${videoId}/${episodeIndex}`);
    return response.data;
  },

  getDanmakuListByRange: async (videoId: number, episodeIndex: number, startTime: number, endTime: number): Promise<Result<DanmakuMessageDTO[]>> => {
    const response = await axiosInstance.get<Result<DanmakuMessageDTO[]>>(`/api/danmaku/list/${videoId}/${episodeIndex}/range`, {
      params: { startTime, endTime },
    });
    return response.data;
  },

  sendDanmaku: async (data: DanmakuSendDTO): Promise<Result<DanmakuMessageDTO>> => {
    const response = await axiosInstance.post<Result<DanmakuMessageDTO>>('/api/danmaku/send', data);
    return response.data;
  },

  deleteDanmaku: async (danmakuId: number): Promise<Result<void>> => {
    const response = await axiosInstance.delete<Result<void>>(`/api/danmaku/${danmakuId}`);
    return response.data;
  },

  blockDanmakuUser: async (danmakuId: number): Promise<Result<void>> => {
    const response = await axiosInstance.post<Result<void>>(`/api/danmaku/block-user/${danmakuId}`);
    return response.data;
  },

  getMyDanmaku: async (page?: number, pageSize?: number): Promise<Result<DanmakuMessageDTO[]>> => {
    const response = await axiosInstance.get<Result<DanmakuMessageDTO[]>>('/api/danmaku/my', {
      params: { page, pageSize },
    });
    return response.data;
  },

  reportDanmaku: async (data: DanmakuReportDTO): Promise<Result<void>> => {
    const response = await axiosInstance.post<Result<void>>('/api/danmaku/report', data);
    return response.data;
  },

  blockUser: async (blockedUserId: number): Promise<Result<void>> => {
    const response = await axiosInstance.post<Result<void>>(`/api/danmaku/block/${blockedUserId}`);
    return response.data;
  },

  unblockUser: async (blockedUserId: number): Promise<Result<void>> => {
    const response = await axiosInstance.delete<Result<void>>(`/api/danmaku/block/${blockedUserId}`);
    return response.data;
  },

  checkBlockedUser: async (blockedUserId: number): Promise<Result<boolean>> => {
    const response = await axiosInstance.get<Result<boolean>>(`/api/danmaku/block/check/${blockedUserId}`);
    return response.data;
  },

  getBlockedList: async (): Promise<Result<number[]>> => {
    const response = await axiosInstance.get<Result<number[]>>('/api/danmaku/block/list');
    return response.data;
  },
};