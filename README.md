# 🧙‍♂️ OSRS Price Tracker

A full-stack web application that displays live-updating Old School RuneScape (OSRS) item prices using a FastAPI backend and a React frontend. The prices are synced from the official OSRS Wiki API every 30 seconds and displayed in a searchable, sortable, paginated table.

---

## 📦 Tech Stack

- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, Uvicorn
- **Frontend**: React, Tailwind CSS, react-data-table-component
- **Database**: PostgreSQL
- **Scheduler**: FastAPI background task (custom polling)
- **API Source**: https://prices.runescape.wiki

---

## 🛠️ Backend Setup

### ✅ Prerequisites

- Python 3.9+
- PostgreSQL
- pip / pipenv / poetry (any package manager)

### 📂 Directory

Navigate to the backend folder (assume root or `backend/`).

### 1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install dependencies:

```bash
pip install -r requirements.txt
```

If `requirements.txt` doesn't exist yet:

```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary requests python-dotenv
```

Then generate the `requirements.txt`:

```bash
pip freeze > requirements.txt
```

### 3. Create the PostgreSQL database

Log into PostgreSQL and run:

```sql
CREATE DATABASE osrs_prices;

-- Switch to the database
\c osrs_prices

-- Create tables
CREATE TABLE items (
    id INTEGER PRIMARY KEY,
    name TEXT,
    examine TEXT,
    members BOOLEAN,
    lowalch FLOAT,
    highalch FLOAT,
    value FLOAT,
    limit INTEGER,
    icon TEXT
);

CREATE TABLE item_prices (
    id SERIAL PRIMARY KEY,
    item_id INTEGER UNIQUE REFERENCES items(id),
    high FLOAT,
    highTime INTEGER,
    low FLOAT,
    lowTime INTEGER,
    last_updated TIMESTAMP DEFAULT NOW()
);
```

### 4. Run the FastAPI server

```bash
uvicorn main:app --reload
```

> Make sure the background task to sync prices is running every 30 seconds.

---

## 🌐 Frontend Setup

### ✅ Prerequisites

- Node.js (v18+)
- npm

### 📂 Folder structure

```bash
cd frontend
```

### 1. Initialize project:

```bash
npm init vite@latest
# Choose framework: React
# Choose variant: JavaScript
```

### 2. Install dependencies:

```bash
npm install
npm install react-data-table-component tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Tailwind Setup (`tailwind.config.js`)

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 4. Add Tailwind to `index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. Run React Dev Server

```bash
npm run dev
```

### ✅ Expected Result

Visit `http://localhost:5173` — the app should display a table of RuneScape items with:

- Name
- Buy price (high)
- Sell price (low)
- Margin
- Timestamps
- Alch values
- Limit
- And more...

---

## 🔁 Syncing Prices

Prices are updated every 30 seconds via a background task in FastAPI using this endpoint:

```
https://prices.runescape.wiki/api/v1/osrs/latest
```

Only those items that exist in your local DB (`items` table) are updated.

---

## 🔒 CORS Note

If CORS error appears in browser:

Make sure you added CORS in FastAPI:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or replace with your frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🔍 Features

- 🔄 Auto-syncs live prices
- 🔍 Search every column
- 📊 Pagination (50 items per page)
- 🔃 Sorted table columns
- 🌙 Responsive and clean UI

---

## 📁 Future Scope

- User login and watchlist
- Real-time charts using WebSocket
- Export table to CSV
- Add favorite items and alerts

---

## 📬 Contact

Built with ❤️ by Prakhar Verma  
Feel free to reach out on [LinkedIn](https://www.linkedin.com/pv2908) or email me if you'd like to contribute or ask anything.

---
