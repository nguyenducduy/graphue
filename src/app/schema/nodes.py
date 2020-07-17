import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType

# models
from app.model import User, Group, Permission, Menu


class CommonDictNode(graphene.ObjectType):
    text = graphene.String()
    value = graphene.String()
    color = graphene.String()


class MenuNode(SQLAlchemyObjectType):
    class Meta:
        description = 'Menu node fields info'
        model = Menu


class NestedMenuNode(graphene.ObjectType):
    class Meta:
        description = 'Nested menu node fields info'
    node = graphene.Field(MenuNode)
    children = graphene.List(MenuNode)


class PermissionNode(SQLAlchemyObjectType):
    class Meta:
        description = 'Permission node fields info'
        model = Permission


class GroupNode(SQLAlchemyObjectType):
    class Meta:
        description = 'Group node fields info'
        model = Group

    permissions = graphene.List(PermissionNode)
    menus = graphene.List(MenuNode)


class UserNode(SQLAlchemyObjectType):
    class Meta:
        description = 'User node fields info'
        model = User

    status = graphene.Field(CommonDictNode)
    group = graphene.Field(GroupNode)
    menu = graphene.Field(graphene.List(NestedMenuNode))

    def resolve_status(self, info):
        return self.getStatus()
