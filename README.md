# Travel API

Full-stack aplikacija sa Node.js + Express backend i React frontend.

## Struktura projekta

```
travel-api/
├── src/                    # Backend (Node.js/TypeScript)
│   ├── controllers/        # API handlers
│   ├── routes/            # API rute
│   ├── models/            # MongoDB modeli
│   ├── lib/               # Utility biblioteke (Winston logger, JWT, Mongoose)
│   ├── config/            # Konfiguracija
│   └── server.ts          # Main server fajl
├── frontend/              # React frontend (Vite)
│   ├── src/              # React components i stranice
│   ├── dist/             # Build output (auto-generated)
│   └── package.json      # Frontend dependencies
├── package.json           # Root dependencies
└── .env                   # Okruženske promenljive
```

## Instalacija i pokretanje

### 1. Instalacija zavisnosti

```bash
npm install
```

To će instalirati zavisnosti za:
- **Backend** (root `node_modules`)
- **Frontend** (`frontend/node_modules`)

### 2. Build frontenda (proizvodnja)

```bash
npm run build
```

Ovo će build-ovati React frontend iz `frontend/src/` u `frontend/dist/` koji backend služi.

### 3. Pokretanje u development modu

```bash
npm run dev
```

Ovo će pokrenuti:
- **Backend**: http://localhost:3000 (sa api rutama na `/api/v1/*`)
- **Frontend**: http://localhost:5173 (dev server sa hot-reload)

### 4. Pokretanje u produkciji

```bash
npm run build
npm start
```

Backend će služiti React frontend iz `frontend/dist/` na `http://localhost:3000`

## Environment promenljive

Kreiraj `.env` fajl u root direktorijumu:

```
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb+srv://[username]:[password]@[cluster]/[database]
LOG_LEVEL=info
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_TOKEN=your-refresh-secret
ACCESS_TOKEN_EXPIRY=2h
REFRESH_TOKEN_EXPIRY=3w
```

## API rute

### Auth
- **POST** `/api/v1/auth/register` - Registracija korisnika
- **POST** `/api/v1/auth/login` - Logovanje korisnika

### Users
- **GET** `/api/v1/users` - Pregled korisnika
- **GET** `/api/v1/users/:id` - Korisnik po ID-u

### Travels
- **GET** `/api/v1/travels` - Lista putovanja
- **POST** `/api/v1/travels` - Kreiranje putovanja

## Baza podataka

MongoDB konekcija je konfigurirana preko `MONGO_URI` u `.env` fajlu.

Model:
- **User** - Korisnici sa email, password, username, role

## Technologies

- **Backend**: Node.js, Express, TypeScript, Mongoose, JWT
- **Frontend**: React, Vite, TypeScript, Bootstrap, Axios
- **Database**: MongoDB
- **Logging**: Winston
- **Security**: Helmet, CORS, Express Rate Limit

## Napomene

- Frontend build (`dist/`) je u `.gitignore` jer se auto-generiše sa `npm run build`
- `node_modules/` je ignorisan jer se instalira sa `npm install`
- Logovi se ispisuju samo u konzolu (iz security razloga)
