# Weather Intelligence

Full-stack weather intelligence platform — React/Vite frontend + Express/MongoDB backend.

```text
weather-intelligence/
├── client/     React + Vite + Tailwind frontend  (see client/README.md)
├── server/     Node + Express + MongoDB backend  (see server/README.md)
└── package.json   Root script to run both together
```

## Quick start

```bash
npm run install:all

# copy env templates and fill in real keys
cp server/.env.example server/.env
cp client/.env.example client/.env

npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:5000 (health check at `/api/health`)

You need a free OpenWeatherMap API key (`WEATHER_API_KEY`) and a YouTube Data API v3
key (`YOUTUBE_API_KEY`) in `server/.env`, plus a MongoDB connection string
(`MONGODB_URI`) — local MongoDB or MongoDB Atlas both work.

See `client/README.md` and `server/README.md` for architecture details and full API docs.
