import graphene
from graphene_sqlalchemy_filter import FilterableConnectionField
from graphene_file_upload.scalars import Upload

# NODES
from app.schema.nodes import UserNode, GroupNode, PermissionNode, NestedMenuNode

# SCHEMAS
from .user import UserConnection, UserFilter, resolve_user
from .group import GroupConnection, GroupFilter, resolve_group
from .permission import PermissionConnection, PermissionFilter, resolve_permission


class Query(graphene.ObjectType):
    class Meta:
        description = "All schema queries"

    list_user = FilterableConnectionField(UserConnection, filters=UserFilter())
    get_user = graphene.Field(
        id=graphene.Int(), type=UserNode, resolver=resolve_user)
    list_group = FilterableConnectionField(
        GroupConnection, filters=GroupFilter())
    get_group = graphene.Field(
        id=graphene.Int(), type=GroupNode, resolver=resolve_group)
    list_permission = FilterableConnectionField(
        PermissionConnection, filters=PermissionFilter())
    get_permission = graphene.Field(
        id=graphene.Int(), type=PermissionNode, resolver=resolve_permission)
