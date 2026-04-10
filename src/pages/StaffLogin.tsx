import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function StaffLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success('Welcome, Kamal Hossain', { description: 'Driver · Star Line Operations' });
    navigate('/staff/trips');
  };

  return (
    <div className="min-h-screen bg-background dark flex flex-col">
      {/* Header strip */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 btn-primary-glow">
              <Bus className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="font-display text-xl font-bold text-foreground">Star Line</h1>
            <p className="text-xs text-muted-foreground/70 mt-1">Trip Operations Portal</p>
          </div>

          {/* Login form */}
          <form onSubmit={handleLogin} className="glass-card p-6 space-y-5">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-info/10 border border-info/20 text-[11px] text-info">
              <Shield className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Authorized staff access only</span>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground/80">Phone or Email</Label>
              <Input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="01711-234567 or staff@starline.com"
                className="h-12 bg-secondary/50 border-border/50 text-sm"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground/80">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 bg-secondary/50 border-border/50 text-sm pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary text-primary-foreground font-semibold btn-primary-glow text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Quick role preview */}
          <div className="mt-5 glass-card p-4">
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-semibold mb-2">Demo Access</p>
            <div className="grid grid-cols-3 gap-2">
              {(['Driver', 'Supervisor', 'Admin'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setLoginId(role.toLowerCase() + '@starline.com');
                    setPassword('demo1234');
                  }}
                  className="px-2 py-2 rounded-lg bg-secondary/60 border border-border/40 text-[11px] text-muted-foreground/80 hover:text-foreground hover:border-primary/30 transition-all text-center font-medium"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-[10px] text-muted-foreground/40 mt-6">
            © 2026 Star Line Group · Operations v2.1
          </p>
        </motion.div>
      </div>
    </div>
  );
}
