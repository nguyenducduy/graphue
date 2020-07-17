from app import db
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, backref
from app.model.permission import Permission


class RelGroupPermission(db.Model):
    __tablename__ = 'rel_group_permission'

    id = Column(Integer, primary_key=True, autoincrement=True)
    group_id = Column(Integer, ForeignKey('group.id'), primary_key=True)
    permission_id = Column(Integer,
                           ForeignKey('permission.id'),
                           primary_key=True)

    group = relationship('Group', backref=backref(
        "rel_group_permission", cascade="all, delete-orphan"))
    permission = relationship('Permission', backref=backref(
        "rel_group_permission", cascade="all, delete-orphan"))
