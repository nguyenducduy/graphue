import pendulum
from app import db
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, backref
from sqlalchemy.event import listens_for
from app.model.menu import Menu


class RelGroupMenu(db.Model):
    __tablename__ = 'rel_group_menu'

    id = Column(Integer, primary_key=True, autoincrement=True)
    group_id = Column(Integer, ForeignKey('group.id'), primary_key=True)
    menu_id = Column(Integer, ForeignKey('menu.id'), primary_key=True)

    group = relationship('Group', backref=backref(
        'rel_group_menu', cascade='all, delete-orphan'))
    menu = relationship('Menu', backref=backref(
        'rel_group_menu', cascade='all, delete-orphan'))
