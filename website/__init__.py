from flask import Flask
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import os
from celery import Celery, Task

db = SQLAlchemy()
DB_NAME = 'database.db'

def make_celery(app):
	celery = Celery(
		app.import_name,
		backend=app.config['CELERY_RESULT_BACKEND'],
		broker=app.config['CELERY_BROKER_URL']
	)
	celery.conf.update(app.config)

	class ContextTask(celery.Task):
		def __call__(self, *args, **kwargs):
			with app.app_context():
				return self.run(*args, **kwargs)

	celery.Task = ContextTask
	return celery

def create_app():
	app = Flask(__name__)
	app.config.from_pyfile('config.cfg')
	# app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'

	app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY")
	app.config['MAIL_SERVER'] = os.environ.get("MAIL_SERVER")
	app.config['MAIL_USERNAME'] = os.environ.get("MAIL_USERNAME")
	app.config['MAIL_PASSWORD'] = os.environ.get("MAIL_PASSWORD")
	app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("SQLALCHEMY_DATABASE_URI")
	app.config['CELERY_RESULT_BACKEND'] = os.environ.get("CELERY_RESULT_BACKEND")
	app.config['CELERY_BROKER_URL'] = os.environ.get("CELERY_BROKER_URL")
	app.config['URL_SAFETIMEDSERIALIZER'] = os.environ.get("URL_SAFETIMEDSERIALIZER")
	app.config['EMAIL_CONFIRMATION_SALT'] = os.environ.get("EMAIL_CONFIRMATION_SALT")
	app.config['RESET_PASSWORD_SALT'] = os.environ.get("RESET_PASSWORD_SALT")

	mail = Mail(app)

	db.init_app(app)

	from .views import views
	from .auth import auth

	app.register_blueprint(views, url_prefix='/')
	app.register_blueprint(auth, url_prefix='/')

	from .models import Player

	with app.app_context():
		db.create_all()

	login_manager = LoginManager()
	login_manager.login_view = 'views.login'
	login_manager.init_app(app)

	@login_manager.user_loader
	def load_user(uid):
		return Player.query.get(int(uid))

	return app