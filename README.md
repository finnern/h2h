# Hertz an Hertz: The Sync Deck

> "Nit schwätza - macha" (Don't just talk, do).

## 1. The Core Philosophy
Hertz an Hertz is a tool for synchronization. Based on Christiaan Huygens' 1665 observation of "Odd Sympathy" (Entrainment), where two pendulum clocks on the same beam eventually synchronized their swings through shared vibrations.

We apply this to relationships:
* **The Beam:** The shared time/space created by the cards.
* **The Pendulums:** The two partners.
* **The Frequency:** 52 Weekly Rituals (Questions & Actions).

## 2. The Tech Stack
* **Frontend:** React (Vite), TypeScript
* **Styling:** Tailwind CSS, Shadcn/ui
* **Animation:** Framer Motion (Critical for the "Pendulum Physics")
* **Backend/Logic:** Supabase (Auth/DB), Edge Functions (AI Generation)

## 3. Key Components

### The Huygens Engine (`src/components/`)
* **`SingleCuckooClock.tsx`**: The visual atom. Handles the pendulum swing animation, clock hands, and the "Chaos vs. Resonance" phase shift logic.
* **`CuckooClockSection.tsx`**: The scroll-driven narrative. As the user scrolls down, the "Sync Progress" moves from 0 (Chaos) to 1 (Resonance), forcing the two clocks into perfect step.

## 4. Project Structure

```
h2h/
├── src/
│   ├── components/
│   │   ├── SingleCuckooClock.tsx    # Individual clock with pendulum physics
│   │   ├── CuckooClockSection.tsx   # Scroll-linked synchronization layout
│   │   ├── TunerSection.tsx         # Tuning fork metaphor section
│   │   └── ui/                      # Shadcn components
│   ├── assets/
│   │   ├── cuckoo-house.svg
│   │   ├── cuckoo-pendulum.svg
│   │   ├── cuckoo-bird.svg
│   │   └── ...                      # Other SVG assets
│   ├── hooks/                       # Custom React hooks
│   ├── lib/                         # Utilities and Supabase client
│   └── pages/
│       └── Index.tsx                # Main landing page
├── supabase/
│   ├── functions/                   # Edge functions
│   └── migrations/                  # Database migrations
└── public/                          # Static assets
```

## 5. Development

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables
Create a `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 6. The Huygens Effect: Technical Implementation

The synchronization animation is built on component-based physics:
1. Each clock manages its own pendulum state (angle, velocity)
2. The coupling strength increases with scroll progress (0-100%)
3. When coupled, clocks influence each other through shared "vibrations"
4. At 100% sync, the pendulums move in perfect phase

This mirrors the real-world phenomenon Huygens discovered: two independent oscillators becoming one synchronized system through their shared foundation.

## 7. Repository

**GitHub:** https://github.com/finnern/h2h

## License

Proprietary - All rights reserved
