import { TripStatus, STATUS_CONFIG } from '@/types/tripOperations';
import { cn } from '@/lib/utils';

interface TripStatusBadgeProps {
  status: TripStatus;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export default function TripStatusBadge({ status, size = 'sm', pulse = false }: TripStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-wider',
        config.bgClass,
        config.textClass,
        size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
      )}
    >
      {(status === 'in_transit' || status === 'boarding' || pulse) && (
        <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', {
          'bg-success': status === 'in_transit',
          'bg-warning': status === 'boarding',
          'bg-destructive': status === 'delayed',
          'bg-info': status === 'scheduled',
          'bg-accent': status === 'arrived',
        })} />
      )}
      {config.label}
    </span>
  );
}
