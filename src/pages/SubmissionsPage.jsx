import React, { useState, useEffect } from 'react';
import { rtdb } from '../config/firebase';
import { ref, onValue } from 'firebase/database';
import SubmissionAnalytics from '../components/SubmissionAnalytics';
import BuildDeployment from '../components/BuildDeployment';
import { FileCheck, Download, Folder, FileCode2, Loader2 } from 'lucide-react';

const TABS = ['home', 'about', 'participate', 'register', 'schedule'];

export default function SubmissionsPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [tabData, setTabData] = useState([]);
  const [loading, setLoading] = useState(true);

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
    if (!tabData || tabData.length === 0) return;
    
    try {
      // Ask user to select a directory to save all files
      const dirHandle = await window.showDirectoryPicker({
        mode: 'readwrite',
      });
      
      let successCount = 0;
      for (let i = 0; i < tabData.length; i++) {
        const file = tabData[i];
        if (file.r2Url) {
          const fileName = file.fileName || file.name || `file-${i}.zip`;
          try {
            const response = await fetch(file.r2Url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const blob = await response.blob();
            
            const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();
            successCount++;
          } catch (err) {
            console.error('Fetch/write failed for ' + fileName, err);
            // Fallback for CORS or other fetch issues
            const a = document.createElement('a');
            a.href = file.r2Url;
            a.download = fileName;
            a.target = '_blank';
            a.click();
          }
        }
      }
      if (successCount > 0) {
        alert(`Successfully downloaded ${successCount} files to your chosen folder!`);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Directory picker failed:', err);
        // Fallback to standard automatic download
        tabData.forEach((file, index) => {
          if (file.r2Url) {
            setTimeout(() => {
              const a = document.createElement('a');
              a.href = file.r2Url;
              a.download = file.fileName || file.name || `file-${index}.zip`;
              a.target = '_blank';
              a.click();
            }, index * 300);
          }
        });
      }
    }
  };

  const downloadSingleFile = async (file, index) => {
    const fileName = file.fileName || file.name || `file-${index}.zip`;
    try {
      if (window.showSaveFilePicker) {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: fileName,
        });
        const response = await fetch(file.r2Url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
      } else {
        throw new Error('showSaveFilePicker not supported');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Single download failed:', err);
        // Fallback to normal download
        const a = document.createElement('a');
        a.href = file.r2Url;
        a.download = fileName;
        a.target = '_blank';
        a.click();
      }
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                  activeTab === tab 
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
            disabled={loading || tabData.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              tabData.length > 0
                ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 border border-indigo-500/30'
                : 'bg-slate-800/40 text-slate-500 cursor-not-allowed border border-slate-800/50'
            }`}
          >
            <Download className="w-4 h-4" />
            Download All {activeTab} Files
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
            {tabData.map((file, idx) => (
              <div key={file.id || idx} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/60 transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-slate-900/50 rounded-lg text-emerald-400">
                    <FileCode2 className="w-5 h-5" />
                  </div>
                  <button 
                    onClick={() => downloadSingleFile(file, idx)}
                    className="p-1.5 bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Download individual file"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="text-sm font-medium text-slate-200 truncate mb-1">
                  {file.fileName || file.name || `file-${idx + 1}`}
                </h4>
                <p className="text-xs text-slate-500 truncate" title={file.r2Url}>
                  {file.r2Url}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <SubmissionAnalytics />
      <BuildDeployment />
    </div>
  );
}
