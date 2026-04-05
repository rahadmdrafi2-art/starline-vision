// ============================================================
// Notice & Announcement Center — Types & Config
// ============================================================

export type NoticeType =
  | 'emergency' | 'promotion' | 'fare_update' | 'route_notice'
  | 'maintenance' | 'app_update' | 'general';

export type NoticePriority = 'critical' | 'high' | 'normal';

export type NoticeStatus = 'draft' | 'published' | 'archived';

export interface Notice {
  id: string;
  title: string;
  short_message: string;
  summary: string;
  body: string;
  type: NoticeType;
  priority: NoticePriority;
  status: NoticeStatus;
  is_pinned: boolean;
  is_dismissible: boolean;
  show_in_top_bar: boolean;
  show_on_homepage: boolean;
  cta_label: string | null;
  cta_url: string | null;
  starts_at: string;
  expires_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  routes?: { id: string; origin: string; destination: string }[];
  counters?: { id: string; name: string; district: string }[];
}

export interface NoticeFormData {
  title: string;
  short_message: string;
  summary: string;
  body: string;
  type: NoticeType;
  priority: NoticePriority;
  status: NoticeStatus;
  is_pinned: boolean;
  is_dismissible: boolean;
  show_in_top_bar: boolean;
  show_on_homepage: boolean;
  cta_label: string;
  cta_url: string;
  starts_at: string;
  expires_at: string;
  route_ids: string[];
  counter_ids: string[];
}

export const emptyNoticeForm: NoticeFormData = {
  title: '',
  short_message: '',
  summary: '',
  body: '',
  type: 'general',
  priority: 'normal',
  status: 'draft',
  is_pinned: false,
  is_dismissible: true,
  show_in_top_bar: false,
  show_on_homepage: false,
  cta_label: '',
  cta_url: '',
  starts_at: '',
  expires_at: '',
  route_ids: [],
  counter_ids: [],
};

export interface NoticeFilters {
  search?: string;
  type?: NoticeType | 'all';
  priority?: NoticePriority | 'all';
  status?: 'active' | 'archived' | 'all';
}

export const noticeTypes: NoticeType[] = [
  'emergency', 'promotion', 'fare_update', 'route_notice',
  'maintenance', 'app_update', 'general',
];

export const noticeTypeConfig: Record<NoticeType, { label: string; color: string; bg: string; border: string; icon: string }> = {
  emergency:    { label: 'Emergency',    color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/30',     icon: '🚨' },
  promotion:    { label: 'Promotion',    color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: '🎉' },
  fare_update:  { label: 'Fare Update',  color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   icon: '💰' },
  route_notice: { label: 'Route Notice', color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    icon: '🛣️' },
  maintenance:  { label: 'Maintenance',  color: 'text-slate-400',   bg: 'bg-slate-500/10',   border: 'border-slate-500/30',   icon: '🔧' },
  app_update:   { label: 'App Update',   color: 'text-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/30',  icon: '📱' },
  general:      { label: 'General',      color: 'text-zinc-400',    bg: 'bg-zinc-500/10',    border: 'border-zinc-500/30',    icon: 'ℹ️' },
};

export const noticePriorityConfig: Record<NoticePriority, { label: string; color: string; bg: string; dot: string }> = {
  critical: { label: 'Critical', color: 'text-red-400',            bg: 'bg-red-500/15',    dot: 'bg-red-500' },
  high:     { label: 'High',     color: 'text-orange-400',         bg: 'bg-orange-500/15', dot: 'bg-orange-500' },
  normal:   { label: 'Normal',   color: 'text-muted-foreground',   bg: 'bg-secondary',     dot: 'bg-muted-foreground' },
};

export function isNoticeActive(n: Notice): boolean {
  if (n.status !== 'published') return false;
  const now = new Date();
  const start = new Date(n.starts_at);
  if (start > now) return false;
  if (n.expires_at && new Date(n.expires_at) < now) return false;
  return true;
}

export function sortNotices(notices: Notice[]): Notice[] {
  const priorityOrder: Record<NoticePriority, number> = { critical: 0, high: 1, normal: 2 };
  return [...notices].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    if (a.priority !== b.priority) return priorityOrder[a.priority] - priorityOrder[b.priority];
    return new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime();
  });
}

export function formatNoticeDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function formatNoticeDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
