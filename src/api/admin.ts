import axiosInstance from '../utils/api';
import { Result } from '../types/auth';

export interface FeedbackResponseDTO {
  id: number;
  metadataId: number;
  animeName: string;
  animeNameCn: string;
  userId: number;
  feedbackContent: string;
  feedbackTime: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  adminNotes: string;
  collectorId: string;
  collectorAnimeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackListResponse {
  list: FeedbackResponseDTO[];
  total: number;
  pageNum: number;
  pageSize: number;
  pages: number;
}

export interface FeedbackListQueryDTO {
  pageNum?: number;
  pageSize?: number;
  status?: 'pending' | 'processing' | 'completed' | 'rejected';
  orderBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface AdminRecommendDTO {
  animeIds: number[];
  position?: string;
}

export const adminApi = {
  getFeedbackList: async (params: FeedbackListQueryDTO): Promise<Result<FeedbackListResponse>> => {
    const response = await axiosInstance.get<Result<FeedbackListResponse>>('/api/feedback/admin/list', { params });
    return response.data;
  },

  getFeedbackDetail: async (id: number): Promise<Result<FeedbackResponseDTO>> => {
    const response = await axiosInstance.get<Result<FeedbackResponseDTO>>(`/api/feedback/admin/detail/${id}`);
    return response.data;
  },

  deleteFeedback: async (id: number): Promise<Result> => {
    const response = await axiosInstance.delete<Result>(`/api/feedback/admin/${id}`);
    return response.data;
  },

  getRecommendList: async (): Promise<Result<any[]>> => {
    const response = await axiosInstance.get<Result<any[]>>('/api/metadata/recommend/admin');
    return response.data;
  },

  setRecommendList: async (data: AdminRecommendDTO): Promise<Result> => {
    const response = await axiosInstance.post<Result>('/api/metadata/admin/recommend', data);
    return response.data;
  },
};
