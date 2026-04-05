import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bell, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import NoticeCard from '@/components/notices/NoticeCard';
import NoticeFiltersBar from '@/components/notices/NoticeFiltersBar';
import { mockNotices } from '@/data/mockNotices';
import { sortNotices, isNoticeActive, type NoticeType, type NoticePriority } from '@/types/notices';

export default function NoticesPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<NoticeType | 'all'>('all');
  const [priority, setPriority] = useState<NoticePriority | 'all'>('all');
  const [showArchived, setShowArchived] = useState(false);

  const filtered = useMemo(() => {
    let result = mockNotices.filter(n => {
      if (!showArchived && !isNoticeActive(n)) return false;
      if (type !== 'all' && n.type !== type) return false;
      if (priority !== 'all' && n.priority !== priority) return false;
      if (search) {
        const q = search.toLowerCase();
        return n.title.toLowerCase().includes(q) ||
               n.summary.toLowerCase().includes(q) ||
               n.short_message.toLowerCase().includes(q);
      }
      return true;
    });
    return sortNotices(result);
  }, [search, type, priority, showArchived]);

  const pinned = filtered.filter(n => n.is_pinned);
  const unpinned = filtered.filter(n => !n.is_pinned);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 sm:py-16">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                Notice Center
              </h1>
              <p className="text-sm text-muted-foreground/75 mt-0.5">
                Service alerts, travel advisories, and official announcements
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <NoticeFiltersBar
          search={search}
          onSearchChange={setSearch}
          type={type}
          onTypeChange={setType}
          priority={priority}
          onPriorityChange={setPriority}
          showArchived={showArchived}
          onArchivedToggle={setShowArchived}
        />

        {/* Content */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <Inbox className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">No notices found</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {search || type !== 'all' || priority !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'There are no active notices at this time. Check back later for updates.'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Pinned Section */}
            {pinned.length > 0 && (
              <div>
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-starline-gold mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-starline-gold" />
                  Pinned Notices
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pinned.map((notice, i) => (
                    <NoticeCard key={notice.id} notice={notice} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* All Notices */}
            {unpinned.length > 0 && (
              <div>
                {pinned.length > 0 && (
                  <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                    All Notices
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unpinned.map((notice, i) => (
                    <NoticeCard key={notice.id} notice={notice} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
