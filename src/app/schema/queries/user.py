import graphene
from app.lib.graphene_sqlalchemy_filter import FilterSet
from app.model import User, Group
from app.schema.nodes import UserNode, GroupNode, CommonDictNode


class UserFilter(FilterSet):
    class Meta:
        description = 'User filter fields info'
        model = User
        fields = {
            'id': [...],
            'group_id': [...],
            'email': [...],
            'full_name': [...],
            'status': [...]
        }


class UserConnection(graphene.Connection):
    class Meta:
        description = 'User connection fields info'
        node = UserNode

    total_count = graphene.NonNull(
        graphene.Int, description='Total records in this connection')
    status_list = graphene.List(
        CommonDictNode, description="List status of user model")

    def resolve_total_count(self, info, **kwargs):
        return self.length

    def resolve_status_list(self, info, **kwargs):
        return User.getStatusList()


def resolve_user(self, info, **kwargs):
    myUser = User.query.get(kwargs.get('id'))

    output = []
    if len(myUser.group.menus) > 0:
        for item in myUser.group.menus:
            output.append(item.drilldown_tree())
        myUser.menu = output[0]
    else:
        myUser.menu = []

    return myUser
