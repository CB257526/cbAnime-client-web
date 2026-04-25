import { useState } from 'react';
import { animeApi } from '../api/anime';
import { AutoPlayImportResultDTO } from '../types/anime';

interface ImportConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportConfigModal({ isOpen, onClose }: ImportConfigModalProps) {
  const [importMode, setImportMode] = useState<'json' | 'file'>('json');
  const [jsonText, setJsonText] = useState('');
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<AutoPlayImportResultDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setJsonText('');
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setJsonText(text);
    };
    reader.onerror = () => {
      setError('文件读取失败');
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!jsonText.trim()) {
      setError('请输入JSON内容或上传文件');
      return;
    }

    try {
      JSON.parse(jsonText);
    } catch {
      setError('JSON格式错误，请检查内容');
      return;
    }

    setImporting(true);
    setError(null);
    setResult(null);

    try {
      const response = await animeApi.importJsonConfig(jsonText);
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.message || '导入失败');
      }
    } catch {
      setError('网络错误，请检查网络连接');
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setJsonText('');
    setFileName('');
    setError(null);
    setResult(null);
    setImportMode('json');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative card w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#ff6b8a]/10">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#ff6b8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            导入配置
          </h3>
          <button onClick={handleClose} className="w-8 h-8 rounded-full hover:bg-[#ff6b8a]/10 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Mode Switch */}
          <div className="flex items-center gap-2">
            <button onClick={() => { setImportMode('json'); setJsonText(''); setFileName(''); }} className={`px-4 py-2 text-sm rounded-xl transition-all ${importMode === 'json' ? 'bg-[#ff6b8a] text-white font-semibold' : 'bg-white/60 text-gray-500 hover:bg-[#ff6b8a]/10'}`}>
              JSON文本
            </button>
            <button onClick={() => { setImportMode('file'); setJsonText(''); setFileName(''); }} className={`px-4 py-2 text-sm rounded-xl transition-all ${importMode === 'file' ? 'bg-[#ff6b8a] text-white font-semibold' : 'bg-white/60 text-gray-500 hover:bg-[#ff6b8a]/10'}`}>
              上传文件
            </button>
          </div>

          {/* JSON Text Input */}
          {importMode === 'json' && (
            <div>
              <label className="block text-xs text-gray-500 font-semibold mb-2">粘贴JSON内容</label>
              <textarea
                value={jsonText}
                onChange={(e) => { setJsonText(e.target.value); setError(null); setResult(null); }}
                placeholder='粘贴JSON配置内容...'
                className="w-full h-48 p-3 bg-white/60 border border-[#ff6b8a]/20 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#ff6b8a]/50 focus:bg-white/80 transition-all resize-none font-mono"
              />
            </div>
          )}

          {/* File Upload */}
          {importMode === 'file' && (
            <div>
              <label className="block text-xs text-gray-500 font-semibold mb-2">上传JSON文件</label>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#ff6b8a]/30 rounded-xl cursor-pointer hover:border-[#ff6b8a]/60 hover:bg-[#ff6b8a]/5 transition-all"
                >
                  {fileName ? (
                    <>
                      <svg className="w-8 h-8 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-sm text-gray-700 font-medium">{fileName}</span>
                      <span className="text-xs text-gray-400 mt-1">点击更换文件</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                      <span className="text-sm text-gray-500">点击上传JSON文件</span>
                      <span className="text-xs text-gray-400 mt-1">支持 .json 格式</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-500 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                {error}
              </p>
            </div>
          )}

          {/* Success Result */}
          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                <span className="font-semibold text-green-700">导入完成</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="text-center p-2 bg-white/80 rounded-lg">
                  <div className="text-lg font-bold text-gray-700">{result.total}</div>
                  <div className="text-xs text-gray-400">总计</div>
                </div>
                <div className="text-center p-2 bg-green-100 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{result.imported}</div>
                  <div className="text-xs text-green-500">成功导入</div>
                </div>
                <div className="text-center p-2 bg-yellow-100 rounded-lg">
                  <div className="text-lg font-bold text-yellow-600">{result.skipped}</div>
                  <div className="text-xs text-yellow-500">跳过</div>
                </div>
                <div className="text-center p-2 bg-red-100 rounded-lg">
                  <div className="text-lg font-bold text-red-500">{result.failed}</div>
                  <div className="text-xs text-red-400">失败</div>
                </div>
              </div>
              {result.details.length > 0 && (
                <div>
                  <span className="text-xs text-gray-500 font-semibold">详细信息</span>
                  <div className="mt-1.5 max-h-32 overflow-y-auto space-y-1">
                    {result.details.map((detail, index) => (
                      <p key={index} className="text-xs text-gray-600 bg-white/60 px-2 py-1 rounded">{detail}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-[#ff6b8a]/10">
          <button onClick={handleClose} className="px-5 py-2 text-sm text-gray-500 bg-white/60 hover:bg-white/80 rounded-xl transition-colors">
            关闭
          </button>
          <button
            onClick={handleImport}
            disabled={importing || !jsonText.trim()}
            className={`px-5 py-2 text-sm rounded-xl font-semibold transition-all flex items-center gap-2 ${
              importing || !jsonText.trim()
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#ff6b8a] text-white hover:bg-[#ff5070]'
            }`}
          >
            {importing ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                导入中...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                导入配置
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
