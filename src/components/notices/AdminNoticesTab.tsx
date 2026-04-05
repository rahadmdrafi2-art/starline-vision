import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Plus, Pencil, Trash2, Eye, EyeOff, Pin, PinOff, Copy, Archive,
  ChevronDown, X, ExternalLink, Search, AlertTriangle, Info, Monitor, LayoutGrid
} from 'lucide-react';
import { mockNotices } from '@/data/mockNotices';
import {
  type Notice, type NoticeFormData, type NoticeType, type NoticePriority, type NoticeStatus,
  emptyNoticeForm, noticeTypes, noticeTypeConfig, noticePriorityConfig,
  formatNoticeDateTime, isNoticeActive, sortNotices,
} from '@/types/notices';
import { Link } from 'react-router-dom';

type AdminView = 'list' | 'create' | 'edit' | 'preview';

export default function AdminNoticesTab() {
  const [notices, setNotices] = useState<Notice[]>(sortNotices(mockNotices));
  const [view, setView] = useState<AdminView>('list');
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [form, setForm] = useState<NoticeFormData>(emptyNoticeForm);
  const [search, setSearch] = useState('');
  const [previewMode, setPreviewMode] = useState<'bar' | 'card'>('bar');

  const filtered = useMemo(() => {
    if (!search) return notices;
    const q = search.toLowerCase();
    return notices.filter(n =>
      n.title.toLowerCase().includes(q) || n.short_message.toLowerCase().includes(q)
    );
  }, [notices, search]);

  const updateField = <K extends keyof NoticeFormData>(key: K, value: NoticeFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleCreate = () => {
    setForm(emptyNoticeForm);
    setEditingNotice(null);
    setView('create');
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setForm({
      title: notice.title,
      short_message: notice.short_message,
      summary: notice.summary,
      body: notice.body,
      type: notice.type,
      priority: notice.priority,
      status: notice.status,
      is_pinned: notice.is_pinned,
      is_dismissible: notice.is_dismissible,
      show_in_top_bar: notice.show_in_top_bar,
      show_on_homepage: notice.show_on_homepage,
      cta_label: notice.cta_label || '',
      cta_url: notice.cta_url || '',
      starts_at: notice.starts_at,
      expires_at: notice.expires_at || '',
      route_ids: notice.routes?.map(r => r.id) || [],
      counter_ids: notice.counters?.map(c => c.id) || [],
    });
    setView('edit');
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    if (view === 'create') {
      const newNotice: Notice = {
        id: `new-${Date.now()}`,
        ...form,
        cta_label: form.cta_label || null,
        cta_url: form.cta_url || null,
        expires_at: form.expires_at || null,
        created_by: null,
        created_at: now,
        updated_at: now,
        routes: [],
        counters: [],
      };
      setNotices(prev => sortNotices([newNotice, ...prev]));
    } else if (editingNotice) {
      setNotices(prev => sortNotices(prev.map(n =>
        n.id === editingNotice.id
          ? { ...n, ...form, cta_label: form.cta_label || null, cta_url: form.cta_url || null, expires_at: form.expires_at || null, updated_at: now }
          : n
      )));
    }
    setView('list');
  };

  const handleDelete = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  const togglePin = (id: string) => {
    setNotices(prev => sortNotices(prev.map(n =>
      n.id === id ? { ...n, is_pinned: !n.is_pinned } : n
    )));
  };

  const togglePublish = (id: string) => {
    setNotices(prev => sortNotices(prev.map(n =>
      n.id === id ? { ...n, status: n.status === 'published' ? 'draft' as NoticeStatus : 'published' as NoticeStatus } : n
    )));
  };

  const duplicateNotice = (notice: Notice) => {
    const dup: Notice = {
      ...notice,
      id: `dup-${Date.now()}`,
      title: `${notice.title} (Copy)`,
      status: 'draft',
      is_pinned: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setNotices(prev => sortNotices([dup, ...prev]));
  };

  const archiveNotice = (id: string) => {
    setNotices(prev => sortNotices(prev.map(n =>
      n.id === id ? { ...n, status: 'archived' as NoticeStatus } : n
    )));
  };

  // Preview notice from form
  const previewNotice: Notice = {
    id: 'preview',
    ...form,
    cta_label: form.cta_label || null,
    cta_url: form.cta_url || null,
    expires_at: form.expires_at || null,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    routes: [],
    counters: [],
  };

  if (view === 'create' || view === 'edit') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-foreground">
            {view === 'create' ? 'Create Notice' : 'Edit Notice'}
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setView('list')} className="px-3 py-1.5 text-xs border border-border/40 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors btn-primary-glow">
              {view === 'create' ? 'Create' : 'Update'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Title *</label>
              <input value={form.title} onChange={e => updateField('title', e.target.value)}
                className="w-full px-3 py-2 bg-secondary/50 border border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Short Message (for top bar)</label>
              <input value={form.short_message} onChange={e => updateField('short_message', e.target.value)}
                className="w-full px-3 py-2 bg-secondary/50 border border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Summary</label>
              <textarea value={form.summary} onChange={e => updateField('summary', e.target.value)} rows={2}
                className="w-full px-3 py-2 bg-secondary/50 border border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Body</label>
              <textarea value={form.body} onChange={e => updateField('body', e.target.value)} rows={6}
                className="w-full px-3 py-2 bg-secondary/50 border border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y font-mono" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Type</label>
                <select value={form.type} onChange={e => updateField('type', e.target.value as NoticeType)}
                  className="w-full px-3 py-2 bg-secondary/50 border border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {noticeTypes.map(t => <option key={t} value={t}>{noticeTypeConfig[t].label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Priority</label>
                <select value={form.priority} onChange={e => updateField('priority', e.target.value as NoticePriority)}
                  className="w-full px-3 py-2 bg-secondary/50 border border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Status</label>
              <select value={form.status} onChange={e => updateField('status', e.target.value as NoticeStatus)}
                className="w-full px-3 py-2 bg-secondary/50 border border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'is_pinned' as const, label: 'Pinned' },
                { key: 'is_dismissible' as const, label: 'Dismissible' },
                { key: 'show_in_top_bar' as const, label: 'Show in Top Bar' },
                { key: 'show_on_homepage' as const, label: 'Show on Homepage' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form[key] as boolean}
                    onChange={e => updateField(key, e.target.checked)}
                    className="rounded border-border/40 bg-secondary/50 text-primary focus:ring-primary/30"
                  />
                  {label}
                </label>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">CTA Label</label>
                <input value={form.cta_label} onChange={e => updateField('cta_label', e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/50 border border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">CTA URL</label>
                <input value={form.cta_url} onChange={e => updateField('cta_url', e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/50 border border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Starts At</label>
                <input type="datetime-local" value={form.starts_at?.slice(0, 16) || ''} onChange={e => updateField('starts_at', e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/50 border border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Expires At</label>
                <input type="datetime-local" value={form.expires_at?.slice(0, 16) || ''} onChange={e => updateField('expires_at', e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/50 border border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
          </div>

          {/* Preview panel — production-grade framing */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Live Preview
              </h3>
              <div className="flex gap-0.5 p-0.5 rounded-lg bg-secondary/50 border border-border/20">
                <button
                  onClick={() => setPreviewMode('bar')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium rounded-md transition-all ${
                    previewMode === 'bar' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  Top Bar
                </button>
                <button
                  onClick={() => setPreviewMode('card')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium rounded-md transition-all ${
                    previewMode === 'card' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <LayoutGrid className="w-3 h-3" />
                  Card
                </button>
              </div>
            </div>

            {previewMode === 'bar' ? (
              <PreviewBar notice={previewNotice} />
            ) : (
              <PreviewCard notice={previewNotice} />
            )}

            {/* Preview context hint */}
            <p className="text-[10px] text-muted-foreground/50 text-center">
              This preview shows how the notice will appear to visitors
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Notice Management
        </h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors btn-primary-glow"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Notice
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search notices..."
          className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Notice</th>
                <th className="text-left px-3 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                <th className="text-left px-3 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Priority</th>
                <th className="text-left px-3 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="text-left px-3 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Visibility</th>
                <th className="text-right px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(notice => {
                const tCfg = noticeTypeConfig[notice.type];
                const pCfg = noticePriorityConfig[notice.priority];
                return (
                  <tr key={notice.id} className="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {notice.is_pinned && <Pin className="w-3 h-3 text-starline-gold rotate-45 shrink-0" />}
                        <span className="font-medium text-foreground line-clamp-1">{notice.title}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tCfg.bg} ${tCfg.border} ${tCfg.color}`}>
                        {tCfg.label}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${pCfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${pCfg.dot}`} />
                        {pCfg.label}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        notice.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        notice.status === 'draft' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-secondary text-muted-foreground border border-border/30'
                      }`}>
                        {notice.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        {notice.show_in_top_bar && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">Bar</span>
                        )}
                        {notice.show_on_homepage && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-starline-gold/10 text-starline-gold border border-starline-gold/20">Home</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => handleEdit(notice)} className="p-1.5 rounded-md hover:bg-secondary/60 transition-colors" title="Edit">
                          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <button onClick={() => togglePublish(notice.id)} className="p-1.5 rounded-md hover:bg-secondary/60 transition-colors" title={notice.status === 'published' ? 'Unpublish' : 'Publish'}>
                          {notice.status === 'published' ? <EyeOff className="w-3.5 h-3.5 text-muted-foreground" /> : <Eye className="w-3.5 h-3.5 text-muted-foreground" />}
                        </button>
                        <button onClick={() => togglePin(notice.id)} className="p-1.5 rounded-md hover:bg-secondary/60 transition-colors" title={notice.is_pinned ? 'Unpin' : 'Pin'}>
                          {notice.is_pinned ? <PinOff className="w-3.5 h-3.5 text-starline-gold" /> : <Pin className="w-3.5 h-3.5 text-muted-foreground" />}
                        </button>
                        <button onClick={() => duplicateNotice(notice)} className="p-1.5 rounded-md hover:bg-secondary/60 transition-colors" title="Duplicate">
                          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <button onClick={() => archiveNotice(notice.id)} className="p-1.5 rounded-md hover:bg-secondary/60 transition-colors" title="Archive">
                          <Archive className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <button onClick={() => handleDelete(notice.id)} className="p-1.5 rounded-md hover:bg-destructive/20 transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5 text-destructive/70" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Inline Previews — Production-grade framing ─── */
function PreviewBar({ notice }: { notice: Notice }) {
  const tCfg = noticeTypeConfig[notice.type];
  const isCritical = notice.priority === 'critical';
  const isHigh = notice.priority === 'high';

  return (
    <div className="glass-card-elevated overflow-hidden">
      {/* Browser chrome simulation */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/20 bg-secondary/30">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-amber-500/50" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
        </div>
        <div className="flex-1 mx-4">
          <div className="h-5 bg-secondary/60 rounded-md flex items-center justify-center">
            <span className="text-[9px] text-muted-foreground/40">starline.com.bd</span>
          </div>
        </div>
      </div>
      {/* Actual bar preview */}
      <div className={`relative overflow-hidden ${
        isCritical ? 'bg-gradient-to-r from-red-950/50 via-card/95 to-red-950/50' :
        isHigh ? 'bg-gradient-to-r from-amber-950/20 via-card/95 to-amber-950/20' :
        'bg-card/90'
      }`}>
        {isCritical && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-red-500/80 via-red-400/60 to-red-500/80" />}
        <div className="flex items-center h-8 px-4 gap-2.5">
          {isCritical ? <AlertTriangle className="w-3 h-3 text-red-400/90 shrink-0" /> : <Info className="w-3 h-3 text-muted-foreground/60 shrink-0" />}
          <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-px rounded-full border shrink-0 opacity-80 ${tCfg.bg} ${tCfg.border} ${tCfg.color}`}>{tCfg.label}</span>
          <span className={`text-[11px] font-medium truncate ${isCritical ? 'text-red-200/90' : 'text-foreground/75'}`}>
            {notice.short_message || notice.title || 'Enter a message...'}
          </span>
          {notice.cta_label && (
            <span className={`ml-auto text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full border shrink-0 ${
              isCritical ? 'bg-red-500/15 text-red-300/90 border-red-500/20' :
              'bg-primary/8 text-primary/80 border-primary/15'
            }`}>{notice.cta_label}</span>
          )}
        </div>
      </div>
      {/* Simulated navbar below */}
      <div className="h-8 border-t border-border/15 bg-card/50 flex items-center px-4">
        <span className="text-[10px] font-semibold text-foreground/60">⬛ Star Line</span>
      </div>
    </div>
  );
}

function PreviewCard({ notice }: { notice: Notice }) {
  const tCfg = noticeTypeConfig[notice.type];
  const pCfg = noticePriorityConfig[notice.priority];

  return (
    <div className="glass-card-elevated overflow-hidden">
      {/* Section header simulation */}
      <div className="px-5 pt-4 pb-3 border-b border-border/15">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-starline-gold">Travel Updates & Notices</span>
      </div>
      {/* Card preview */}
      <div className="p-5">
        <div className="glass-card overflow-hidden">
          <div className={`h-[2px] w-full ${
            notice.priority === 'critical' ? 'bg-gradient-to-r from-transparent via-red-500 to-transparent' :
            notice.priority === 'high' ? 'bg-gradient-to-r from-transparent via-amber-500/70 to-transparent' :
            'bg-gradient-to-r from-transparent via-border to-transparent'
          }`} />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tCfg.bg} ${tCfg.border} ${tCfg.color}`}>
                {tCfg.icon} {tCfg.label}
              </span>
              {notice.priority !== 'normal' && (
                <span className={`text-[10px] ${pCfg.color} flex items-center gap-1`}>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${pCfg.dot}`} />{pCfg.label}
                </span>
              )}
            </div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-1.5">{notice.title || 'Notice title...'}</h4>
            {notice.summary && <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{notice.summary}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
