import { motion } from 'framer-motion';
import { Shield, Clock, MapPin, CreditCard, Bus, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnnouncementBar from '@/components/notices/AnnouncementBar';
import HomepageNoticesSection from '@/components/notices/HomepageNoticesSection';

const features = [
  { icon: Navigation, title: 'Live Tracking', desc: 'Track your coach in real-time from departure to destination' },
  { icon: Bus, title: 'Premium Fleet', desc: 'AC & Non-AC coaches with modern amenities' },
  { icon: MapPin, title: 'Seat Selection', desc: 'Choose your preferred seat with interactive coach maps' },
  { icon: CreditCard, title: 'Easy Payments', desc: 'Pay with bKash, Nagad, card, or at counter' },
  { icon: Clock, title: 'On-Time Promise', desc: '94% on-time performance across all routes' },
  { icon: Shield, title: 'Safe & Insured', desc: 'GPS tracked coaches with full passenger insurance' },
];

const trustItems = [
  { value: '94%', label: 'On-Time Performance' },
  { value: '24/7', label: 'Customer Support' },
  { value: '100%', label: 'Digital Ticketing' },
  { value: '45+', label: 'Active Routes' },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background dark">
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Navbar placeholder */}
      <nav className="border-b border-border/30 bg-card/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="container flex items-center justify-between h-14">
          <Link to="/" className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Bus className="w-4 h-4 text-primary-foreground" />
            </div>
            Star Line
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link to="/notices" className="hover:text-foreground transition-colors">Notices</Link>
            <Link to="/admin" className="hover:text-foreground transition-colors">Admin</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container py-20 sm:py-28 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-2xl mx-auto"
          >
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-starline-gold mb-4">
              Premium Intercity Transport
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
              Travel with <span className="text-gradient-primary">Confidence</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto">
              Experience world-class intercity coach services. Book your seat, track your journey, and travel in comfort.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all btn-primary-glow"
            >
              Search Trips
            </Link>
          </motion.div>
        </div>
        {/* Hero ambient effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
      </section>

      {/* Trust Strip */}
      <section className="border-b border-border/30 bg-card/30">
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="text-center"
              >
                <div className="text-xl sm:text-2xl font-display font-bold text-gradient-primary">{item.value}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-spacing">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-starline-gold">Why Star Line</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-2">A Better Way to Travel</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Premium service, dependable schedules, and a world-class booking experience.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass-card p-5 card-hover"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                  <f.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-display text-sm font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Updates & Notices */}
      <HomepageNoticesSection />

      {/* CTA */}
      <section className="section-spacing">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card-elevated p-8 sm:p-12 text-center"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-starline-gold">Ready?</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-2 mb-3">Book Your Next Trip</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Experience premium intercity travel with Star Line. Your seat is waiting.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all btn-primary-glow"
            >
              Search Trips
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-card/30 py-8">
        <div className="container text-center text-xs text-muted-foreground">
          © 2026 Star Line Group. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
