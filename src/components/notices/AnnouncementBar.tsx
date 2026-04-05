import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-react';
import { mockNotices } from '@/data/mockNotices';
import { noticeTypeConfig, noticePriorityConfig, sortNotices, isNoticeActive, type Notice } from '@/types/notices';

const ROTATION_MS = 7000;
const DISMISS_STORAGE_KEY = 'starline_dismissed_notices';

function getDismissed(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(DISMISS_STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function setDismissedStorage(id: string, updatedAt: string) {
  const d = getDismissed();
  d[id] = updatedAt;
  localStorage.setItem(DISMISS_STORAGE_KEY, JSON.stringify(d));
}

function isDismissed(n: Notice): boolean {
  const d = getDismissed();
  if (!d[n.id]) return false;
  return d[n.id] === n.updated_at;
}

export default function AnnouncementBar() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const barNotices = mockNotices
      .filter(n => n.show_in_top_bar && isNoticeActive(n) && !isDismissed(n));
    setNotices(sortNotices(barNotices));
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (notices.length <= 1 || paused) return;
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % notices.length);
    }, ROTATION_MS);
    return () => clearInterval(timer);
  }, [notices.length, paused]);

  const handleDismiss = useCallback((notice: Notice) => {
    setDismissedStorage(notice.id, notice.updated_at);
    setNotices(prev => {
      const next = prev.filter(n => n.id !== notice.id);
      if (current >= next.length && next.length > 0) setCurrent(next.length - 1);
      return next;
    });
  }, [current]);

  const goPrev = useCallback(() => {
    setCurrent(c => (c - 1 + notices.length) % notices.length);
  }, [notices.length]);

  const goNext = useCallback(() => {
    setCurrent(c => (c + 1) % notices.length);
  }, [notices.length]);

  if (notices.length === 0) return null;

  const notice = notices[current % notices.length];
  if (!notice) return null;

  const tCfg = noticeTypeConfig[notice.type];
  const isCritical = notice.priority === 'critical';
  const isHigh = notice.priority === 'high';

  const scrollDuration = Math.max(18, (notice.short_message || notice.title).length * 0.3);

  return (
    <div className="relative z-50">
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        role="region"
        aria-label="Announcements"
        className={`relative overflow-hidden border-b transition-colors ${
          isCritical
            ? 'bg-gradient-to-r from-red-950/50 via-card/95 to-red-950/50 border-red-900/25'
            : isHigh
            ? 'bg-gradient-to-r from-amber-950/20 via-card/95 to-amber-950/20 border-amber-900/15'
            : 'bg-card/90 border-border/20'
        } backdrop-blur-xl`}
      >
        {/* Priority accent — subtle left line */}
        {isCritical && (
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-red-500/80 via-red-400/60 to-red-500/80" />
        )}
        {isHigh && (
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-500/40 via-amber-400/25 to-amber-500/40" />
        )}

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center h-8 gap-2.5">

            {/* ─── Left: priority icon + type badge ─── */}
            <div className="flex items-center gap-2 shrink-0">
              {isCritical ? (
                <div className="relative flex items-center justify-center">
                  <AlertTriangle className="w-3 h-3 text-red-400/90" />
                  <div className="absolute inset-0 animate-pulse-glow rounded-full">
                    <div className="w-full h-full rounded-full bg-red-500/15" />
                  </div>
                </div>
              ) : (
                <Info className="w-3 h-3 text-muted-foreground/60" />
              )}

              <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-px rounded-full border ${tCfg.bg} ${tCfg.border} ${tCfg.color} opacity-80`}>
                {tCfg.label}
              </span>
            </div>

            {/* ─── Center: scrolling message lane ─── */}
            <div className="relative flex-1 overflow-hidden min-w-0">
              {/* Soft edge fade masks */}
              <div className="absolute left-0 top-0 bottom-0 w-10 z-10 pointer-events-none"
                style={{ background: `linear-gradient(to right, ${isCritical ? 'hsl(220 28% 6%)' : 'hsl(220 24% 9%)'}, transparent)` }} />
              <div className="absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none"
                style={{ background: `linear-gradient(to left, ${isCritical ? 'hsl(220 28% 6%)' : 'hsl(220 24% 9%)'}, transparent)` }} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <span
                    className={`announcement-scroll text-[11px] font-medium tracking-wide ${paused ? 'paused' : ''} ${
                      isCritical ? 'text-red-200/90' : 'text-foreground/75'
                    }`}
                    style={{ '--scroll-duration': `${scrollDuration}s` } as React.CSSProperties}
                  >
                    {notice.short_message || notice.title}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ─── Right: CTA + nav + dismiss ─── */}
            <div className="flex items-center gap-1 shrink-0">
              {/* CTA */}
              {notice.cta_label && notice.cta_url && (
                <Link
                  to={notice.cta_url}
                  className={`hidden sm:flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full transition-all ${
                    isCritical
                      ? 'bg-red-500/15 text-red-300/90 hover:bg-red-500/25 border border-red-500/20'
                      : isHigh
                      ? 'bg-amber-500/10 text-amber-300/90 hover:bg-amber-500/20 border border-amber-500/15'
                      : 'bg-primary/8 text-primary/80 hover:bg-primary/15 border border-primary/15'
                  }`}
                >
                  {notice.cta_label}
                  <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              )}

              {/* Prev / Next */}
              {notices.length > 1 && (
                <div className="flex items-center gap-px ml-1">
                  <button onClick={goPrev} className="p-0.5 rounded hover:bg-secondary/40 transition-colors" aria-label="Previous notice">
                    <ChevronLeft className="w-3 h-3 text-muted-foreground/60" />
                  </button>
                  <span className="text-[9px] text-muted-foreground/50 tabular-nums font-medium min-w-[1.5rem] text-center">
                    {(current % notices.length) + 1}/{notices.length}
                  </span>
                  <button onClick={goNext} className="p-0.5 rounded hover:bg-secondary/40 transition-colors" aria-label="Next notice">
                    <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
                  </button>
                </div>
              )}

              {/* Dismiss */}
              {!isCritical && notice.is_dismissible && (
                <button
                  onClick={() => handleDismiss(notice)}
                  className="p-0.5 rounded hover:bg-secondary/40 transition-colors ml-0.5"
                  aria-label="Dismiss notice"
                >
                  <X className="w-2.5 h-2.5 text-muted-foreground/50" />
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
