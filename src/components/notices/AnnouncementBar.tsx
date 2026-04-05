import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-react';
import { mockNotices } from '@/data/mockNotices';
import { noticeTypeConfig, noticePriorityConfig, sortNotices, isNoticeActive, type Notice } from '@/types/notices';

const ROTATION_MS = 6000;
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
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [needsScroll, setNeedsScroll] = useState(false);

  useEffect(() => {
    // Filter bar notices from mock data
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

  // Check if text overflows and needs scrolling
  useEffect(() => {
    const check = () => {
      if (textRef.current && containerRef.current) {
        setNeedsScroll(textRef.current.scrollWidth > containerRef.current.clientWidth);
      }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [current, notices]);

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

  // Compute scroll duration based on text length
  const scrollDuration = Math.max(15, (notice.short_message || notice.title).length * 0.25);

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
            ? 'bg-gradient-to-r from-red-950/80 via-red-950/40 to-red-950/80 border-red-900/40'
            : isHigh
            ? 'bg-gradient-to-r from-amber-950/30 via-card/90 to-amber-950/30 border-amber-900/20'
            : 'bg-card/80 border-border/30'
        } backdrop-blur-xl`}
      >
        {/* Critical left accent bar */}
        {isCritical && (
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-red-500 via-red-400 to-red-500" />
        )}
        {isHigh && (
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-500/60 via-amber-400/40 to-amber-500/60" />
        )}

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center h-9 gap-3">

            {/* ─── Left fixed zone: priority icon + type badge ─── */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Priority indicator */}
              <div className="relative flex items-center justify-center">
                {isCritical ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <div className="absolute inset-0 rounded-full animate-pulse-glow">
                      <div className="w-full h-full rounded-full bg-red-500/20" />
                    </div>
                  </>
                ) : (
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </div>

              {/* Type badge */}
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tCfg.bg} ${tCfg.border} ${tCfg.color}`}>
                {tCfg.label}
              </span>
            </div>

            {/* ─── Center scrolling zone: message text ─── */}
            <div ref={containerRef} className="relative flex-1 overflow-hidden min-w-0">
              {/* Edge fade masks — always show for scrolling */}
              <div className="absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-card/80 to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-card/80 to-transparent pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <span
                    ref={textRef}
                    className={`announcement-scroll text-xs font-medium tracking-wide ${paused ? 'paused' : ''} ${
                      isCritical ? 'text-red-200' : 'text-foreground/90'
                    }`}
                    style={{ '--scroll-duration': `${scrollDuration}s` } as React.CSSProperties}
                  >
                    {notice.short_message || notice.title}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ─── Right fixed zone: CTA + nav + dismiss ─── */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* CTA */}
              {notice.cta_label && notice.cta_url && (
                <Link
                  to={notice.cta_url}
                  className={`hidden sm:flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full transition-all ${
                    isCritical
                      ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30'
                      : isHigh
                      ? 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/25'
                      : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20'
                  }`}
                >
                  {notice.cta_label}
                  <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              )}

              {/* Prev / Next */}
              {notices.length > 1 && (
                <div className="flex items-center gap-0.5">
                  <button onClick={goPrev} className="p-1 rounded-md hover:bg-secondary/60 transition-colors" aria-label="Previous notice">
                    <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <span className="text-[10px] text-muted-foreground tabular-nums font-medium min-w-[2rem] text-center">
                    {(current % notices.length) + 1}/{notices.length}
                  </span>
                  <button onClick={goNext} className="p-1 rounded-md hover:bg-secondary/60 transition-colors" aria-label="Next notice">
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              )}

              {/* Dismiss (non-critical only) */}
              {!isCritical && notice.is_dismissible && (
                <button
                  onClick={() => handleDismiss(notice)}
                  className="p-1 rounded-md hover:bg-secondary/60 transition-colors"
                  aria-label="Dismiss notice"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
