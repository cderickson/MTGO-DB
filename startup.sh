#!/bin/sh
celery -A app.celery worker --loglevel=info & gunicorn --bind=0.0.0.0 --timeout 600 app:app
