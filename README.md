# MarginFlow

A small-business cash flow and anomaly detection app. Track incoming and outgoing money, spot unusual patterns, and keep a clearer picture of runway.

## Project structure

```
MarginFlow/
├── backend/    FastAPI API
└── frontend/   Vite + React + Tailwind CSS
```

## Prerequisites

- Python 3.11+
- Node.js 20+
- npm 10+

## Backend

### Docker (recommended for the local ML backend)

Run these commands from the project root. Docker Desktop must be running with its Linux engine enabled.

```bash
docker compose up --build -d
docker compose ps
```

The API is available at [http://localhost:8000](http://localhost:8000), with interactive docs at [http://localhost:8000/docs](http://localhost:8000/docs). The Compose health check reports when the API is ready.

To stop the backend:

```bash
docker compose down
```

### Run directly with Python

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Health check: [http://localhost:8000/api/health](http://localhost:8000/api/health)

Analyze upload: `POST /api/analyze` with a `.csv`, `.xlsx`, or `.xls` file field named `file`.

Expected columns (aliases work too): `date`, `amount` (or `total`, `price`, `debit`/`credit`), optional `description` and `category`.

Interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Frontend

```bash
cd frontend
npm install
npm run dev
```

App: [http://localhost:5173](http://localhost:5173)

The Vite proxy forwards `/api` requests to the FastAPI server on port 8000.

## License

Private / unpublished for now.
