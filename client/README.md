# Weather Intelligence — Client

React + Vite + Tailwind frontend for the Weather Intelligence platform.

## Setup

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The dev server runs on http://localhost:5173 and proxies `/api/*` requests to
the backend at http://localhost:5000 (see `vite.config.js`). Make sure the
`server` app (built in the next step) is running before testing live data.

## Structure

```text
src/
  components/   Reusable UI (Navbar, SearchBar, CurrentWeather, charts, etc.)
  pages/        Route-level views (Dashboard, SavedSearches, MapPage, About)
  layouts/      MainLayout wraps every page with Navbar + Footer
  context/      ThemeContext (dark/light) and WeatherContext (search state)
  services/     Axios calls to the backend REST API (never calls external APIs directly)
  hooks/        useDebounce, useGeolocation
  utils/        formatters.js, validators.js
```

## Notes

- No API keys live in the frontend. All external calls go through the backend.
- Theme preference persists in `localStorage`.
- The core weather experience keeps working even if the Map or YouTube
  integrations fail — those components fail gracefully in isolation.
