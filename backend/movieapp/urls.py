from .views import (
    hello_world,
    UserCreateView,
    LoginView,
    SearchMoviesView,
    TopMoviesListView,
    MoviesByCategoryView,
    MovieDetailView,
)
from django.urls import path

urlpatterns = [
    path("register/", UserCreateView.as_view(), name="create_user"),
    path("login/", LoginView.as_view(), name="login"),
    path("test/", hello_world, name="api-test"),
    path("movies/", TopMoviesListView.as_view(), name="fetch-top-movies"),
    path("movies/category/", MoviesByCategoryView.as_view(), name="movies-by-category"),
    path("movies/<int:movie_id>/", MovieDetailView.as_view(), name="movie-detail"),
    path("search-movies/", SearchMoviesView.as_view(), name="search-movies"),
]
