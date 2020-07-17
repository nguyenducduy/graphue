import pendulum
import jwt
import datetime
from app import db
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship, backref
from sqlalchemy.event import listens_for
from flask import current_app
from .group import Group
from passlib.apps import custom_app_context as pwd_context


class User(db.Model):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String(50))
    avatar = Column(String(255))
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), index=True)
    oauth_provider = Column(String(50))
    oauth_token = Column(String(255))
    oauth_refresh_token = Column(String(255))
    oauth_token_expired_at = Column(Integer)
    status = Column(Integer, index=True)
    created_at = Column(Integer, nullable=False)
    updated_at = Column(Integer)

    group_id = Column(Integer, ForeignKey('group.id'))
    group = relationship('Group', backref=backref(
        'user', cascade='all, delete'))  # cascade delete all user when delete group

    STATUS_ACTIVE = 1
    STATUS_BLOCKED = 3
    STATUS_WAIT_VERIFY = 5

    def getStatus(self):
        status = {}
        if self.status == self.STATUS_ACTIVE:
            status = {
                "text": "Active",
                "value": self.STATUS_ACTIVE,
                "color": "#87d068"
            }
        elif self.status == self.STATUS_BLOCKED:
            status = {
                "text": "Blocked",
                "value": self.STATUS_BLOCKED,
                "color": "gray"
            }
        elif self.status == self.STATUS_WAIT_VERIFY:
            status = {
                "text": "Wait verify",
                "value": self.STATUS_WAIT_VERIFY,
                "color": "orange"
            }
        else:
            status = {}

        return status

    @staticmethod
    def getStatusList():
        return [{
            "text": "Active",
            "value": User.STATUS_ACTIVE,
            "color": "#87d068"
        }, {
            "text": "Blocked",
            "value": User.STATUS_BLOCKED,
            "color": "gray"
        }, {
            "text": "Wait verify",
            "value": User.STATUS_WAIT_VERIFY,
            "color": "orange"
        }]

    @property
    def password_hash(self):
        raise AttributeError('password: write-only field')

    @password_hash.setter
    def password_hash(self, user_input_password):
        self.password = pwd_context.encrypt(user_input_password)

    def check_password(self, user_input_password):
        return pwd_context.verify(user_input_password, self.password)

    def encode_auth_token(self, user_id):
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=365, seconds=5),
                'iat': datetime.datetime.utcnow(),
                'sub': user_id
            }

            return jwt.encode(
                payload,
                current_app.config['SECRET_KEY'],
                algorithm='HS256'
            )
        except Exception as e:
            return e


@listens_for(User, 'before_insert')
def generate_created_at(mapper, connect, self):
    self.created_at = int(pendulum.now().timestamp())
    return self.created_at


@listens_for(User, 'before_update')
def generate_updated_at(mapper, connect, self):
    self.updated_at = int(pendulum.now().timestamp())
    return self.updated_at
