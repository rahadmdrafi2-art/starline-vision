import { Search } from 'lucide-react';
import { noticeTypes, noticeTypeConfig, type NoticeType, type NoticePriority } from '@/types/notices';

interface NoticeFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  type: NoticeType | 'all';
  onTypeChange: (val: NoticeType | 'all') => void;
  priority: NoticePriority | 'all';
  onPriorityChange: (val: NoticePriority | 'all') => void;
  showArchived: boolean;
  onArchivedToggle: (val: boolean) => void;
}

export default function NoticeFilters({
  search, onSearchChange,
  type, onTypeChange,
  priority, onPriorityChange,
  showArchived, onArchivedToggle,
}: NoticeFiltersProps) {
  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search notices..."
            className="w-full pl-9 pr-4 py-2.5 bg-secondary/50 border border-border/30 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>

        {/* Type filter */}
        <select
          value={type}
          onChange={e => onTypeChange(e.target.value as NoticeType | 'all')}
          title="Filter by notice type"
          className="px-3 py-2.5 bg-secondary/50 border border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none cursor-pointer"
        >
          <option value="all">All Types</option>
          {noticeTypes.map(t => (
            <option key={t} value={t}>{noticeTypeConfig[t].label}</option>
          ))}
        </select>

        {/* Priority filter */}
        <select
          value={priority}
          onChange={e => onPriorityChange(e.target.value as NoticePriority | 'all')}
          title="Filter by priority"
          className="px-3 py-2.5 bg-secondary/50 border border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none cursor-pointer"
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
        </select>

        {/* Active / Show Expired */}
        <button
          onClick={() => onArchivedToggle(!showArchived)}
          className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all border whitespace-nowrap ${
            showArchived
              ? 'bg-primary/10 border-primary/30 text-primary'
              : 'bg-secondary/50 border-border/30 text-muted-foreground hover:text-foreground'
          }`}
        >
          {showArchived ? 'Showing All' : 'Active Only'}
        </button>
      </div>
    </div>
  );
}
