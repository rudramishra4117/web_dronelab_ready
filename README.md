# DroneLab Web Application

Welcome to the DroneLab project! This README contains all the essential information a developer needs to work on this project effectively, including the project structure, Docker commands, and important developer notes.

---

## 🏗️ Project Structure

The project is divided into three main components:

1. **`Backend/` (Django + Django Ninja API)**
   - Houses the core database models, admin panel, and REST APIs.
   - Core apps:
     - `accounts`: User authentication and logic.
     - `content`: Primary application models (Bootcamps, PoCs, Hero Images, What We Do, etc.).
     - `services`: Service definitions and galleries.
   - The backend uses SQLite locally.
   - Admin Panel uses the **Unfold** theme.

2. **`Frontend/` (React + Vite + TailwindCSS)**
   - The user-facing single page application (SPA).
   - Core directories:
     - `src/pages`: Individual route components (e.g., LandingPage, PocPage, BootcampPage).
     - `src/components`: Reusable UI elements (NavBar2, carousels, cards).
     - `src/api`: Axios configuration and API wrapper functions.

3. **`nginx/`**
   - Reverse proxy configuration for routing traffic to the backend API (`/api/` and `/admin/`) and serving the frontend.

---

## 🐳 Docker Commands

The entire stack is containerized using Docker Compose. All operations should generally be run from the root of the project (where `docker-compose.yml` is located).

### Starting the Project
To build and start all containers in the background:
```bash
docker-compose up -d --build
```
> **Note:** The API will be accessible at `http://localhost:8000/api/` and the frontend at `http://localhost:5173/` (or whatever ports are exposed in the compose file).

### Stopping the Project
```bash
docker-compose down
```

### Viewing Logs
To see the live logs for all services:
```bash
docker-compose logs -f
```
To view logs for a specific service (e.g., `frontend` or `backend`):
```bash
docker-compose logs -f backend
```

### Rebuilding a Specific Service
If you change package dependencies (`package.json` or `requirements.txt`), you must rebuild without using the cache:
```bash
# Rebuild frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend

# Rebuild backend
docker-compose build --no-cache backend
docker-compose up -d backend
```

---

## 🛠️ Backend Development Commands (Django)

Because the project runs in Docker, you execute Django management commands *inside* the backend container using `docker-compose exec`.

### 1. Database Migrations
Whenever you change a model in `Backend/Drone_web/*/models.py`, you must create and apply migrations:
```bash
# Generate the migration files
docker-compose exec backend python manage.py makemigrations

# Apply migrations to the database
docker-compose exec backend python manage.py migrate
```

### 2. Creating a Superuser
To log into the Django Admin panel, you need an admin account:
```bash
docker-compose exec backend python manage.py createsuperuser
```
Follow the prompts to set your email and password.

### 3. Accessing the Django Shell
To interact with the database directly using Python:
```bash
docker-compose exec backend python manage.py shell
```

### 4. Restarting the Backend
If you change Python code that doesn't trigger the auto-reloader (or if you just need a hard refresh):
```bash
docker-compose restart backend
```

---

## 🚀 Important Developer Notes

### 1. Dynamic Proof of Concepts (PoCs)
The PoC system is fully dynamic.
- **Adding PoCs:** Added via the Django Admin (`content` app -> `PocItems`).
- **Navbar Integration:** The `NavBar2.jsx` component fetches all active PoCs. 
- **Names & Ordering:** 
  - The dropdown name is controlled by the `navbar_name` field in the Admin. If left blank, it defaults to "PoC 1", "PoC 2", etc.
  - The order in which they appear in the navbar is strictly controlled by the **`order`** field in the Admin (lower numbers appear first). When creating a new PoC, ensure you set its `order` appropriately so it doesn't accidentally show up in the middle of the list.

### 2. Theming
The frontend supports a Light and Dark mode using Tailwind's `dark:` classes and CSS variables located in `Frontend/src/index.css`.
- A floating theme toggle button is globally available.
- When creating new pages (like `PocPage.jsx`), avoid hardcoding background colors like `bg-[#050510]`. Instead, let the global wrapper handle the background, or use Tailwind's `dark:bg-slate-900` syntax to ensure it transitions correctly between themes.

### 3. API & Axios
All backend calls are routed through Axios (`Frontend/src/api/axios.js`). 
- The backend endpoints are defined using **Django Ninja** (not Django REST Framework). Look for `api.py` inside the Django apps to see endpoint definitions.

---

## 🏃 Running Locally (Without Docker)

If you prefer to run the project without Docker for faster iteration:

**Backend:**
```bash
cd Backend/Drone_web
python -m pip install -r requirements.txt
python manage.py runserver
```

**Frontend:**
```bash
cd Frontend
npm install
npm run dev
```