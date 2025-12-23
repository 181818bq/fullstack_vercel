# Full stack blog application

Small full-stack example app with:
- Front-end: Vite + React + react-router
- Back-end: Node + Express (ESM) + Axios + Cors
- Persistent storage: MongoDB Atlas
- Authentication: Firebase

Repository layout
- front-end/ — React app (Vite)
- back-end/ — Express server (serves API and built front-end from `back-end/dist`)
- back-end/src/server.js — main server file
- back-end/src/credentials.json — Firebase service account (local testing)

Prerequisites
- Node.js (v18+ recommended) — includes npm. Install from https://nodejs.org/
- MongoDB (local `mongod` for development) or MongoDB Atlas
- Firebase service account JSON saved as `back-end/src/credentials.json`
- Vercel for prod front end hosting
- Render for prod back end hosting

Quick start — development

1. Install Node & MongoDB
- Install Node.js and restart your terminal if `npm` is not recognized.
- Start local MongoDB:
  - PowerShell: mongod
  - (Or run your Atlas instance and set env vars below.)

2. Run front-end (dev server)
```powershell
cd .\fullstack\front-end
npm install
npm run dev
```
- Vite dev server opens (by default) at http://localhost:5173. If you start the front-end dev server you can use it directly during development.

3. Run back-end (API)
```powershell
cd .\fullstack\back-end
npm install
# if package.json has a dev script (nodemon / ts-node), use:
npm run dev
# otherwise run directly (Node must support ESM and package.json "type": "module"):
node src/server.js
# or use nodemon for auto-reload:
npx nodemon --watch src --exec "node src/server.js"
```

Serving production front-end from back-end
1. Build front-end
```powershell
cd .\fullstack\front-end
npm run build
```
2. Copy the generated `dist` into the back-end `dist` folder (server serves `../dist`)
PowerShell example:
```powershell
# remove previous dist (if exists)
Remove-Item ..\back-end\dist -Recurse -Force -ErrorAction SilentlyContinue
# copy new build output
Copy-Item -Path .\dist\* -Destination ..\back-end\dist -Recurse
```
3. Run back-end as above. The server will serve the static files from `back-end/dist`.

Environment / configuration
- Local MongoDB URI (default used in server.js): `mongodb://127.0.0.1:27017`
- For MongoDB Atlas, set environment variables before starting the server:
  - MONGODB_USERNAME
  - MONGODB_PASSWORD
  Server will use the Atlas connection string when those vars are present.

- Firebase credentials:
  - Local Firebase service account JSON at `back-end/src/credentials.json` (server reads it synchronously).
  - The server middleware expects an `authtoken` header for protected routes.

Common issues & troubleshooting
- "npm is not recognized": install Node.js and restart the terminal.
- ENOENT package.json when running `npm` in repository root: run npm commands inside the folder that contains package.json (e.g. `front-end` or `back-end`).
- Vite import errors (e.g. `Failed to resolve import "./article-content"`): check relative import paths; `./` vs `../` depends on file location.
- MongoParseError: Invalid scheme — ensure connection string starts with `mongodb://` or `mongodb+srv://`.
- Server ESM import issues: Node must run with ESM support (package.json "type": "module") or use appropriate flags.
- React warnings: unique key prop for lists — ensure each list child has a stable unique `key` (use id or fallback index).
- TypeScript: create declaration files for .js modules you import (e.g. `article-content.d.ts`) or convert files to .ts/.tsx.

Backend note about comments shape
- Current server pushes comments like:
```js
$push: { comments: { newComment } }
```
which results in documents like:
```json
comments: [{ newComment: { postedBy: "...", text: "..." } }]
```
If you prefer flat comments used by the front-end, update the backend push to:
```js
$push: { comments: newComment }
```
so each comment becomes `{ postedBy, text }`.

Type fixes (React Router loaders)
- Loader argument should be typed using LoaderFunctionArgs (from `react-router-dom`) and validate `params.name` may be undefined before using.

License
- MIT (or choose appropriate license)
