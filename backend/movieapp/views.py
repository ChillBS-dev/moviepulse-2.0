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
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.core.cache import cache
import requests
from django.conf import settings


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
    """Get top 10 trending movies, TV shows and anime for the week"""
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

    # Trending TV shows this week
    tv_res = requests.get(
        'https://api.themoviedb.org/3/trending/tv/week',
        headers=headers,
        params={'language': 'fr-FR'}
    )
    tv_data = tv_res.json().get('results', [])[:10]

    # Anime : Japanese animation
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
        'series': [format_tv(i, s) for i, s in enumerate(tv_data)],
        'anime': [format_tv(i, a) for i, a in enumerate(anime_data)],
    })
