from . import db
from flask_login import UserMixin
from sqlalchemy import ForeignKeyConstraint

class Player(db.Model, UserMixin):
	uid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	email = db.Column(db.String(150), unique=True)
	pwd = db.Column(db.String(150))
	username = db.Column(db.String(30))
	created_on = db.Column(db.DateTime)
	is_admin = db.Column(db.Boolean, default=False)
	is_confirmed = db.Column(db.Boolean, default=False)
	confirmed_on = db.Column(db.DateTime, nullable=True)
	matches = db.relationship('Match')
	games = db.relationship('Game')
	plays = db.relationship('Play')
	drafts = db.relationship('Draft')
	picks = db.relationship('Pick')
	def get_id(self):
		return str(self.uid)

class Match(db.Model):
	uid = db.Column(db.Integer, db.ForeignKey('player.uid'), primary_key=True)
	match_id = db.Column(db.String(75), primary_key=True)
	draft_id = db.Column(db.String(75))
	p1 = db.Column(db.String(30), primary_key=True)
	p1_arch = db.Column(db.String(15))
	p1_subarch = db.Column(db.String(30))
	p2 = db.Column(db.String(30))
	p2_arch = db.Column(db.String(15))
	p2_subarch = db.Column(db.String(30))
	p1_roll = db.Column(db.Integer)
	p2_roll = db.Column(db.Integer)
	roll_winner = db.Column(db.String(2))
	p1_wins = db.Column(db.Integer)
	p2_wins = db.Column(db.Integer)
	match_winner = db.Column(db.String(2))
	format = db.Column(db.String(20))
	limited_format = db.Column(db.String(15))
	match_type = db.Column(db.String(30))
	date = db.Column(db.String(20))
	def as_dict(self):
		return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Game(db.Model):
	uid = db.Column(db.Integer, db.ForeignKey('player.uid'), primary_key=True)
	match_id = db.Column(db.String(75), primary_key=True)
	p1 = db.Column(db.String(30), primary_key=True)
	p2 = db.Column(db.String(30))
	game_num = db.Column(db.Integer, primary_key=True)
	pd_selector = db.Column(db.String(2))
	pd_choice = db.Column(db.String(4))
	on_play = db.Column(db.String(2))
	on_draw = db.Column(db.String(2))
	p1_mulls = db.Column(db.Integer)
	p2_mulls = db.Column(db.Integer)
	turns = db.Column(db.Integer)
	game_winner = db.Column(db.String(2))
	def as_dict(self):
		return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Play(db.Model):
	uid = db.Column(db.Integer, db.ForeignKey('player.uid'), primary_key=True)
	match_id = db.Column(db.String(75), primary_key=True)
	game_num = db.Column(db.Integer, primary_key=True)
	play_num = db.Column(db.Integer, primary_key=True)
	turn_num = db.Column(db.Integer)
	casting_player = db.Column(db.String(30))
	action = db.Column(db.String(20))
	primary_card = db.Column(db.String(50))
	target1 = db.Column(db.String(50))
	target2 = db.Column(db.String(50))
	target3 = db.Column(db.String(50))
	opp_target = db.Column(db.Integer)
	self_target = db.Column(db.Integer)
	cards_drawn = db.Column(db.Integer)
	attackers = db.Column(db.Integer)
	active_player = db.Column(db.String(30))
	non_active_player = db.Column(db.String(30))
	def as_dict(self):
		return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Pick(db.Model):
	uid = db.Column(db.Integer, db.ForeignKey('player.uid'), primary_key=True)
	draft_id = db.Column(db.String(75), primary_key=True)
	card = db.Column(db.String(50))
	pack_num = db.Column(db.Integer)
	pick_num = db.Column(db.Integer)
	pick_ovr = db.Column(db.Integer, primary_key=True)
	avail1 = db.Column(db.String(75))
	avail2 = db.Column(db.String(75))
	avail3 = db.Column(db.String(75))
	avail4 = db.Column(db.String(75))
	avail5 = db.Column(db.String(75))
	avail6 = db.Column(db.String(75))
	avail7 = db.Column(db.String(75))
	avail8 = db.Column(db.String(75))
	avail9 = db.Column(db.String(75))
	avail10 = db.Column(db.String(75))
	avail11 = db.Column(db.String(75))
	avail12 = db.Column(db.String(75))
	avail13 = db.Column(db.String(75))
	avail14 = db.Column(db.String(75))
	def as_dict(self):
		return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Draft(db.Model):
	uid = db.Column(db.Integer, db.ForeignKey('player.uid'), primary_key=True)
	draft_id = db.Column(db.String(75), primary_key=True)
	hero = db.Column(db.String(30), primary_key=True)
	player2 = db.Column(db.String(30))
	player3 = db.Column(db.String(30))
	player4 = db.Column(db.String(30))
	player5 = db.Column(db.String(30))
	player6 = db.Column(db.String(30))
	player7 = db.Column(db.String(30))
	player8 = db.Column(db.String(30))
	match_wins = db.Column(db.Integer)
	match_losses = db.Column(db.Integer)
	format = db.Column(db.String(20))
	date = db.Column(db.String(20))
	def as_dict(self):
		return {c.name: getattr(self, c.name) for c in self.__table__.columns}
		
class GameActions(db.Model):
	uid = db.Column(db.Integer, primary_key=True)
	match_id = db.Column(db.String(75), primary_key=True)
	game_num = db.Column(db.Integer, primary_key=True)
	game_actions = db.Column(db.String(5000))
	
	def as_dict(self):
		return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Removed(db.Model):
	uid = db.Column(db.Integer, primary_key=True)
	match_id = db.Column(db.String(75), primary_key=True)
	reason = db.Column(db.String(20))
	def as_dict(self):
		return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class CardsPlayed(db.Model):
	uid = db.Column(db.Integer, primary_key=True)
	match_id = db.Column(db.String(75), primary_key=True)
	casting_player1 = db.Column(db.String(30))
	casting_player2 = db.Column(db.String(30))
	plays1 = db.Column(db.PickleType)
	plays2 = db.Column(db.PickleType)
	lands1 = db.Column(db.PickleType)
	lands2 = db.Column(db.PickleType)
	def as_dict(self):
		return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class TaskHistory(db.Model):
	task_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	uid = db.Column(db.Integer)
	curr_username = db.Column(db.String(30))
	submit_date = db.Column(db.DateTime)
	complete_date = db.Column(db.DateTime, nullable=True)
	task_type = db.Column(db.String(35))
	error_code = db.Column(db.String(50), nullable=True)