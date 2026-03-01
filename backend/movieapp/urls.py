from django.urls import path
from . import views
from .views import (
    UserCreateView,
    LoginView,
    SearchMoviesView,
    TopMoviesListView,
    MoviesByCategoryView,
    MovieDetailView,
)

urlpatterns = [
    # Hello World
    path('hello/', views.hello_world, name='hello_world'),
    
    # Authentication
    path('register/', UserCreateView.as_view(), name='user_create'),
    path('login/', LoginView.as_view(), name='login'),
    
    # User Profile
    path('profile/', views.get_profile, name='get_profile'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('change-password/', views.change_password, name='change_password'),
    
    # Movies
    path('search/', SearchMoviesView.as_view(), name='search_movies'),
    path('top-movies/', TopMoviesListView.as_view(), name='top_movies'),
    path('movies/', MoviesByCategoryView.as_view(), name='movies_by_category'),
    path('movies/<int:movie_id>/', MovieDetailView.as_view(), name='movie_detail'),
    
    # Trending
    path('trending/', views.get_trending, name='get_trending'),
    
    # Pagination améliorée
    path('movies/paginated/', views.get_movies_paginated, name='movies_paginated'),
    
    # Admin
    path('admin/stats/', views.admin_stats, name='admin_stats'),
    path('admin/users/', views.get_all_users, name='get_all_users'),
]
