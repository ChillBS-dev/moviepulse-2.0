from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework.generics import GenericAPIView
from rest_framework import status
from .utils import (
    send_otp_email,
    fetch_movie_data,
    MoviePagination,
    fetch_top_movies,
    fetch_movies_by_category,
    fetch_movie_details,
)
from .models import User, OneTimePassword
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.views import APIView
from django.core.cache import cache
import requests
from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

User = get_user_model()


@api_view(["GET"])
def hello_world(request):
    return Response({"message": "Hello, world!"}, status=status.HTTP_200_OK)


class UserCreateView(GenericAPIView):
    serializer_class = UserSerializer

    def post(self, request):
        user_data = request.data
        serializer = self.get_serializer(data=user_data)
        if serializer.is_valid():
            serializer.save()
            user = serializer.data
            send_otp_email(user["email"])
            return Response(
                {"data": user, "message": f"User created successfully"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, email=email, password=password)
        if user is None:
            return Response(
                {"error": "Invalid email or password"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response(
            {
                "refresh": str(refresh),
                "access": access_token,
            },
            status=status.HTTP_200_OK,
        )


class SearchMoviesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.GET.get("query")
        page = request.GET.get("page", 1)

        if not query:
            return Response(
                {"error": "Query parameter is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        movie_data = fetch_movie_data(query, page)

        if "error" in movie_data:
            return Response(
                {"error": movie_data["error"]},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(movie_data, status=status.HTTP_200_OK)


class TopMoviesListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        page = request.query_params.get("page", 1)

        data = fetch_top_movies(page)

        if "results" not in data:
            return Response(
                {"error": "Unexpected response from TMDB API. 'results' not found."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        paginator = MoviePagination()
        result_page = paginator.paginate_queryset(data["results"], request)

        return paginator.get_paginated_response(result_page)


class MoviesByCategoryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        category = request.query_params.get("category", "movies")
        page = request.query_params.get("page", 1)

        data = fetch_movies_by_category(category, page)

        if "error" in data:
            return Response(
                {"error": data["error"]},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        if "results" not in data:
            return Response(
                {"error": "Unexpected response from TMDB API."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        paginator = MoviePagination()
        result_page = paginator.paginate_queryset(data["results"], request)

        return paginator.get_paginated_response(result_page)


class MovieDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, movie_id):
        data = fetch_movie_details(movie_id)

        if "error" in data:
            return Response(
                {"error": data["error"]},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_trending(request):
    """Get top 10 trending movies, TV shows (no anime) and anime for the week"""
    access_token = settings.TMDB_ACCESS_TOKEN
    headers = {
        'Authorization': f'Bearer {access_token}',
        'accept': 'application/json'
    }

    # Trending movies this week
    movies_res = requests.get(
        'https://api.themoviedb.org/3/trending/movie/week',
        headers=headers,
        params={'language': 'fr-FR'}
    )
    movies_data = movies_res.json().get('results', [])[:10]

    # Trending TV shows - fetch more to filter out anime
    tv_res = requests.get(
        'https://api.themoviedb.org/3/trending/tv/week',
        headers=headers,
        params={'language': 'fr-FR'}
    )
    all_tv = tv_res.json().get('results', [])

    # Filter out anime (Japanese animation = genre 16 + original_language ja)
    series_data = [
        s for s in all_tv
        if not (s.get('original_language') == 'ja' and 16 in s.get('genre_ids', []))
    ][:10]

    # Anime : Japanese animation only
    anime_res = requests.get(
        'https://api.themoviedb.org/3/discover/tv',
        headers=headers,
        params={
            'language': 'fr-FR',
            'with_genres': '16',
            'with_original_language': 'ja',
            'sort_by': 'popularity.desc',
            'page': 1,
        }
    )
    anime_data = anime_res.json().get('results', [])[:10]

    def format_movie(i, item):
        return {
            'rank': i + 1,
            'id': item.get('id'),
            'title': item.get('title', item.get('name', 'N/A')),
            'poster_path': item.get('poster_path'),
            'backdrop_path': item.get('backdrop_path'),
            'overview': item.get('overview', ''),
            'vote_average': round(item.get('vote_average', 0), 1),
            'vote_count': item.get('vote_count', 0),
            'release_date': item.get('release_date', item.get('first_air_date', '')),
            'media_type': 'movie',
            'genre_ids': item.get('genre_ids', []),
        }

    def format_tv(i, item):
        return {
            'rank': i + 1,
            'id': item.get('id'),
            'title': item.get('name', item.get('title', 'N/A')),
            'poster_path': item.get('poster_path'),
            'backdrop_path': item.get('backdrop_path'),
            'overview': item.get('overview', ''),
            'vote_average': round(item.get('vote_average', 0), 1),
            'vote_count': item.get('vote_count', 0),
            'release_date': item.get('first_air_date', ''),
            'media_type': 'tv',
            'genre_ids': item.get('genre_ids', []),
        }

    return Response({
        'movies': [format_movie(i, m) for i, m in enumerate(movies_data)],
        'series': [format_tv(i, s) for i, s in enumerate(series_data)],
        'anime': [format_tv(i, a) for i, a in enumerate(anime_data)],
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change user password"""
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    if not old_password or not new_password:
        return Response(
            {'error': 'Both old and new passwords are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not user.check_password(old_password):
        return Response(
            {'old_password': ['Mot de passe incorrect']},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        validate_password(new_password, user)
    except ValidationError as e:
        return Response(
            {'error': list(e.messages)},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.set_password(new_password)
    user.save()

    return Response(
        {'message': 'Password changed successfully'},
        status=status.HTTP_200_OK
    )


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Update user profile (name, avatar)"""
    user = request.user
    
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    avatar = request.data.get('avatar')

    if first_name:
        user.first_name = first_name
    if last_name:
        user.last_name = last_name
    
    user.save()

    return Response(
        {
            'message': 'Profile updated successfully',
            'user': {
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
            }
        },
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    """Get current user profile"""
    user = request.user
    
    return Response(
        {
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'avatar': getattr(user, 'avatar', None),
        },
        status=status.HTTP_200_OK
    )


# ============================================
# ADMIN STATS - VRAIES DONNÉES
# ============================================

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_stats(request):
    """Retourne les vraies statistiques admin"""
    try:
        # Compter les utilisateurs
        total_users = User.objects.count()
        
        # Utilisateurs récents (10 derniers)
        recent_users = User.objects.order_by('-date_joined')[:10]
        
        # Compter les avis (si vous avez un modèle Review)
        try:
            from .models import Review
            total_reviews = Review.objects.count()
        except:
            total_reviews = 0
        
        # Données TMDB (films/séries)
        tmdb_api_key = settings.TMDB_API_KEY
        
        # Compter films populaires
        movies_response = requests.get(
            'https://api.themoviedb.org/3/movie/popular',
            params={'api_key': tmdb_api_key, 'language': 'fr-FR'}
        )
        total_movies = movies_response.json().get('total_results', 0)
        
        # Compter séries populaires
        series_response = requests.get(
            'https://api.themoviedb.org/3/tv/popular',
            params={'api_key': tmdb_api_key, 'language': 'fr-FR'}
        )
        total_series = series_response.json().get('total_results', 0)
        
        return Response({
            'total_users': total_users,
            'total_movies': total_movies,
            'total_series': total_series,
            'total_reviews': total_reviews,
            'recent_users': [
                {
                    'id': user.id,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'date_joined': user.date_joined.strftime('%d/%m/%Y à %H:%M'),
                }
                for user in recent_users
            ]
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)


# ============================================
# PAGINATION AMÉLIORÉE - 100 PAGES (2000 RÉSULTATS)
# ============================================

@api_view(['GET'])
@permission_classes([AllowAny])
def get_movies_paginated(request):
    """
    Récupère beaucoup de films/séries/anime avec pagination
    - 20 résultats par page côté frontend
    - 100 pages disponibles = 2000 résultats totaux
    - Récupération intelligente des pages TMDB
    """
    category = request.GET.get('category', 'movie')
    language = request.GET.get('language', 'fr-FR')
    page = int(request.GET.get('page', 1))
    
    # Mapper les langues
    lang_map = {
        'fr': 'fr-FR',
        'en': 'en-US',
        'es': 'es-ES',
        'de': 'de-DE',
        'it': 'it-IT',
        'ja': 'ja-JP',
    }
    tmdb_lang = lang_map.get(language, 'fr-FR')
    
    # Déterminer l'endpoint TMDB
    if category.lower() == 'anime':
        tmdb_category = 'tv'
        extra_params = {'with_genres': '16', 'with_original_language': 'ja'}
    elif category.lower() in ['series', 'tv']:
        tmdb_category = 'tv'
        extra_params = {}
    else:
        tmdb_category = 'movie'
        extra_params = {}
    
    # Configuration pagination
    items_per_page = 20
    tmdb_items_per_page = 20  # TMDB retourne 20 par page
    
    # Calculer quelle page TMDB récupérer
    # Page 1 frontend = page 1 TMDB
    # Page 2 frontend = page 2 TMDB
    # etc.
    tmdb_page = page
    
    # Limiter à 100 pages max
    if page > 100:
        return Response({
            'results': [],
            'page': page,
            'total_pages': 100,
            'total_results': 2000,
            'items_per_page': items_per_page,
            'message': 'Page maximum atteinte'
        })
    
    tmdb_api_key = settings.TMDB_API_KEY
    
    try:
        # Récupérer UNE page TMDB (rapide)
        response = requests.get(
            f'https://api.themoviedb.org/3/discover/{tmdb_category}',
            params={
                'api_key': tmdb_api_key,
                'language': tmdb_lang,
                'page': tmdb_page,
                'sort_by': 'popularity.desc',
                **extra_params
            },
            timeout=5
        )
        
        if response.status_code != 200:
            return Response({
                'error': 'Erreur TMDB',
                'results': []
            }, status=500)
        
        data = response.json()
        results = data.get('results', [])
        
        # Ajouter media_type et corriger les données
        for item in results:
            item['media_type'] = tmdb_category
            # Titre uniforme
            if 'name' in item and 'title' not in item:
                item['title'] = item['name']
            # S'assurer que l'ID est bien présent
            item['tmdb_id'] = item.get('id')
        
        # Total de pages : TMDB peut avoir jusqu'à 500 pages, mais on limite à 100
        tmdb_total_pages = min(data.get('total_pages', 100), 100)
        
        return Response({
            'results': results,
            'page': page,
            'total_pages': tmdb_total_pages,
            'total_results': tmdb_total_pages * items_per_page,
            'items_per_page': items_per_page
        })
        
    except requests.Timeout:
        return Response({
            'error': 'Timeout TMDB',
            'results': []
        }, status=504)
    except Exception as e:
        return Response({
            'error': str(e),
            'results': []
        }, status=500)


# ============================================
# DÉTAILS UTILISATEUR POUR ADMIN
# ============================================

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_all_users(request):
    """Liste tous les utilisateurs avec détails"""
    users = User.objects.all().order_by('-date_joined')
    
    return Response({
        'users': [
            {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'date_joined': user.date_joined.strftime('%d/%m/%Y à %H:%M'),
                'is_active': user.is_active,
                'is_staff': user.is_staff,
            }
            for user in users
        ]
    })
