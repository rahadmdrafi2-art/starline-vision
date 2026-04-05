import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Calendar, ExternalLink, Pin, Building2 } from 'lucide-react';
import { mockNotices } from '@/data/mockNotices';
import {
  noticeTypeConfig,
  noticePriorityConfig,
  formatNoticeDateTime,
  isNoticeActive,
  type Notice,
} from '@/types/notices';

export default function NoticeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const found = mockNotices.find(n => n.id === id) || null;
    setNotice(found);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-3">Notice Not Found</h1>
          <p className="text-sm text-muted-foreground mb-6">This notice may have been removed or doesn't exist.</p>
          <Link to="/notices" className="text-sm text-primary hover:underline">
            ← Back to Notice Center
          </Link>
        </div>
      </div>
    );
  }

  const tCfg = noticeTypeConfig[notice.type];
  const pCfg = noticePriorityConfig[notice.priority];
  const active = isNoticeActive(notice);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-10 sm:py-14">
        {/* Back nav */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to notices
        </motion.button>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card-elevated overflow-hidden"
        >
          {/* Priority accent */}
          <div className={`h-[3px] w-full ${
            notice.priority === 'critical' ? 'bg-gradient-to-r from-transparent via-red-500 to-transparent' :
            notice.priority === 'high' ? 'bg-gradient-to-r from-transparent via-amber-500/70 to-transparent' :
            'bg-gradient-to-r from-transparent via-border to-transparent'
          }`} />

          <div className="p-6 sm:p-8">
            {/* Badges row */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {/* Type badge */}
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${tCfg.bg} ${tCfg.border} ${tCfg.color}`}>
                <span>{tCfg.icon}</span>
                {tCfg.label}
              </span>

              {/* Priority */}
              {notice.priority !== 'normal' && (
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${pCfg.bg} ${pCfg.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${pCfg.dot} ${notice.priority === 'critical' ? 'animate-pulse-glow' : ''}`} />
                  {pCfg.label}
                </span>
              )}

              {/* Pinned */}
              {notice.is_pinned && (
                <span className="inline-flex items-center gap-1 text-[11px] text-starline-gold font-medium">
                  <Pin className="w-3 h-3 rotate-45" />
                  Pinned
                </span>
              )}

              {/* Active/Expired */}
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                active
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-secondary text-muted-foreground border border-border/30'
              }`}>
                {active ? 'Active' : 'Expired'}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-3 leading-tight">
              {notice.title}
            </h1>

            {/* Summary */}
            {notice.summary && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 border-l-2 border-primary/30 pl-4">
                {notice.summary}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground/75 mb-6 pb-6 border-b border-border/30">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Published: {formatNoticeDateTime(notice.starts_at)}
              </span>
              {notice.expires_at && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Expires: {formatNoticeDateTime(notice.expires_at)}
                </span>
              )}
            </div>

            {/* Affected routes */}
            {notice.routes && notice.routes.length > 0 && (
              <div className="mb-5">
                <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                  Affected Routes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {notice.routes.map(r => (
                    <span key={r.id} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/30 text-foreground/80">
                      <MapPin className="w-3 h-3 text-primary/60" />
                      {r.origin} → {r.destination}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Affected counters */}
            {notice.counters && notice.counters.length > 0 && (
              <div className="mb-5">
                <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                  Affected Counters
                </h3>
                <div className="flex flex-wrap gap-2">
                  {notice.counters.map(c => (
                    <span key={c.id} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/30 text-foreground/80">
                      <Building2 className="w-3 h-3 text-starline-gold/60" />
                      {c.name}, {c.district}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Body */}
            <div className="mt-6 prose prose-invert prose-sm max-w-none text-foreground/85 leading-relaxed
              prose-headings:font-display prose-headings:text-foreground prose-headings:font-semibold
              prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-3
              prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2
              prose-p:mb-3
              prose-strong:text-foreground
              prose-ul:my-2 prose-li:my-0.5
              prose-table:text-xs
              prose-th:text-foreground prose-th:font-semibold prose-th:border-border/40 prose-th:px-3 prose-th:py-2
              prose-td:border-border/30 prose-td:px-3 prose-td:py-2
            ">
              {notice.body.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
                if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>;
                if (line.startsWith('- ')) return <li key={i}>{line.slice(2)}</li>;
                if (line.trim() === '') return <br key={i} />;
                return <p key={i}>{line}</p>;
              })}
            </div>

            {/* CTA */}
            {notice.cta_label && notice.cta_url && (
              <div className="mt-8 pt-6 border-t border-border/30">
                <Link
                  to={notice.cta_url}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all btn-primary-glow"
                >
                  {notice.cta_label}
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </motion.article>

        {/* Footer nav */}
        <div className="mt-8 text-center">
          <Link to="/notices" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            ← Back to Notice Center
          </Link>
        </div>
      </div>
    </div>
  );
}
