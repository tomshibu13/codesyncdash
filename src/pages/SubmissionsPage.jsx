import React, { useState, useEffect } from 'react';
import { rtdb } from '../config/firebase';
import { ref, onValue } from 'firebase/database';
import SubmissionAnalytics from '../components/SubmissionAnalytics';
import BuildDeployment from '../components/BuildDeployment';
import { FileCheck, Download, Folder, FileCode2, Loader2 } from 'lucide-react';

const TABS = ['home', 'about', 'participate', 'register', 'schedule'];

// Helper to fetch file as Blob, trying serverless API proxy first, direct fetch, then CORS proxies
const fetchFileAsBlob = async (url, filename) => {
  // 1. Try serverless / dev API proxy route (most reliable, bypasses CORS)
  try {
    const proxyApiUrl = `/api/proxy?url=${encodeURIComponent(url)}${filename ? `&filename=${encodeURIComponent(filename)}` : ''}`;
    const res = await fetch(proxyApiUrl);
    if (res.ok) {
      return await res.blob();
    }
  } catch (e) {
    console.warn('API proxy fetch failed, trying direct fetch...', e);
  }

  // 2. Try direct fetch
  try {
    const res = await fetch(url);
    if (res.ok) {
      return await res.blob();
    }
  } catch (e) {
    console.warn('Direct fetch failed, trying corsproxy.io fallback...', e);
  }

  // 3. Fallback to corsproxy.io
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      return await res.blob();
    }
  } catch (e) {
    console.warn('corsproxy.io proxy failed, trying allorigins...', e);
  }

  // 4. Fallback to api.allorigins.win
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      return await res.blob();
    }
  } catch (e) {
    console.warn('Allorigins proxy failed...', e);
  }

  throw new Error('Unable to fetch file content via direct request or proxies.');
};

// Helper to derive a clean suggested filename
const getFileName = (file, index) => {
  let name = file.fileName || file.originalName || file.name;
  if (!name && file.r2Url) {
    try {
      const urlPath = new URL(file.r2Url).pathname;
      const parts = urlPath.split('/');
      name = parts[parts.length - 1];
    } catch (e) {
      // ignore
    }
  }
  if (!name || name === `file-${file.id}` || name.startsWith('file-')) {
    const ext = file.r2Url?.endsWith('.zip') ? '.zip' : '';
    name = `submission-${file.id || index + 1}${ext || '.zip'}`;
  }
  return name;
};

