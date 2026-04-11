import axiosInstance from '../utils/api';
import { Result } from '../types/auth';
import { AnimeHomeDTO, AnimeDetailDTO, AnimeQueryDTO, PageResult } from '../types/anime';

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
};