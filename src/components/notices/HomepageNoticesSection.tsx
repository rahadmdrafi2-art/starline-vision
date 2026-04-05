import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, ChevronRight } from 'lucide-react';
import NoticeCard from '@/components/notices/NoticeCard';
import { mockNotices } from '@/data/mockNotices';
import { sortNotices, isNoticeActive, type Notice } from '@/types/notices';

export default function HomepageNoticesSection() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from mock data
    const timer = setTimeout(() => {
      const homeNotices = sortNotices(
        mockNotices.filter(n => n.show_on_homepage && isNoticeActive(n))
      ).slice(0, 4);
      setNotices(homeNotices);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (!loading && notices.length === 0) return null;

  return (
    <section className="section-spacing">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-8 sm:mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-starline-gold" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-starline-gold">
                Updates
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Travel Updates & Notices
            </h2>
          </div>
          <Link
            to="/notices"
            className="hidden sm:flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors group"
          >
            All notices
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="glass-card h-40 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notices.map((notice, i) => (
              <NoticeCard key={notice.id} notice={notice} index={i} />
            ))}
          </div>
        )}

        {/* Mobile "View All" */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            to="/notices"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            View all notices
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
