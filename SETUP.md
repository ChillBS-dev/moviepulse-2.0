# Movie Pulse - Environment Configuration

## Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
REACT_APP_API_URL=http://127.0.0.1:8000/api

# TMDB Configuration (for direct client calls if needed)
REACT_APP_TMDB_API_KEY=31e1faad65e47df30a0827e12d7ebe3d
```

## Backend Environment Variables

The `.env` file has been created in the `backend` directory with your TMDB credentials.

**Important**: Never commit the `.env` file to version control!

Add to your `.gitignore`:

```
# Environment variables
.env
.env.local
.env.production
```

## Running the Application

### Backend (Django)

```bash
cd backend
python manage.py migrate
python manage.py warmup_cache  # Pre-warm cache for guest users
python manage.py runserver
```

### Frontend (React)

```bash
cd frontend
npm install
npm start
```

## Guest Mode Features

- ✅ Browse movies without authentication
- ✅ Search movies and TV shows
- ✅ View movie details
- ✅ Fast cached responses
- ✅ All content accessible to guests
- ⚠️ Favorites require login (stored in localStorage)

## Cache Management

### Warm up cache (recommended on startup)

```bash
python manage.py warmup_cache
```

### Clear cache

```bash
python manage.py clear_cache
```

### Clear specific cache pattern

```bash
python manage.py clear_cache --pattern=top_movies
```
