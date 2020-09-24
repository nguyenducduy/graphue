from app import db
from sqlalchemy import Column, String, Integer
from sqlalchemy.event import listens_for
import pendulum


class BlacklistToken(db.Model):
    __tablename__ = 'blacklist_token'

    id = Column(Integer, primary_key=True, autoincrement=True)
    token = Column(String(255), index=True, unique=True)
    created_at = Column(Integer, nullable=False)


@listens_for(BlacklistToken, 'before_insert')
def generate_created_at(mapper, connect, self):
    self.created_at = int(pendulum.now().timestamp())
    return self.created_at