export default function SubmissionsPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [tabData, setTabData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  useEffect(() => {
    if (!rtdb) return;
    const submissionRef = ref(rtdb, `submissions/${activeTab}`);

    setLoading(true);
    const unsubscribe = onValue(submissionRef, (snapshot) => {
      const data = snapshot.val() || {};
      console.log(`Fetched data for tab ${activeTab}:`, data);

      const files = [];
      Object.entries(data).forEach(([key, item]) => {
        if (!item) return;
        if (typeof item === 'string') {
          files.push({ id: key, r2Url: item, fileName: `file-${key}` });
        } else if (typeof item === 'object') {
          let r2Url = item.r2Url || item.fileUrl || item.url;
          if (!r2Url) {
            for (const val of Object.values(item)) {
              if (typeof val === 'string' && (val.includes('r2.dev') || val.includes('r2') || val.startsWith('http'))) {
                r2Url = val;
                break;
              }
            }
          }
          if (r2Url) {
            files.push({ id: key, ...item, r2Url });
          }
        }
      });
      setTabData(files);
      setLoading(false);
    }, (error) => {
      console.error(`Error fetching data for ${activeTab}:`, error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeTab]);

  const downloadAllR2Files = async () => {
    if (!tabData || tabData.length === 0 || isDownloadingAll) return;

    setIsDownloadingAll(true);
    try {
      // Check if showDirectoryPicker is supported and allowed
      if ('showDirectoryPicker' in window) {
        let dirHandle = null;
        try {
          dirHandle = await window.showDirectoryPicker({
            mode: 'readwrite',
          });
        } catch (err) {
          if (err.name === 'AbortError') {
            setIsDownloadingAll(false);
            return;
          }
          console.warn('showDirectoryPicker unavailable or blocked, using sequential download fallback:', err);
        }

        if (dirHandle) {
          let successCount = 0;
          let failCount = 0;

          for (let i = 0; i < tabData.length; i++) {
            const file = tabData[i];
            if (file.r2Url) {
              const fileName = getFileName(file, i);
              try {
                const blob = await fetchFileAsBlob(file.r2Url, fileName);
                const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
                const writable = await fileHandle.createWritable();
                await writable.write(blob);
                await writable.close();
                successCount++;
              } catch (err) {
                console.error(`Failed to download ${fileName}:`, err);
                failCount++;
              }
            }
          }

          if (successCount > 0) {
            alert(`Successfully saved ${successCount} file(s) to your selected directory!${failCount > 0 ? ` (${failCount} failed)` : ''}`);
            return;
          }
        }
      }

      // Fallback for browsers without showDirectoryPicker or if dirHandle failed
      let successCount = 0;
      for (let i = 0; i < tabData.length; i++) {
        const file = tabData[i];
        if (file.r2Url) {
          const fileName = getFileName(file, i);
          try {
            const blob = await fetchFileAsBlob(file.r2Url, fileName);
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
            successCount++;
            await new Promise(r => setTimeout(r, 400));
          } catch (err) {
            console.error(`Fallback download failed for ${fileName}, initiating direct proxy link:`, err);
            const proxyDownloadUrl = `/api/proxy?url=${encodeURIComponent(file.r2Url)}&filename=${encodeURIComponent(fileName)}`;
            const a = document.createElement('a');
            a.href = proxyDownloadUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        }
      }
      if (successCount > 0) {
        alert(`Started downloading ${successCount} files! Check your downloads.`);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Directory download failed:', err);
        alert(`Directory save failed: ${err.message}`);
      }
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const downloadSingleFile = async (file, index) => {
    const fileId = file.id || index;
    if (downloadingId === fileId) return;

    setDownloadingId(fileId);
    const fileName = getFileName(file, index);

    try {
      // Step 1: Attempt to fetch file as Blob via proxy/direct/CORS proxies
      let blob;
      try {
        blob = await fetchFileAsBlob(file.r2Url, fileName);
      } catch (err) {
        console.warn('Blob fetch failed, falling back to serverless proxy URL download:', err);
        // Fallback: direct download link via serverless proxy
        const proxyDownloadUrl = `/api/proxy?url=${encodeURIComponent(file.r2Url)}&filename=${encodeURIComponent(fileName)}`;
        const a = document.createElement('a');
        a.href = proxyDownloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      // Step 2: Use window.showSaveFilePicker if available
      if ('showSaveFilePicker' in window) {
        try {
          const fileHandle = await window.showSaveFilePicker({
            suggestedName: fileName,
          });
          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
          return;
        } catch (err) {
          if (err.name === 'AbortError') {
            return;
          }
          console.warn('showSaveFilePicker error, falling back to same-origin Blob URL:', err);
        }
      }

      // Step 3: Fallback using same-origin Blob URL
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch (err) {
      console.error('Single file download failed:', err);
      alert(`Failed to download file "${fileName}": ${err.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
          <FileCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Submissions & Code Evaluation</h1>
          <p className="text-xs text-slate-400">Pushed repositories, submission timelines, and deployment previews</p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${activeTab === tab
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={downloadAllR2Files}
            disabled={loading || tabData.length === 0 || isDownloadingAll}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${tabData.length > 0 && !isDownloadingAll
              ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 border border-indigo-500/30'
              : 'bg-slate-800/40 text-slate-500 cursor-not-allowed border border-slate-800/50'
              }`}
          >
            {isDownloadingAll ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isDownloadingAll ? `Downloading All ${activeTab} Files...` : `Download All ${activeTab} Files`}
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
            <p className="text-slate-400 text-sm">Loading files for {activeTab}...</p>
          </div>
        ) : tabData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4 text-slate-500 border border-slate-700/50">
              <Folder className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-slate-300 mb-1">No files found</h3>
            <p className="text-slate-500 text-sm max-w-sm">There are no submission files available in the {activeTab} folder.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tabData.map((file, idx) => {
              const isDownloadingThis = downloadingId === (file.id || idx);
              return (
                <div key={file.id || idx} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/60 transition-colors group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-slate-900/50 rounded-lg text-emerald-400">
                      <FileCode2 className="w-5 h-5" />
                    </div>
                    <button
                      onClick={() => downloadSingleFile(file, idx)}
                      disabled={isDownloadingThis}
                      className={`p-1.5 bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors ${isDownloadingThis ? 'opacity-100 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      title="Download individual file"
                    >
                      {isDownloadingThis ? (
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <h4 className="text-sm font-medium text-slate-200 truncate mb-1">
                    {file.fileName || file.name || `file-${idx + 1}`}
                  </h4>
                  <p className="text-xs text-slate-500 truncate" title={file.r2Url}>
                    {file.r2Url}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <SubmissionAnalytics />
      <BuildDeployment />
    </div>
  );
}
