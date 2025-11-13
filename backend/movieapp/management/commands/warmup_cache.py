from django.core.management.base import BaseCommand
from movieapp.utils import fetch_top_movies, fetch_movies_by_category


class Command(BaseCommand):
    help = "Pre-warm the cache with popular movie data"

    def handle(self, *args, **options):
        self.stdout.write("Warming up cache with popular data...")

        # Fetch first 3 pages of top movies
        self.stdout.write("Fetching top movies (pages 1-3)...")
        for page in range(1, 4):
            fetch_top_movies(page)
            self.stdout.write(f"  ✓ Cached top movies page {page}")

        # Fetch popular movies by category
        categories = ["movies", "series", "documentaries"]
        for category in categories:
            self.stdout.write(f"Fetching {category} (pages 1-2)...")
            for page in range(1, 3):
                fetch_movies_by_category(category, page)
                self.stdout.write(f"  ✓ Cached {category} page {page}")

        self.stdout.write(
            self.style.SUCCESS(
                "\nCache warmup complete! Guest users will now experience fast load times."
            )
        )
