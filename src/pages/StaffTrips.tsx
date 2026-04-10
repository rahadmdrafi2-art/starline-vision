import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, LogOut, Filter, Calendar } from 'lucide-react';
import { mockTrips, currentStaff } from '@/data/mockTrips';
import TripCard from '@/components/trips/TripCard';
import TripStatusBadge from '@/components/trips/TripStatusBadge';
import { TripStatus } from '@/types/tripOperations';

const STATUS_FILTERS: (TripStatus | 'all')[] = ['all', 'in_transit', 'boarding', 'scheduled', 'delayed', 'arrived'];

export default function StaffTrips() {
  const [filter, setFilter] = useState<TripStatus | 'all'>('all');
  const filtered = filter === 'all' ? mockTrips : mockTrips.filter((t) => t.status === filter);

  const activeCount = mockTrips.filter((t) => t.status === 'in_transit' || t.status === 'boarding').length;
  const delayedCount = mockTrips.filter((t) => t.status === 'delayed').length;

  return (
    <div className="min-h-screen bg-background dark">
      {/* Top bar */}
      <header className="border-b border-border/30 bg-card/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="container flex items-center justify-between h-14">
          <Link to="/staff/login" className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Bus className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="hidden sm:inline">Star Line</span>
            <span className="text-[10px] text-muted-foreground/60 font-normal ml-1 hidden sm:inline">OPS</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-foreground">{currentStaff.name}</p>
              <p className="text-[10px] text-muted-foreground/60 capitalize">{currentStaff.role}</p>
            </div>
            <Link
              to="/staff/login"
              className="w-8 h-8 rounded-lg bg-secondary/60 border border-border/40 flex items-center justify-center text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-5">
        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/50 uppercase tracking-wider font-semibold mb-1">
            <Calendar className="w-3 h-3" />
            Today · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
          <h1 className="font-display text-xl font-bold text-foreground">Assigned Trips</h1>
        </motion.div>

        {/* Quick KPIs */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Total', value: mockTrips.length, color: 'text-foreground' },
            { label: 'Active', value: activeCount, color: 'text-success' },
            { label: 'Delayed', value: delayedCount, color: 'text-destructive' },
          ].map((kpi) => (
            <div key={kpi.label} className="glass-card p-3 text-center">
              <div className={`font-display text-lg font-bold ${kpi.color}`}>{kpi.value}</div>
              <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mb-4 pb-1">
          <Filter className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                filter === s
                  ? 'bg-primary/15 border-primary/30 text-primary'
                  : 'bg-secondary/40 border-border/30 text-muted-foreground/70 hover:text-foreground'
              }`}
            >
              {s === 'all' ? 'All' : s === 'in_transit' ? 'In Transit' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Trip list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <Bus className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground/60">No trips match this filter</p>
            </div>
          ) : (
            filtered.map((trip, i) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
              >
                <TripCard trip={trip} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
