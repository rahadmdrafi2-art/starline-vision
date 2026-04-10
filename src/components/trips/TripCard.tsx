import { Trip } from '@/types/tripOperations';
import { Link } from 'react-router-dom';
import TripStatusBadge from './TripStatusBadge';
import { Bus, Clock, Users, MapPin, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TripCardProps {
  trip: Trip;
}

export default function TripCard({ trip }: TripCardProps) {
  return (
    <Link
      to={`/staff/trip/${trip.id}`}
      className="block glass-card card-hover p-4 sm:p-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display text-sm font-bold text-foreground truncate">{trip.routeName}</h3>
            {trip.isLive && (
              <span className="flex items-center gap-1 text-[9px] text-success font-semibold uppercase tracking-wider">
                <Wifi className="w-3 h-3" />
                Live
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground/70 font-mono">{trip.tripCode}</p>
        </div>
        <TripStatusBadge status={trip.status} />
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-3">
        <div className="flex items-center gap-1.5 text-muted-foreground/80">
          <Bus className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{trip.busName}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground/80">
          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{trip.departureTime} → {trip.expectedArrival}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground/80">
          <Users className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{trip.passengers.bookedSeats}/{trip.passengers.totalSeats} seats</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground/80">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{trip.stops.length} stops</span>
        </div>
      </div>

      {/* Staff */}
      <div className="flex items-center justify-between pt-2 border-t border-border/30">
        <div className="text-[11px] text-muted-foreground/60">
          <span className="text-muted-foreground/80 font-medium">{trip.driver.name}</span>
          {trip.supervisor && <span> · Sup: {trip.supervisor.name}</span>}
        </div>
        <span className={cn(
          'text-[10px] font-semibold uppercase tracking-wider',
          trip.passengers.seatType === 'AC' ? 'text-info' : 'text-warning',
        )}>
          {trip.passengers.seatType}
        </span>
      </div>

      {trip.status === 'delayed' && trip.delayMinutes && (
        <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20 text-[11px] text-destructive">
          ⚠ Delayed by {trip.delayMinutes} min — {trip.delayReason}
        </div>
      )}
    </Link>
  );
}
