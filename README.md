# SkyShards - Advanced Analytics Dashboard

A modern, high-performance Next.js 14 application for the SkyCards aircraft collection game. Built with TypeScript, Tailwind CSS, Shadcn UI, and Supabase.

## Features

- **Command Center (Dashboard)**: Overview metrics, collection completion tracking, and visual charts
- **Hangar (Collection Explorer)**: Browse your aircraft collection with advanced filtering and pagination
- **Battle Lab (Analytics)**: Performance analysis with scatter plots and sortable data tables
- **Aircraft Detail View**: Detailed technical specifications with progress bars
- **Dark/Light Mode**: System-aware theme toggle
- **Glassmorphism UI**: Modern, polished design with backdrop blur effects

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts

## Prerequisites

- Node.js 18+ and npm
- A Supabase project with the `aircraft` table

## Database Schema

The application expects a Supabase table named `aircraft` with the following schema:

```sql
CREATE TABLE aircraft (
  icao TEXT PRIMARY KEY,
  name TEXT,
  category TEXT,
  subcategory TEXT,
  rarity TEXT CHECK (rarity IN ('Common', 'Rare', 'Ultra', 'Legendary')),
  caught BOOLEAN,
  speed REAL,
  range REAL,
  ceiling REAL,
  weight REAL,
  rarity_score REAL
);
```

## Setup Instructions

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Supabase**:
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Fill in your Supabase credentials:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
skyshards/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Command Center view
│   ├── hangar/           # Collection Explorer view
│   ├── battle-lab/       # Analytics view
│   ├── layout.tsx        # Root layout with navigation
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── dashboard/        # Dashboard-specific components
│   ├── hangar/           # Hangar-specific components
│   ├── battle-lab/       # Battle Lab components
│   └── ui/               # Reusable UI components (Shadcn)
├── lib/                   # Utility functions
│   ├── supabaseClient.ts # Supabase client configuration
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features in Detail

### Command Center
- Total aircraft count
- Collection completion percentage with progress bar
- Top rarity indicator
- Legendary and Ultra rare counts
- Donut chart showing rarity distribution
- Bar chart showing fleet composition by category

### Hangar
- Responsive grid layout
- Search by name or ICAO code
- Multi-select rarity filtering
- "Show Only Missing" toggle
- Pagination (24 items per page)
- Click any card to view detailed specifications

### Battle Lab
- Interactive scatter plot (Rarity Score vs Win Rate)
- Sortable data table of top 50 performing aircraft
- Color-coded by rarity
- Simulated win rates (can be replaced with real data)

### Aircraft Detail Sheet
- Full technical specifications
- Progress bars comparing values to maximums
- Status indicator (Caught/Uncaught)
- Category and subcategory information

## Styling

The application uses a "Slate & Sky" color palette:
- Background: Slate-900 (dark) / Slate-50 (light)
- Accents: Sky-500/600
- Glassmorphism effects on cards
- Smooth transitions and hover effects

## Deployment

The application can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- Any platform supporting Next.js

Make sure to set your environment variables in your deployment platform's settings.

## License

ISC

## Contributing

This is a private project. For questions or issues, please contact the repository owner.

