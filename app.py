from website import create_app, db, make_celery
from website.models import Player, Match, Game, Play, Pick, Draft, GameActions, Removed, CardsPlayed
from flask import request, url_for, flash, render_template, redirect
from flask_mail import Mail, Message
from flask_login import login_user, login_required, logout_user, current_user
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = create_app()
celery = make_celery(app)
celery.set_default()
app.app_context().push()

#mail = Mail(app)

if __name__ == '__main__':
	app.run(host="0.0.0.0", port=8000)