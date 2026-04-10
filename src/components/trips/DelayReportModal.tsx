import { useState } from 'react';
import { DELAY_REASONS, DelayReport } from '@/types/tripOperations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Clock, AlertTriangle } from 'lucide-react';

interface DelayReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (report: DelayReport) => void;
}

export default function DelayReportModal({ open, onOpenChange, onSubmit }: DelayReportModalProps) {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [delay, setDelay] = useState(15);

  const handleSubmit = () => {
    onSubmit({ reason, customNote: note || undefined, estimatedDelay: delay });
    setReason('');
    setNote('');
    setDelay(15);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-destructive/20 sm:max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-destructive/15 border border-destructive/30 flex items-center justify-center mx-auto mb-2">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <DialogTitle className="font-display text-center text-lg">Report Delay</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground/80">
            Submit a delay report so passengers and control room are informed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground/80">Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="bg-secondary/50 border-border/50">
                <SelectValue placeholder="Select delay reason" />
              </SelectTrigger>
              <SelectContent>
                {DELAY_REASONS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground/80">Estimated Additional Delay</Label>
            <div className="flex items-center gap-2">
              {[15, 30, 45, 60, 90].map((m) => (
                <button
                  key={m}
                  onClick={() => setDelay(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    delay === m
                      ? 'bg-destructive/20 border-destructive/40 text-destructive'
                      : 'bg-secondary/50 border-border/50 text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground/80">Additional Notes (optional)</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Heavy traffic near Meghna bridge..."
              className="bg-secondary/50 border-border/50 text-sm h-20 resize-none"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!reason}
            className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Clock className="w-4 h-4 mr-1" />
            Submit Delay Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
