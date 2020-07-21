import graphene
from graphene_sqlalchemy_filter import FilterSet
from app.model import Group
from app.schema.nodes import GroupNode, PermissionNode


class GroupFilter(FilterSet):
    class Meta:
        model = Group
        fields = {
            'id': [...],
            'name': [...],
        }


class GroupConnection(graphene.Connection):
    class Meta:
        node = GroupNode

    total_count = graphene.NonNull(graphene.Int)

    def resolve_total_count(self, info, **kwargs):
        return self.length


def resolve_group(self, info, **kwargs):
    return GroupNode.get_query(info).filter_by(
        id=kwargs.get('id')
    ).first()
