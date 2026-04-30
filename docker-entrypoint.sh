#!/bin/sh
set -e

if [ -n "$DB_HOST" ]; then
  python - <<'PY'
import os, socket, time, sys
host = os.environ.get("DB_HOST", "db")
port = int(os.environ.get("DB_PORT", "5432"))
for attempt in range(30):
    try:
        with socket.create_connection((host, port), timeout=2):
            print(f"Database {host}:{port} is available.")
            break
    except OSError:
        print(f"Waiting for database {host}:{port}... ({attempt + 1}/30)")
        time.sleep(1)
else:
    print("Database unavailable after waiting, exiting.", file=sys.stderr)
    sys.exit(1)
PY
fi

python src/manage.py migrate --noinput
python src/manage.py collectstatic --noinput
python src/manage.py shell <<'PY'
import os
from django.contrib.auth import get_user_model

User = get_user_model()
username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "tab1k")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "TOBI8585")
email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@example.com")

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"Created superuser '{username}'.")
else:
    print(f"Superuser '{username}' already exists.")
PY

python src/manage.py seed_products

exec gunicorn --chdir /app/src dokerler.wsgi:application --bind 0.0.0.0:${PORT:-8000}
