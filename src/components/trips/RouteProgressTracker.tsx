import { RouteStop } from '@/types/tripOperations';
import { cn } from '@/lib/utils';
import { MapPin, Coffee, Flag, Circle, CheckCircle2 } from 'lucide-react';

interface RouteProgressTrackerProps {
  stops: RouteStop[];
}

export default function RouteProgressTracker({ stops }: RouteProgressTrackerProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-2">
      <div className="flex items-start min-w-max px-1">
        {stops.map((stop, i) => {
          const isLast = i === stops.length - 1;
          const StopIcon = stop.isOrigin ? Flag
            : stop.isDestination ? MapPin
            : stop.isBreakPoint ? Coffee
            : stop.completed ? CheckCircle2
            : Circle;

          return (
            <div key={stop.id} className="flex items-start">
              {/* Stop node */}
              <div className="flex flex-col items-center" style={{ minWidth: 72 }}>
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all',
                    stop.completed
                      ? 'bg-success/20 border-success text-success'
                      : stop.isCurrent
                      ? 'bg-warning/20 border-warning text-warning animate-pulse'
                      : 'bg-muted/30 border-border text-muted-foreground',
                  )}
                >
                  <StopIcon className="w-3.5 h-3.5" />
                </div>
                <span
                  className={cn(
                    'text-[10px] mt-1.5 text-center leading-tight font-medium max-w-[68px]',
                    stop.isCurrent ? 'text-warning' : stop.completed ? 'text-success' : 'text-muted-foreground',
                  )}
                >
                  {stop.shortName}
                </span>
                <span className={cn(
                  'text-[9px] mt-0.5',
                  stop.actualTime ? 'text-foreground/70' : 'text-muted-foreground/60',
                )}>
                  {stop.actualTime || stop.scheduledTime}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex items-center mt-3.5 mx-0.5" style={{ minWidth: 28 }}>
                  <div
                    className={cn(
                      'h-0.5 w-full rounded-full',
                      stops[i + 1]?.completed || stops[i + 1]?.isCurrent
                        ? 'bg-success/60'
                        : 'bg-border/60',
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
