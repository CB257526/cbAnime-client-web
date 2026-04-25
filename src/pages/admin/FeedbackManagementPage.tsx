import { useEffect, useState } from 'react';
import { adminApi, FeedbackResponseDTO, FeedbackListQueryDTO } from '../../api/admin';
import { AxiosError } from 'axios';
import { Result } from '../../types/auth';

export function FeedbackManagementPage() {
  const [feedbackList, setFeedbackList] = useState<FeedbackResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackResponseDTO | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const statusOptions = [
    { value: 'all', label: '全部', color: 'bg-[#ff6b8a] text-white' },
    { value: 'pending', label: '待处理', color: 'bg-[#ffa726]/20 text-[#ffa726]' },
    { value: 'processing', label: '处理中', color: 'bg-[#42a5f5]/20 text-[#42a5f5]' },
    { value: 'completed', label: '已完成', color: 'bg-[#66bb6a]/20 text-[#66bb6a]' },
    { value: 'rejected', label: '已拒绝', color: 'bg-[#ff4757]/20 text-[#ff4757]' },
  ];

  useEffect(() => { loadFeedbackList(); }, [currentPage, selectedStatus]);

  const loadFeedbackList = async () => {
    setLoading(true);
    try {
      const params: FeedbackListQueryDTO = { pageNum: currentPage, pageSize, orderBy: 'created_at', sortDir: 'desc' };
      if (selectedStatus !== 'all') params.status = selectedStatus as any;
      const response = await adminApi.getFeedbackList(params);
      if (response.success && response.data) { setFeedbackList(response.data.list); setTotal(response.data.total); }
    } catch { console.error('Failed to load feedback list:'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除这条反馈记录吗？')) return;
    setDeletingId(id);
    try {
      const response = await adminApi.deleteFeedback(id);
      if (response.success) { loadFeedbackList(); } else { alert(response.message || '删除失败'); }
    } catch (error) { const axiosError = error as AxiosError<Result>; alert(axiosError.response?.data?.message || '删除失败'); }
    finally { setDeletingId(null); }
  };

  const handleViewDetail = async (id: number) => {
    try { const response = await adminApi.getFeedbackDetail(id); if (response.success && response.data) { setSelectedFeedback(response.data); setShowDetailModal(true); } }
    catch { alert('加载反馈详情失败'); }
  };

  const getStatusBadge = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return <span className={`px-2 py-1 rounded-lg text-xs font-medium ${option?.color || 'bg-gray-100 text-gray-600'}`}>{option?.label || status}</span>;
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">
      <div><h1 className="text-xl font-bold text-gray-800 mb-1">反馈管理</h1><p className="text-gray-400 text-sm">查看和处理用户提交的反馈信息</p></div>

      <div className="flex gap-2 flex-wrap">
        {statusOptions.map((option) => (
          <button key={option.value} onClick={() => { setSelectedStatus(option.value); setCurrentPage(1); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${selectedStatus === option.value ? option.color : 'bg-white/60 text-gray-500 hover:bg-[#ff6b8a]/10 hover:text-[#ff6b8a] border border-[#ff6b8a]/10'}`}>{option.label}</button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64"><div className="w-12 h-12 rounded-full border-4 border-[#ff6b8a]/30 border-t-[#ff6b8a] animate-spin" /></div>
        ) : feedbackList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <p>暂无反馈记录</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#ff6b8a]/5">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400">ID</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400">动漫名称</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400">反馈内容</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400">状态</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400">反馈时间</th>
                    <th className="px-5 py-3 text-right text-xs font-medium text-gray-400">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ff6b8a]/5">
                  {feedbackList.map((feedback) => (
                    <tr key={feedback.id} className="hover:bg-[#ff6b8a]/5 transition-colors">
                      <td className="px-5 py-3 text-sm text-gray-600">#{feedback.id}</td>
                      <td className="px-5 py-3 text-sm text-gray-800">
                        <div className="flex flex-col"><span>{feedback.animeNameCn || feedback.animeName}</span>{feedback.animeNameCn && feedback.animeName && <span className="text-xs text-gray-400">{feedback.animeName}</span>}</div>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500 max-w-xs truncate">{feedback.feedbackContent}</td>
                      <td className="px-5 py-3 text-sm">{getStatusBadge(feedback.status)}</td>
                      <td className="px-5 py-3 text-sm text-gray-400">{new Date(feedback.feedbackTime).toLocaleString('zh-CN')}</td>
                      <td className="px-5 py-3 text-sm text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleViewDetail(feedback.id)} className="text-[#42a5f5] hover:text-[#64b5f6] transition-colors text-xs">详情</button>
                          <button onClick={() => handleDelete(feedback.id)} disabled={deletingId === feedback.id} className="text-[#ff4757] hover:text-[#ff6b8a] transition-colors disabled:opacity-50 text-xs">{deletingId === feedback.id ? '删除中...' : '删除'}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#ff6b8a]/10">
              <p className="text-sm text-gray-400">共 {total} 条记录，第 {currentPage} / {totalPages} 页</p>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-lg bg-white/60 text-gray-600 text-sm hover:bg-[#ff6b8a]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">上一页</button>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-lg bg-white/60 text-gray-600 text-sm hover:bg-[#ff6b8a]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">下一页</button>
              </div>
            </div>
          </>
        )}
      </div>

      {showDetailModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-5 border-b border-[#ff6b8a]/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">反馈详情</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-gray-400 text-xs mb-0.5">反馈 ID</p><p className="text-gray-700 font-medium">#{selectedFeedback.id}</p></div>
                <div><p className="text-gray-400 text-xs mb-0.5">状态</p>{getStatusBadge(selectedFeedback.status)}</div>
              </div>
              <div><p className="text-gray-400 text-xs mb-0.5">动漫名称</p><p className="text-gray-700">{selectedFeedback.animeNameCn}{selectedFeedback.animeName && <span className="text-gray-400 ml-2">({selectedFeedback.animeName})</span>}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">反馈内容</p><p className="text-gray-700 bg-[#ff6b8a]/5 rounded-xl p-3">{selectedFeedback.feedbackContent}</p></div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-gray-400 text-xs mb-0.5">反馈时间</p><p className="text-gray-700">{new Date(selectedFeedback.feedbackTime).toLocaleString('zh-CN')}</p></div>
                <div><p className="text-gray-400 text-xs mb-0.5">创建时间</p><p className="text-gray-700">{new Date(selectedFeedback.createdAt).toLocaleString('zh-CN')}</p></div>
              </div>
              {selectedFeedback.adminNotes && <div><p className="text-gray-400 text-xs mb-0.5">管理员备注</p><p className="text-gray-700 bg-[#ff6b8a]/5 rounded-xl p-3">{selectedFeedback.adminNotes}</p></div>}
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-gray-400 text-xs mb-0.5">采集站标识</p><p className="text-gray-700 font-mono text-xs">{selectedFeedback.collectorId || '-'}</p></div>
                <div><p className="text-gray-400 text-xs mb-0.5">采集站动漫 ID</p><p className="text-gray-700 font-mono text-xs">{selectedFeedback.collectorAnimeId || '-'}</p></div>
              </div>
            </div>
            <div className="p-5 border-t border-[#ff6b8a]/10 flex justify-end gap-3">
              <button onClick={() => setShowDetailModal(false)} className="px-5 py-2 rounded-xl bg-white/60 text-gray-600 hover:bg-white/80 transition-colors text-sm">关闭</button>
              <button onClick={() => { setShowDetailModal(false); handleDelete(selectedFeedback.id); }} disabled={deletingId === selectedFeedback.id} className="px-5 py-2 rounded-xl bg-[#ff4757] text-white hover:bg-[#ff6b8a] transition-colors disabled:opacity-50 text-sm">{deletingId === selectedFeedback.id ? '删除中...' : '删除'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
