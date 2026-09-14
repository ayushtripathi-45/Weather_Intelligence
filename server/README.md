# Weather Intelligence — Server

Node.js + Express + MongoDB backend for the Weather Intelligence platform.

## Setup

```bash
cd server
npm install
cp .env.example .env
```

Fill in `server/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/weather-intelligence
WEATHER_API_KEY=your_openweathermap_key
YOUTUBE_API_KEY=your_youtube_data_api_key
```

- **WEATHER_API_KEY** — free key from https://openweathermap.org/api (used for current weather, 5-day/3-hour forecast, and geocoding).
- **YOUTUBE_API_KEY** — from the Google Cloud Console, with the YouTube Data API v3 enabled.
- **MONGODB_URI** — a local MongoDB instance or a MongoDB Atlas connection string.

Run it:

```bash
npm run dev     # auto-restarts on file changes (Node's --watch)
npm start       # plain node server.js
```

The API starts on `http://localhost:5000`. Health check: `GET /api/health`.

## Architecture

```text
Route -> Controller -> Service -> External API / MongoDB
```

```text
server/
├── app.js              Express app: middleware + route mounting
├── server.js            Entry point: connects DB, starts the HTTP server
├── config/               env.js, db.js
├── routes/               One file per resource, thin — just wires paths to controllers
├── controllers/          Request/response handling, calls services
├── services/             All external API calls + business logic
│   ├── geocodingService.js   City / postal code / landmark / lat,lon -> coordinates
│   ├── weatherService.js     OpenWeatherMap current + forecast + alerts
│   ├── mapService.js         Coordinate validation for the map view
│   ├── youtubeService.js     YouTube Data API search
│   └── exportService.js      JSON / CSV / PDF generation
├── models/               Mongoose schemas (WeatherHistory)
├── middleware/           Validation, 404 handler, centralized error handler
└── utils/                AppError, asyncHandler, apiResponse helpers
```

## API Reference

All responses use this shape:

**Success**
```json
{ "success": true, "data": { }, "message": "Weather retrieved successfully" }
```

**Error**
```json
{ "success": false, "message": "Location not found", "error": "LOCATION_NOT_FOUND" }
```

### Weather

| Method | Endpoint | Query params | Notes |
|---|---|---|---|
| GET | `/api/weather/current` | `location` (city, postal code, landmark, or `lat,lon`) | Current conditions |
| GET | `/api/weather/forecast` | `location` | 5-day forecast + alerts |
| GET | `/api/weather/coordinates` | `lat`, `lon` | Current weather by coordinates |

### History (CRUD)

| Method | Endpoint | Body | Notes |
|---|---|---|---|
| POST | `/api/weather/history` | `{ location, startDate, endDate }` | Geocodes + fetches live weather, then saves |
| GET | `/api/weather/history` | — | Query: `search`, `sort` (`newest`\|`oldest`), `date` |
| GET | `/api/weather/history/:id` | — | Single record |
| PUT | `/api/weather/history/:id` | `{ location, startDate, endDate }` | Re-fetches weather only if location changed |
| DELETE | `/api/weather/history/:id` | — | Deletes the record |

Example request:
```json
POST /api/weather/history
{
  "location": "Gwalior",
  "startDate": "2026-09-12",
  "endDate": "2026-09-16"
}
```

### Location

| Method | Endpoint | Query params |
|---|---|---|
| GET | `/api/location/search` | `q` — returns geocoding candidates for autocomplete/"Did you mean?" |
| GET | `/api/location/map` | `location` — `lat,lon` string, returns validated coordinates |

### YouTube

| Method | Endpoint | Query params |
|---|---|---|
| GET | `/api/youtube` | `location` — returns up to 6 related travel videos, or an empty list if the API fails |

### Export

| Method | Endpoint | Returns |
|---|---|---|
| GET | `/api/export/json` | Downloads `weather-history.json` |
| GET | `/api/export/csv` | Downloads `weather-history.csv` |
| GET | `/api/export/pdf` | Downloads `weather-history.pdf` |

## Error Handling

- Every thrown `AppError(message, statusCode, errorCode)` is caught centrally in `middleware/errorHandler.js`.
- Unexpected (non-operational) errors are logged server-side and returned to the client as a generic message — stack traces are never exposed.
- Common error codes: `LOCATION_NOT_FOUND` (404), `INVALID_DATE_RANGE` (422), `RECORD_NOT_FOUND` (404), `INVALID_ID` (400), `SERVICE_UNAVAILABLE` (503), `WEATHER_API_ERROR` (503).

## Testing with curl

```bash
curl "http://localhost:5000/api/weather/current?location=Gwalior"
curl "http://localhost:5000/api/weather/forecast?location=10001"
curl -X POST http://localhost:5000/api/weather/history \
  -H "Content-Type: application/json" \
  -d '{"location":"London","startDate":"2026-09-14","endDate":"2026-09-18"}'
curl http://localhost:5000/api/weather/history
curl -X DELETE http://localhost:5000/api/weather/history/<id>
```
