import pendulum
from app import db
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship, backref
from sqlalchemy.event import listens_for
from sqlalchemy_mptt.mixins import BaseNestedSets


class Menu(db.Model, BaseNestedSets):
    __tablename__ = 'menu'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(150), index=True)
    path = Column(String(150), index=True, unique=True)
    icon = Column(String(50))
    created_at = Column(Integer, nullable=False)
    updated_at = Column(Integer)
    groups = relationship('Group', secondary='rel_group_menu')


@listens_for(Menu, 'before_insert')
def generate_created_at(mapper, connect, self):
    self.created_at = int(pendulum.now().timestamp())
    return self.created_at


@listens_for(Menu, 'before_update')
def generate_updated_at(mapper, connect, self):
    self.updated_at = int(pendulum.now().timestamp())
    return self.updated_at
