from django.core.management.base import BaseCommand
from django.core.cache import cache


class Command(BaseCommand):
    help = "Clear all cached movie data"

    def add_arguments(self, parser):
        parser.add_argument(
            "--pattern",
            type=str,
            help='Clear cache keys matching a specific pattern (e.g., "top_movies", "search_movie")',
        )

    def handle(self, *args, **options):
        pattern = options.get("pattern")

        if pattern:
            self.stdout.write(f"Clearing cache keys matching pattern: {pattern}")
            # Note: This is a simple implementation. For production with Redis,
            # you would use cache.delete_pattern(f'*{pattern}*')
            self.stdout.write(
                self.style.WARNING(
                    "Pattern matching not fully supported with LocMemCache. "
                    "Consider clearing all cache or upgrading to Redis."
                )
            )
        else:
            self.stdout.write("Clearing all cache...")
            cache.clear()
            self.stdout.write(self.style.SUCCESS("Successfully cleared all cache!"))
