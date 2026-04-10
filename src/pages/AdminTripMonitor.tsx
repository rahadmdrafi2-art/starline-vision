import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bus, Search, Filter, Clock, AlertTriangle, CheckCircle2,
  MapPinned, Activity, Users, ArrowUpRight, Wifi
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockTrips } from '@/data/mockTrips';
import { TripStatus, STATUS_CONFIG } from '@/types/tripOperations';
import TripStatusBadge from '@/components/trips/TripStatusBadge';
import { cn } from '@/lib/utils';

const STATUS_FILTERS: (TripStatus | 'all')[] = ['all', 'in_transit', 'boarding', 'scheduled', 'delayed', 'arrived'];

export default function AdminTripMonitor() {
  const [filter, setFilter] = useState<TripStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = mockTrips
    .filter((t) => filter === 'all' || t.status === filter)
    .filter((t) => !search || t.routeName.toLowerCase().includes(search.toLowerCase()) || t.tripCode.toLowerCase().includes(search.toLowerCase()) || t.busName.toLowerCase().includes(search.toLowerCase()));

  const kpis = [
    { label: 'Active', value: mockTrips.filter((t) => t.status === 'in_transit' || t.status === 'boarding').length, icon: Activity, color: 'text-success' },
    { label: 'Delayed', value: mockTrips.filter((t) => t.status === 'delayed').length, icon: AlertTriangle, color: 'text-destructive' },
    { label: 'Arrived', value: mockTrips.filter((t) => t.status === 'arrived').length, icon: CheckCircle2, color: 'text-accent' },
    { label: 'Passengers', value: mockTrips.reduce((s, t) => s + t.passengers.totalPassengers, 0), icon: Users, color: 'text-info' },
  ];

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="border-b border-border/30 bg-card/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="container flex items-center justify-between h-14">
          <Link to="/" className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Bus className="w-4 h-4 text-primary-foreground" />
            </div>
            Star Line
            <span className="text-[10px] text-muted-foreground/60 font-normal ml-1">Control Room</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/staff/trips" className="text-xs text-muted-foreground/70 hover:text-foreground transition-colors">Staff Portal</Link>
            <Link to="/" className="text-xs text-muted-foreground/70 hover:text-foreground transition-colors hidden sm:inline">Home</Link>
          </div>
        </div>
      </header>

      <div className="container py-5">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">Trip Control Center</h1>
          <p className="text-xs text-muted-foreground/60 mt-1">Real-time monitoring of all active trips</p>
        </motion.div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={cn('w-4 h-4', kpi.color)} />
                <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">{kpi.label}</span>
              </div>
              <div className={cn('font-display text-2xl font-bold', kpi.color)}>{kpi.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Live map placeholder */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card overflow-hidden mb-5"
        >
          <div className="h-40 sm:h-52 bg-secondary/20 relative flex items-center justify-center">
            <div className="text-center">
              <MapPinned className="w-10 h-10 text-muted-foreground/15 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground/35">Fleet map overview</p>
              <p className="text-[10px] text-muted-foreground/25 mt-0.5">
                {mockTrips.filter((t) => t.isLive).length} vehicles broadcasting
              </p>
            </div>
            {/* Simulated bus dots */}
            {mockTrips.filter((t) => t.isLive).map((t, i) => (
              <div
                key={t.id}
                className="absolute w-3 h-3 rounded-full bg-success animate-pulse"
                style={{ top: `${30 + i * 25}%`, left: `${20 + i * 30}%` }}
              >
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] text-success font-mono whitespace-nowrap">{t.tripCode}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trips, routes, buses..."
              className="pl-9 h-10 bg-secondary/40 border-border/40"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  'flex-shrink-0 px-3 py-2 rounded-lg text-[11px] font-medium border transition-all',
                  filter === s
                    ? 'bg-primary/15 border-primary/30 text-primary'
                    : 'bg-secondary/40 border-border/30 text-muted-foreground/70 hover:text-foreground',
                )}
              >
                {s === 'all' ? 'All' : s === 'in_transit' ? 'In Transit' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Trip table/cards */}
        <div className="space-y-2">
          {/* Desktop table header */}
          <div className="hidden lg:grid grid-cols-12 gap-3 px-4 py-2 text-[10px] text-muted-foreground/50 uppercase tracking-wider font-semibold">
            <div className="col-span-3">Route / Trip</div>
            <div className="col-span-2">Bus</div>
            <div className="col-span-2">Schedule</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Pax</div>
            <div className="col-span-1">Driver</div>
            <div className="col-span-1">Signal</div>
            <div className="col-span-1"></div>
          </div>

          {filtered.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              {/* Desktop row */}
              <div className="hidden lg:grid grid-cols-12 gap-3 glass-card px-4 py-3 items-center card-hover">
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <div className="font-display text-sm font-semibold text-foreground">{trip.routeName}</div>
                    {trip.isLive && <Wifi className="w-3 h-3 text-success" />}
                  </div>
                  <div className="text-[10px] text-muted-foreground/50 font-mono">{trip.tripCode}</div>
                </div>
                <div className="col-span-2 text-xs text-muted-foreground/80 truncate">{trip.busName}</div>
                <div className="col-span-2 text-xs text-muted-foreground/80">{trip.departureTime} → {trip.expectedArrival}</div>
                <div className="col-span-1"><TripStatusBadge status={trip.status} /></div>
                <div className="col-span-1 text-xs text-muted-foreground/80">{trip.passengers.bookedSeats}/{trip.passengers.totalSeats}</div>
                <div className="col-span-1 text-xs text-muted-foreground/80 truncate">{trip.driver.name.split(' ')[0]}</div>
                <div className="col-span-1">
                  {trip.gps ? (
                    <span className={cn('text-[10px] font-medium capitalize', {
                      'text-success': trip.gps.signalQuality === 'strong',
                      'text-warning': trip.gps.signalQuality === 'moderate',
                      'text-destructive': trip.gps.signalQuality === 'weak',
                    })}>{trip.gps.signalQuality}</span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground/30">—</span>
                  )}
                </div>
                <div className="col-span-1">
                  <Link to={`/staff/trip/${trip.id}`}>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground/70 hover:text-foreground">
                      Open <ArrowUpRight className="w-3 h-3 ml-0.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Mobile card */}
              <Link to={`/staff/trip/${trip.id}`} className="lg:hidden block glass-card p-4 card-hover">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-bold text-foreground">{trip.routeName}</span>
                      {trip.isLive && <Wifi className="w-3 h-3 text-success" />}
                    </div>
                    <span className="text-[10px] text-muted-foreground/50 font-mono">{trip.tripCode}</span>
                  </div>
                  <TripStatusBadge status={trip.status} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-muted-foreground/70">
                  <span><Bus className="w-3 h-3 inline mr-1" />{trip.busName.split(' ').slice(-1)}</span>
                  <span><Clock className="w-3 h-3 inline mr-1" />{trip.departureTime}</span>
                  <span><Users className="w-3 h-3 inline mr-1" />{trip.passengers.bookedSeats}/{trip.passengers.totalSeats}</span>
                </div>
                {trip.status === 'delayed' && trip.delayMinutes && (
                  <div className="mt-2 text-[10px] text-destructive">⚠ +{trip.delayMinutes}min — {trip.delayReason}</div>
                )}
              </Link>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="glass-card p-10 text-center">
              <Bus className="w-10 h-10 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground/50">No trips found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
