import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bus, ArrowLeft, Clock, Users, MapPin, Wifi, WifiOff,
  Navigation, Signal, Battery, Play, LogIn, ArrowRight,
  AlertTriangle, CheckCircle2, Star, MapPinned, Gauge
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockTrips } from '@/data/mockTrips';
import { TripStatus } from '@/types/tripOperations';
import TripStatusBadge from '@/components/trips/TripStatusBadge';
import RouteProgressTracker from '@/components/trips/RouteProgressTracker';
import MarkArrivedModal from '@/components/trips/MarkArrivedModal';
import DelayReportModal from '@/components/trips/DelayReportModal';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function TripControl() {
  const { id } = useParams<{ id: string }>();
  const trip = mockTrips.find((t) => t.id === id) || mockTrips[0];
  const [status, setStatus] = useState<TripStatus>(trip.status);
  const [arrivedOpen, setArrivedOpen] = useState(false);
  const [delayOpen, setDelayOpen] = useState(false);

  const handleStatusChange = (newStatus: TripStatus) => {
    setStatus(newStatus);
    const labels: Record<TripStatus, string> = {
      scheduled: 'Trip scheduled',
      boarding: 'Boarding started',
      in_transit: 'Trip departed — tracking live',
      delayed: 'Delay reported',
      arrived: 'Trip marked as arrived',
    };
    toast.success(labels[newStatus]);
  };

  const isArrived = status === 'arrived';

  // What action buttons to show based on current status
  const actionButtons = () => {
    switch (status) {
      case 'scheduled':
        return (
          <Button onClick={() => handleStatusChange('boarding')} className="flex-1 h-12 bg-warning text-warning-foreground font-semibold btn-accent-glow">
            <LogIn className="w-4 h-4 mr-1.5" /> Start Boarding
          </Button>
        );
      case 'boarding':
        return (
          <Button onClick={() => handleStatusChange('in_transit')} className="flex-1 h-12 bg-success text-success-foreground font-semibold">
            <Play className="w-4 h-4 mr-1.5" /> Mark Departed
          </Button>
        );
      case 'in_transit':
        return (
          <>
            <Button onClick={() => setDelayOpen(true)} variant="outline" className="flex-1 h-12 border-destructive/30 text-destructive hover:bg-destructive/10">
              <AlertTriangle className="w-4 h-4 mr-1.5" /> Report Delay
            </Button>
            <Button onClick={() => setArrivedOpen(true)} className="flex-1 h-12 bg-accent text-accent-foreground font-semibold btn-accent-glow">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Mark Arrived
            </Button>
          </>
        );
      case 'delayed':
        return (
          <>
            <Button onClick={() => handleStatusChange('in_transit')} variant="outline" className="flex-1 h-12 border-success/30 text-success hover:bg-success/10">
              <ArrowRight className="w-4 h-4 mr-1.5" /> Resume Trip
            </Button>
            <Button onClick={() => setArrivedOpen(true)} className="flex-1 h-12 bg-accent text-accent-foreground font-semibold btn-accent-glow">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Mark Arrived
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background dark pb-24 sm:pb-6">
      {/* Header */}
      <header className="border-b border-border/30 bg-card/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="container flex items-center gap-3 h-14">
          <Link to="/staff/trips" className="w-8 h-8 rounded-lg bg-secondary/60 border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-sm font-bold text-foreground truncate">{trip.routeName}</h1>
            <p className="text-[10px] text-muted-foreground/60 font-mono">{trip.tripCode}</p>
          </div>
          <TripStatusBadge status={status} size="md" pulse />
        </div>
      </header>

      <div className="container py-4 space-y-4">
        {/* Trip info header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">{trip.origin} → {trip.destination}</h2>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground/70">
                <span className="flex items-center gap-1"><Bus className="w-3 h-3" /> {trip.busName}</span>
                <span className="text-muted-foreground/30">·</span>
                <span className="font-mono text-[11px]">{trip.busRegistration}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="py-2 px-1 rounded-lg bg-secondary/30">
              <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Depart</div>
              <div className="text-sm font-semibold text-foreground mt-0.5">{trip.departureTime}</div>
            </div>
            <div className="py-2 px-1 rounded-lg bg-secondary/30">
              <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">ETA</div>
              <div className="text-sm font-semibold text-foreground mt-0.5">{trip.expectedArrival}</div>
            </div>
            <div className="py-2 px-1 rounded-lg bg-secondary/30">
              <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Stops</div>
              <div className="text-sm font-semibold text-foreground mt-0.5">{trip.stops.length}</div>
            </div>
          </div>
        </motion.div>

        {/* Connection indicators */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="flex gap-2"
        >
          {[
            { icon: trip.isLive ? Wifi : WifiOff, label: trip.isLive ? 'Live' : 'Offline', active: trip.isLive, color: 'success' },
            { icon: Navigation, label: 'GPS Active', active: !!trip.gps, color: 'info' },
            { icon: Signal, label: trip.gps?.signalQuality || 'N/A', active: trip.gps?.signalQuality !== 'offline', color: 'warning' },
            { icon: Battery, label: '78%', active: true, color: 'success' },
          ].map((ind, i) => (
            <div
              key={i}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border text-[10px] font-medium',
                ind.active
                  ? `bg-${ind.color}/10 border-${ind.color}/20 text-${ind.color}`
                  : 'bg-muted/20 border-border/30 text-muted-foreground/40',
              )}
            >
              <ind.icon className="w-3.5 h-3.5" />
              <span>{ind.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Route Progress */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-4"
        >
          <h3 className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-3">Route Progress</h3>
          <RouteProgressTracker stops={trip.stops} />
        </motion.div>

        {/* Map placeholder */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card overflow-hidden"
        >
          <div className="h-44 sm:h-56 bg-secondary/30 relative flex items-center justify-center">
            <div className="text-center">
              <MapPinned className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground/40">Live map will display here</p>
              {trip.gps && (
                <p className="text-[10px] text-muted-foreground/30 font-mono mt-1">
                  {trip.gps.lat.toFixed(4)}, {trip.gps.lng.toFixed(4)}
                </p>
              )}
            </div>
            {trip.gps && (
              <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                <div className="flex-1 glass-card px-3 py-2 flex items-center gap-2">
                  <Gauge className="w-3.5 h-3.5 text-info" />
                  <span className="text-[11px] text-foreground font-medium">{trip.gps.speed} km/h</span>
                </div>
                <div className="flex-1 glass-card px-3 py-2 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-warning" />
                  <span className="text-[11px] text-foreground font-medium">Updated {trip.gps.lastUpdated}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Passenger summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-4"
        >
          <h3 className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-3">Passenger Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total', value: trip.passengers.totalPassengers, icon: Users },
              { label: 'Booked', value: trip.passengers.bookedSeats, icon: CheckCircle2 },
              { label: 'Available', value: trip.passengers.availableSeats, icon: MapPin },
              { label: 'Capacity', value: trip.passengers.totalSeats, icon: Bus },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-secondary/30">
                <s.icon className="w-4 h-4 text-muted-foreground/50" />
                <div>
                  <div className="text-sm font-bold text-foreground">{s.value}</div>
                  <div className="text-[10px] text-muted-foreground/60">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/20 text-[11px] text-muted-foreground/60">
            <span className={cn('px-2 py-0.5 rounded-full border text-[10px] font-semibold',
              trip.passengers.seatType === 'AC' ? 'bg-info/10 border-info/20 text-info' : 'bg-warning/10 border-warning/20 text-warning'
            )}>
              {trip.passengers.seatType}
            </span>
            <span>{trip.passengers.fareType}</span>
          </div>
        </motion.div>

        {/* Staff info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass-card p-4"
        >
          <h3 className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-3">Assigned Staff</h3>
          <div className="space-y-2">
            {[trip.driver, trip.supervisor].filter(Boolean).map((staff) => (
              <div key={staff!.id} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-secondary/30">
                <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {staff!.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{staff!.name}</div>
                  <div className="text-[10px] text-muted-foreground/60 capitalize">{staff!.role} · {staff!.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Post-arrival state */}
        {isArrived && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-card-elevated p-6 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-accent/15 border-2 border-accent/30 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">Trip Completed</h3>
            <p className="text-xs text-muted-foreground/70 mt-1 mb-4">
              {trip.routeName} · Arrived at {trip.actualArrival || trip.expectedArrival}
            </p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="py-2 rounded-lg bg-secondary/30">
                <div className="text-sm font-bold text-foreground">{trip.passengers.totalPassengers}</div>
                <div className="text-[10px] text-muted-foreground/60">Passengers</div>
              </div>
              <div className="py-2 rounded-lg bg-secondary/30">
                <div className="text-sm font-bold text-foreground">{trip.stops.length}</div>
                <div className="text-[10px] text-muted-foreground/60">Stops</div>
              </div>
              <div className="py-2 rounded-lg bg-secondary/30">
                <div className="text-sm font-bold text-foreground">5h 30m</div>
                <div className="text-[10px] text-muted-foreground/60">Duration</div>
              </div>
            </div>

            {/* Passenger rating trigger placeholder */}
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20 text-xs text-warning flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>Passengers can now rate this trip</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Sticky bottom action bar — mobile */}
      {!isArrived && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border/30 p-3 sm:hidden">
          <div className="flex gap-2">
            {actionButtons()}
          </div>
        </div>
      )}

      {/* Desktop action bar */}
      {!isArrived && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="container hidden sm:block pb-6"
        >
          <div className="glass-card p-4 flex gap-3">
            {actionButtons()}
          </div>
        </motion.div>
      )}

      {/* Modals */}
      <MarkArrivedModal
        trip={trip}
        open={arrivedOpen}
        onOpenChange={setArrivedOpen}
        onConfirm={() => { setArrivedOpen(false); handleStatusChange('arrived'); }}
      />
      <DelayReportModal
        open={delayOpen}
        onOpenChange={setDelayOpen}
        onSubmit={(r) => { handleStatusChange('delayed'); toast.info(`Delay: ${r.estimatedDelay}min — ${r.reason}`); }}
      />
    </div>
  );
}
