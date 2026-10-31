import React, { useState } from 'react';
import { X, Database, Check, RefreshCw, UploadCloud, DownloadCloud, AlertTriangle, ExternalLink } from 'lucide-react';
import { 
  getSupabaseCredentials, 
  saveCustomSupabaseCredentials, 
  clearCustomSupabaseCredentials 
} from '../../lib/supabaseClient';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncPush: () => Promise<void>;
  onSyncPull: () => Promise<void>;
  isSyncing: boolean;
  lastSyncedAt: string | null;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onSyncPush,
  onSyncPull,
  isSyncing,
  lastSyncedAt,
}) => {
  if (!isOpen) return null;

  const currentCreds = getSupabaseCredentials();
  const [url, setUrl] = useState<string>(currentCreds.url);
  const [anonKey, setAnonKey] = useState<string>(currentCreds.anonKey);
  const [saveMessage, setSaveMessage] = useState<string>('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && anonKey.trim()) {
      saveCustomSupabaseCredentials(url, anonKey);
      setSaveMessage('Credentials saved successfully! Reloading connection...');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  const handleClear = () => {
    clearCustomSupabaseCredentials();
    setUrl('');
    setAnonKey('');
    setSaveMessage('Cleared custom credentials. Falling back to environment or local storage.');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Glow header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />

        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              Supabase Database Configuration & Sync
            </h3>
            <p className="text-xs text-slate-400">
              PostgreSQL database persistence for pods, employees, brands, rules & overrides
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status banner */}
        <div className={`p-3.5 rounded-xl border mb-4 flex items-start gap-3 ${
          currentCreds.isConfigured 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}>
          {currentCreds.isConfigured ? (
            <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs leading-relaxed">
            <span className="font-semibold">
              {currentCreds.isConfigured ? 'Supabase Connected & Active' : 'Offline / Local Persistence Mode Active'}
            </span>
            <p className="text-slate-300 text-[11px] mt-0.5">
              {currentCreds.isConfigured 
                ? `Connected to: ${currentCreds.url}` 
                : 'The application operates with full in-memory and local storage persistence. You can connect your Supabase project at any time below or via .env.'}
            </p>
            {lastSyncedAt && (
              <p className="text-[10px] text-slate-400 mt-1">
                Last synchronized: {new Date(lastSyncedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Database Sync Actions */}
        {currentCreds.isConfigured && (
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              onClick={onSyncPush}
              disabled={isSyncing}
              className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left transition flex items-center gap-3 disabled:opacity-50"
            >
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Seed / Push to Supabase</div>
                <div className="text-[10px] text-slate-400">Push all 32 agents & 12 brands to SQL</div>
              </div>
            </button>

            <button
              onClick={onSyncPull}
              disabled={isSyncing}
              className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left transition flex items-center gap-3 disabled:opacity-50"
            >
              <div className="p-2 bg-sky-500/20 text-sky-400 rounded-lg">
                <DownloadCloud className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Pull Latest from Supabase</div>
                <div className="text-[10px] text-slate-400">Fetch latest database tables</div>
              </div>
            </button>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Project URL (<code className="text-sky-400">https://xyz.supabase.co</code>)
            </label>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Anon / Public API Key
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={e => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {saveMessage && (
            <div className="p-2 text-xs text-emerald-300 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              {saveMessage}
            </div>
          )}

          <div className="text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="font-semibold text-slate-300">Quick Setup Instructions:</span>
            <p>1. Run the provided <code className="text-emerald-400">supabase_schema.sql</code> script in the Supabase SQL Editor.</p>
            <p>2. Paste your project URL and public anon key above or into <code className="text-sky-400">.env</code>.</p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            {currentCreds.isConfigured ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-400 hover:text-rose-300 transition"
              >
                Disconnect & Use Local Mode
              </button>
            ) : <span />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
