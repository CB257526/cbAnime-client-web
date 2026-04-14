import { useState, useEffect } from 'react';
import { DanmakuType, REPORT_TYPE_LABELS, DanmakuMessageDTO } from '../types/anime';
import { VideoPlayerRef } from './VideoPlayer';
import { animeApi } from '../api/anime';
import { authStorage } from '../utils/authStorage';

interface DanmakuInputProps {
  videoId: number;
  episodeIndex: number;
  videoRef: React.RefObject<VideoPlayerRef | null>;
  onSendSuccess: (danmaku: DanmakuMessageDTO) => void;
}

const PRESET_COLORS = [
  '#ffffff',
  '#ff6b9d',
  '#ffa726',
  '#ffeb3b',
  '#66bb6a',
  '#42a5f5',
  '#ab47bc',
  '#ff7043',
];

export function DanmakuInput({
  videoId,
  episodeIndex,
  videoRef,
  onSendSuccess,
}: DanmakuInputProps) {
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [danmakuType, setDanmakuType] = useState<DanmakuType>(0);
  const [isSending, setIsSending] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState<DanmakuMessageDTO | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportType, setReportType] = useState<0 | 1 | 2 | 3>(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const player = videoRef.current;
    if (!player) return;
    const video = player.getVideoElement ? player.getVideoElement() : null;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [videoRef]);

  const handleSend = async () => {
    if (!content.trim() || !authStorage.isAuthenticated()) return;

    setIsSending(true);
    try {
      const result = await animeApi.sendDanmaku({
        videoId,
        episodeIndex,
        content: content.trim(),
        color,
        danmakuType,
        timePosition: currentTime,
      });

      if (result.success && result.data) {
        onSendSuccess(result.data);
        setContent('');
      }
    } catch (error) {
      console.error('发送弹幕失败', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReport = async () => {
    if (!reportTarget || !reportReason.trim()) return;

    try {
      await animeApi.reportDanmaku({
        danmakuId: reportTarget.id,
        reportReason: reportReason.trim(),
        reportType,
      });
      setShowReportModal(false);
      setReportTarget(null);
      setReportReason('');
      setReportType(0);
    } catch (error) {
      console.error('举报失败', error);
    }
  };

  return (
    <>
      <div className="bg-[#1a1a2e]/95 backdrop-blur-sm rounded-xl p-4 border border-[#ff6b9d]/20">
        {!authStorage.isAuthenticated() ? (
          <div className="text-center py-4 text-white/60">
            <p>登录后即可发送弹幕</p>
          </div>
        ) : (
          <>
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="发送弹幕..."
                maxLength={100}
                disabled={isSending}
                className="flex-1 bg-[#0d0d1a] border border-[#ff6b9d]/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#ff6b9d]/50 transition-colors disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!content.trim() || isSending}
                className="px-6 py-2 bg-gradient-to-r from-[#ff6b9d] to-[#ffa726] text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? '发送中...' : '发送'}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">颜色:</span>
                <div className="flex gap-1">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                        color === c ? 'border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-6 h-6 rounded-full cursor-pointer bg-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">类型:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setDanmakuType(0)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      danmakuType === 0
                        ? 'bg-[#ff6b9d] text-white'
                        : 'bg-[#0d0d1a] text-white/60 hover:bg-[#ff6b9d]/20'
                    }`}
                  >
                    滚动
                  </button>
                  <button
                    onClick={() => setDanmakuType(1)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      danmakuType === 1
                        ? 'bg-[#ff6b9d] text-white'
                        : 'bg-[#0d0d1a] text-white/60 hover:bg-[#ff6b9d]/20'
                    }`}
                  >
                    顶部
                  </button>
                  <button
                    onClick={() => setDanmakuType(2)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      danmakuType === 2
                        ? 'bg-[#ff6b9d] text-white'
                        : 'bg-[#0d0d1a] text-white/60 hover:bg-[#ff6b9d]/20'
                    }`}
                  >
                    底部
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {showReportModal && reportTarget && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowReportModal(false)}>
          <div className="bg-[#1a1a2e] rounded-xl p-6 w-full max-w-md border border-[#ff6b9d]/30" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-medium text-white mb-4">举报弹幕</h3>
            <div className="mb-4">
              <p className="text-white/60 text-sm mb-2">弹幕内容：{reportTarget.content}</p>
              <p className="text-white/60 text-sm">发送者：{reportTarget.userNickname}</p>
            </div>
            <div className="mb-4">
              <label className="block text-white/60 text-sm mb-2">举报类型</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(REPORT_TYPE_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setReportType(Number(key) as 0 | 1 | 2 | 3)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      reportType === Number(key)
                        ? 'bg-[#ff6b9d] text-white'
                        : 'bg-[#0d0d1a] text-white/60 hover:bg-[#ff6b9d]/20'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-white/60 text-sm mb-2">举报原因</label>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="请详细描述举报原因..."
                rows={3}
                className="w-full bg-[#0d0d1a] border border-[#ff6b9d]/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#ff6b9d]/50"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-4 py-2 bg-[#0d0d1a] text-white/60 rounded-lg hover:bg-[#0d0d1a]/80 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason.trim()}
                className="flex-1 px-4 py-2 bg-[#ff6b9d] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                提交举报
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
