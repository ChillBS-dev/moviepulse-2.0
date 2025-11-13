import random
from django.core.mail import send_mail
from django.conf import settings
from .models import User, OneTimePassword
import requests
from rest_framework.pagination import PageNumberPagination
from django.core.cache import cache


def generate_otp():
    return random.randint(100000, 999999)


def send_otp_email(email):
    otp = generate_otp()
    subject = "OTP for MovieApp"

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return False

    email_from = settings.DEFAULT_FROM_EMAIL
    email_body = f"""
    Hello {user.first_name},

    Your OTP is {otp}. Please do not share this OTP with anyone.

    Regards,
    Team MovieApp
    """

    OneTimePassword.objects.create(user=user, otp=otp)

    try:
        print(f"Sending OTP email to {email}")
        send_mail(subject, email_body, email_from, [email], fail_silently=False)
    except Exception as e:

        print(f"Error sending OTP email: {e}")
        return False

    return True


class MoviePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


def fetch_movie_data(query, page=1):
    """Fetch movie data with caching to minimize API calls"""
    cache_key = f"search_movie_{query.lower()}_{page}"

    # Try to get from cache first
    cached_data = cache.get(cache_key)
    if cached_data:
        print(f"Cache HIT for search: {query} (page {page})")
        return cached_data

    print(f"Cache MISS for search: {query} (page {page}) - Fetching from API")
    url = f"https://api.themoviedb.org/3/search/movie"
    params = {
        "api_key": settings.TMDB_API_KEY,
        "query": query,
        "language": "en-US",
        "page": page,
        "include_adult": "false",
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        # Cache for 6 hours (21600 seconds)
        cache.set(cache_key, data, timeout=21600)
        return data
    else:
        return {"error": "Failed to fetch data from TMDb"}


def fetch_top_movies(page):
    """Fetch top movies with caching to minimize API calls"""
    cache_key = f"top_movies_page_{page}"

    # Try to get from cache first
    cached_data = cache.get(cache_key)
    if cached_data:
        print(f"Cache HIT for top movies (page {page})")
        return cached_data

    print(f"Cache MISS for top movies (page {page}) - Fetching from API")
    url = "https://api.themoviedb.org/3/discover/movie"
    params = {
        "include_adult": "false",
        "include_video": "false",
        "language": "en-US",
        "page": page,
        "sort_by": "popularity.desc",
    }

    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {settings.TMDB_ACCESS_TOKEN}",
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        data = response.json()
        # Cache for 12 hours (43200 seconds) - top movies don't change frequently
        cache.set(cache_key, data, timeout=43200)
        print(f"Cached top movies (page {page})")
        return data
    else:
        print(f"Error fetching top movies: {response.json()}")
        return {"error": "Failed to fetch data from TMDb"}


def fetch_movies_by_category(category, page=1):
    """Fetch movies by category (movies, series, documentaries) with caching"""
    cache_key = f"category_{category.lower()}_{page}"

    # Try to get from cache first
    cached_data = cache.get(cache_key)
    if cached_data:
        print(f"Cache HIT for category: {category} (page {page})")
        return cached_data

    print(f"Cache MISS for category: {category} (page {page}) - Fetching from API")

    # Map categories to TMDB genres/types
    if category.lower() == "movies":
        url = "https://api.themoviedb.org/3/discover/movie"
        params = {
            "include_adult": "false",
            "language": "en-US",
            "page": page,
            "sort_by": "popularity.desc",
        }
    elif category.lower() == "series" or category.lower() == "tv shows":
        url = "https://api.themoviedb.org/3/discover/tv"
        params = {
            "include_adult": "false",
            "language": "en-US",
            "page": page,
            "sort_by": "popularity.desc",
        }
    elif category.lower() == "documentaries":
        url = "https://api.themoviedb.org/3/discover/movie"
        params = {
            "include_adult": "false",
            "language": "en-US",
            "page": page,
            "sort_by": "popularity.desc",
            "with_genres": "99",  # Documentary genre ID
        }
    else:
        # Default to popular movies
        url = "https://api.themoviedb.org/3/discover/movie"
        params = {
            "include_adult": "false",
            "language": "en-US",
            "page": page,
            "sort_by": "popularity.desc",
        }

    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {settings.TMDB_ACCESS_TOKEN}",
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        data = response.json()
        # Cache for 12 hours (43200 seconds)
        cache.set(cache_key, data, timeout=43200)
        print(f"Cached category: {category} (page {page})")
        return data
    else:
        print(f"Error fetching category {category}: {response.status_code}")
        return {"error": "Failed to fetch data from TMDb"}


def fetch_movie_details(movie_id):
    """Fetch movie details with caching"""
    cache_key = f"movie_details_{movie_id}"

    # Try to get from cache first
    cached_data = cache.get(cache_key)
    if cached_data:
        print(f"Cache HIT for movie details: {movie_id}")
        return cached_data

    print(f"Cache MISS for movie details: {movie_id} - Fetching from API")
    url = f"https://api.themoviedb.org/3/movie/{movie_id}"
    params = {
        "api_key": settings.TMDB_API_KEY,
        "language": "en-US",
        "append_to_response": "videos,credits",
    }

    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()
        # Cache for 24 hours (86400 seconds) - movie details rarely change
        cache.set(cache_key, data, timeout=86400)
        print(f"Cached movie details: {movie_id}")
        return data
    else:
        return {"error": "Failed to fetch movie details from TMDb"}
