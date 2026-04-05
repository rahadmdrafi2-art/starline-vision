import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, ChevronRight, Pin } from 'lucide-react';
import { noticeTypeConfig, noticePriorityConfig, formatNoticeDate, type Notice } from '@/types/notices';

interface NoticeCardProps {
  notice: Notice;
  index?: number;
  compact?: boolean;
}

export default function NoticeCard({ notice, index = 0, compact = false }: NoticeCardProps) {
  const tCfg = noticeTypeConfig[notice.type];
  const pCfg = noticePriorityConfig[notice.priority];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
    >
      <Link
        to={`/notices/${notice.id}`}
        className="group block glass-card card-hover overflow-hidden"
      >
        {/* Priority accent line */}
        <div className={`h-[2px] w-full ${
          notice.priority === 'critical' ? 'bg-gradient-to-r from-transparent via-red-500 to-transparent' :
          notice.priority === 'high' ? 'bg-gradient-to-r from-transparent via-amber-500/70 to-transparent' :
          'bg-gradient-to-r from-transparent via-border to-transparent'
        }`} />

        <div className={`p-4 ${compact ? 'sm:p-4' : 'sm:p-5'}`}>
          {/* Top row: badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {/* Type badge */}
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tCfg.bg} ${tCfg.border} ${tCfg.color}`}>
              <span>{tCfg.icon}</span>
              {tCfg.label}
            </span>

            {/* Priority dot */}
            {notice.priority !== 'normal' && (
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium ${pCfg.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${pCfg.dot} ${notice.priority === 'critical' ? 'animate-pulse-glow' : ''}`} />
                {pCfg.label}
              </span>
            )}

            {/* Pinned */}
            {notice.is_pinned && (
              <Pin className="w-3 h-3 text-starline-gold rotate-45 ml-auto shrink-0" />
            )}
          </div>

          {/* Title */}
          <h3 className="font-display text-sm sm:text-base font-semibold text-foreground leading-snug mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
            {notice.title}
          </h3>

          {/* Summary */}
          {!compact && notice.summary && (
            <p className="text-xs text-muted-foreground/80 leading-relaxed mb-3 line-clamp-2">
              {notice.summary}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground/70">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatNoticeDate(notice.starts_at)}
            </span>

            {/* Route context */}
            {notice.routes && notice.routes.length > 0 && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {notice.routes[0].origin} → {notice.routes[0].destination}
                {notice.routes.length > 1 && ` +${notice.routes.length - 1}`}
              </span>
            )}

            {/* CTA hint */}
            <span className="ml-auto inline-flex items-center gap-0.5 text-primary/70 group-hover:text-primary transition-colors font-medium">
              View
              <ChevronRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
