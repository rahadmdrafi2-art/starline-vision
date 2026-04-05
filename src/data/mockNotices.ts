import type { Notice } from '@/types/notices';

const now = new Date();
const hourAgo = new Date(now.getTime() - 3600000);
const dayAgo = new Date(now.getTime() - 86400000);
const twoDaysAgo = new Date(now.getTime() - 172800000);
const weekAgo = new Date(now.getTime() - 604800000);
const inWeek = new Date(now.getTime() + 604800000);

export const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'Eid-ul-Fitr Special Schedule — Extended Services',
    short_message: '🕌 Eid special services now available — Extra departures on all major routes. Book early!',
    summary: 'Star Line is running additional coaches on all major intercity routes for Eid-ul-Fitr. Extended operating hours and extra departures from all counters.',
    body: `## Eid-ul-Fitr Special Schedule 2026

Star Line Group is pleased to announce extended services for the upcoming Eid-ul-Fitr holiday season.

### Additional Services
- **Extra departures** on Dhaka–Chittagong, Dhaka–Sylhet, and Dhaka–Rajshahi routes
- **Extended operating hours** — first departure at 5:00 AM, last departure at 11:30 PM
- **All counters** will remain open from 4:30 AM to midnight

### Important Notes
- Early booking is strongly recommended
- All fares remain unchanged during Eid period
- Premium AC coaches available on all routes

Book your Eid journey today and travel with confidence.`,
    type: 'promotion',
    priority: 'high',
    status: 'published',
    is_pinned: true,
    is_dismissible: true,
    show_in_top_bar: true,
    show_on_homepage: true,
    cta_label: 'View Details',
    cta_url: '/notices/1',
    starts_at: hourAgo.toISOString(),
    expires_at: inWeek.toISOString(),
    created_by: null,
    created_at: dayAgo.toISOString(),
    updated_at: hourAgo.toISOString(),
    routes: [
      { id: 'r1', origin: 'Dhaka', destination: 'Chittagong' },
      { id: 'r2', origin: 'Dhaka', destination: 'Sylhet' },
      { id: 'r3', origin: 'Dhaka', destination: 'Rajshahi' },
    ],
    counters: [
      { id: 'c1', name: 'Gabtoli Counter', district: 'Dhaka' },
      { id: 'c2', name: 'Sayedabad Counter', district: 'Dhaka' },
    ],
  },
  {
    id: '2',
    title: 'Route Disruption: Dhaka–Sylhet via Habiganj',
    short_message: '⚠️ Dhaka–Sylhet via Habiganj route disrupted due to road maintenance. Expect 45-min delays.',
    summary: 'Due to ongoing road maintenance between Habiganj and Sylhet, coaches on this route may experience delays of up to 45 minutes. Alternative routes are being evaluated.',
    body: `## Route Disruption Notice

Due to scheduled road maintenance work by the Roads & Highways Department on the Habiganj-Sylhet section of the N2 highway, passengers traveling on the Dhaka-Sylhet route should expect delays.

### Impact
- Estimated delay: **30–45 minutes**
- Affected section: Habiganj to Sylhet (KM 180–220)
- Duration: Until further notice

### What We're Doing
- Monitoring road conditions hourly
- Evaluating alternative routing via Moulvibazar
- Providing real-time updates through our tracking system

We apologize for the inconvenience and appreciate your patience.`,
    type: 'route_notice',
    priority: 'critical',
    status: 'published',
    is_pinned: true,
    is_dismissible: false,
    show_in_top_bar: true,
    show_on_homepage: true,
    cta_label: 'Full Details',
    cta_url: '/notices/2',
    starts_at: hourAgo.toISOString(),
    expires_at: null,
    created_by: null,
    created_at: hourAgo.toISOString(),
    updated_at: hourAgo.toISOString(),
    routes: [
      { id: 'r2', origin: 'Dhaka', destination: 'Sylhet' },
    ],
    counters: [],
  },
  {
    id: '3',
    title: 'Fare Revision — Dhaka–Chittagong Route',
    short_message: '💰 Fare revision for Dhaka–Chittagong effective from 10 Apr 2026.',
    summary: 'Revised fares for the Dhaka–Chittagong route will take effect starting 10 April 2026. AC Economy and AC Business class fares updated.',
    body: `## Fare Revision Notice

Effective **10 April 2026**, the following fare adjustments will apply to the Dhaka–Chittagong route:

| Class | Current Fare | New Fare |
|-------|-------------|----------|
| Non-AC | ৳650 | ৳680 |
| AC Economy | ৳950 | ৳1,020 |
| AC Business | ৳1,400 | ৳1,480 |

### Reason
The fare revision reflects increased fuel costs and highway toll adjustments. Star Line remains committed to providing premium service at competitive prices.

Tickets already booked at previous fares will be honored.`,
    type: 'fare_update',
    priority: 'high',
    status: 'published',
    is_pinned: false,
    is_dismissible: true,
    show_in_top_bar: true,
    show_on_homepage: true,
    cta_label: 'View Details',
    cta_url: '/notices/3',
    starts_at: dayAgo.toISOString(),
    expires_at: inWeek.toISOString(),
    created_by: null,
    created_at: twoDaysAgo.toISOString(),
    updated_at: dayAgo.toISOString(),
    routes: [
      { id: 'r1', origin: 'Dhaka', destination: 'Chittagong' },
    ],
    counters: [],
  },
  {
    id: '4',
    title: 'Sayedabad Counter — Temporary Relocation',
    short_message: '🏢 Sayedabad counter temporarily relocated to Gate 3 (East Wing) until 15 Apr.',
    summary: 'Our Sayedabad counter has been temporarily moved to Gate 3, East Wing due to terminal renovation. All services remain fully operational.',
    body: `## Counter Relocation Notice

The Star Line counter at Sayedabad Bus Terminal has been temporarily relocated due to terminal renovation work.

### New Location
- **Gate 3, East Wing** — Sayedabad Bus Terminal
- Look for Star Line signage at the eastern entrance

### Duration
- From: 1 April 2026
- Until: 15 April 2026 (estimated)

All ticketing and customer services remain fully operational at the temporary location.`,
    type: 'maintenance',
    priority: 'normal',
    status: 'published',
    is_pinned: false,
    is_dismissible: true,
    show_in_top_bar: false,
    show_on_homepage: true,
    cta_label: null,
    cta_url: null,
    starts_at: weekAgo.toISOString(),
    expires_at: inWeek.toISOString(),
    created_by: null,
    created_at: weekAgo.toISOString(),
    updated_at: weekAgo.toISOString(),
    routes: [],
    counters: [
      { id: 'c2', name: 'Sayedabad Counter', district: 'Dhaka' },
    ],
  },
  {
    id: '5',
    title: 'New Route Launch: Dhaka–Cox\'s Bazar Direct',
    short_message: '🚌 New direct route! Dhaka–Cox\'s Bazar launching 15 Apr with AC Business class.',
    summary: 'Star Line is launching a new direct service from Dhaka to Cox\'s Bazar starting 15 April 2026. Premium AC Business coaches with onboard amenities.',
    body: `## New Route Announcement

Star Line Group is excited to announce the launch of our newest route:

### Dhaka → Cox's Bazar (Direct)
- **Launch Date:** 15 April 2026
- **Class:** AC Business
- **Departures:** 10:00 PM (Night Coach)
- **Duration:** ~10 hours
- **Fare:** ৳1,800

### Features
- Premium reclining seats
- Onboard entertainment
- Complimentary refreshments
- GPS live tracking

Early bird discount of 10% available for the first week of bookings.`,
    type: 'route_notice',
    priority: 'normal',
    status: 'published',
    is_pinned: false,
    is_dismissible: true,
    show_in_top_bar: false,
    show_on_homepage: false,
    cta_label: 'View Details',
    cta_url: '/notices/5',
    starts_at: twoDaysAgo.toISOString(),
    expires_at: inWeek.toISOString(),
    created_by: null,
    created_at: twoDaysAgo.toISOString(),
    updated_at: twoDaysAgo.toISOString(),
    routes: [
      { id: 'r4', origin: 'Dhaka', destination: "Cox's Bazar" },
    ],
    counters: [],
  },
  {
    id: '6',
    title: 'System Maintenance — Online Booking Downtime',
    short_message: '🔧 Scheduled maintenance: Online booking unavailable 2–4 AM, 8 Apr.',
    summary: 'Our online booking platform will undergo scheduled maintenance on 8 April from 2:00 AM to 4:00 AM BST. Counter bookings will remain available.',
    body: `## Scheduled Maintenance

Our online booking platform will undergo scheduled maintenance to improve performance and security.

### Downtime Window
- **Date:** 8 April 2026
- **Time:** 2:00 AM – 4:00 AM (BST)
- **Duration:** ~2 hours

### Impact
- Online ticket booking will be temporarily unavailable
- Live tracking may experience brief interruptions
- Counter-based ticketing will remain fully operational

We recommend completing any urgent bookings before the maintenance window.`,
    type: 'app_update',
    priority: 'normal',
    status: 'published',
    is_pinned: false,
    is_dismissible: true,
    show_in_top_bar: true,
    show_on_homepage: false,
    cta_label: null,
    cta_url: null,
    starts_at: dayAgo.toISOString(),
    expires_at: inWeek.toISOString(),
    created_by: null,
    created_at: dayAgo.toISOString(),
    updated_at: dayAgo.toISOString(),
    routes: [],
    counters: [],
  },
];
