import { Trip } from '@/types/tripOperations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, AlertTriangle, Navigation, CheckCircle2 } from 'lucide-react';

interface MarkArrivedModalProps {
  trip: Trip;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function MarkArrivedModal({ trip, open, onOpenChange, onConfirm }: MarkArrivedModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-accent/20 sm:max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mx-auto mb-2">
            <MapPin className="w-6 h-6 text-accent" />
          </div>
          <DialogTitle className="font-display text-center text-lg">Mark Trip as Arrived</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground/80">
            This will mark <span className="text-foreground font-medium">{trip.routeName}</span> as having reached its final destination.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-2">
          <div className="glass-card p-3 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="font-medium">This action will:</span>
            </div>
            <ul className="space-y-1.5 text-muted-foreground/80 pl-5">
              <li>• Stop live GPS tracking for this trip</li>
              <li>• Notify passengers of arrival</li>
              <li>• Trigger post-trip rating flow</li>
              <li>• Lock trip status — cannot be undone</li>
            </ul>
          </div>

          {trip.gps && (
            <div className="glass-card p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-success/15 border border-success/30 flex items-center justify-center">
                <Navigation className="w-4 h-4 text-success" />
              </div>
              <div className="text-xs">
                <div className="text-muted-foreground/70">GPS Location Confirmed</div>
                <div className="text-foreground font-mono text-[11px]">
                  {trip.gps.lat.toFixed(4)}, {trip.gps.lng.toFixed(4)}
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-success ml-auto" />
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 btn-accent-glow"
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Confirm Arrival
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
