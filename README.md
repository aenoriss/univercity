# UniverCity

AR campus social portals — a physical ESP32-based "portal" device streams its camera into an AR web experience where students meet across locations.

## Structure
- `frontend/` — the React AR web app
- `stream-relay/` — Node/WebSocket relay bridging the ESP32 portal camera to the browser (formerly `portal_backend2`)

*Consolidated from `univercity` + `portal_backend2` (2026-07-05); full history preserved.*

> ⚠️ `frontend/.env` contains a committed Google Maps API key from the original repo — restrict/rotate it in Google Cloud (it persists in git history).
