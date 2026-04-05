import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bus, LayoutDashboard, Bell } from 'lucide-react';
import AdminNoticesTab from '@/components/notices/AdminNoticesTab';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('notices');

  return (
    <div className="min-h-screen bg-background dark">
      {/* Admin Navbar */}
      <nav className="border-b border-border/30 bg-card/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="container flex items-center justify-between h-14">
          <Link to="/" className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Bus className="w-4 h-4 text-primary-foreground" />
            </div>
            Star Line
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-0.5 rounded-full ml-1">Admin</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors text-xs">← Back to Site</Link>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        <div className="flex items-center gap-3 mb-6">
          <LayoutDashboard className="w-5 h-5 text-primary" />
          <h1 className="font-display text-xl font-bold text-foreground">Admin Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border/30">
          <button
            onClick={() => setActiveTab('notices')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'notices'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Notices
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'notices' && <AdminNoticesTab />}
      </div>
    </div>
  );
}
