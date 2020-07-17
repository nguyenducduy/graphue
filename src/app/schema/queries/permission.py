import graphene
from graphene_sqlalchemy_filter import FilterSet
from app.model.permission import Permission
from app.schema.nodes import PermissionNode


class PermissionFilter(FilterSet):
    class Meta:
        model = Permission
        fields = {
            'id': [...],
            'name': [...],
            'description': [...],
        }


class PermissionConnection(graphene.Connection):
    class Meta:
        node = PermissionNode

    total_count = graphene.NonNull(graphene.Int)

    def resolve_total_count(self, info, **kwargs):
        return self.length


def resolve_permission(self, info, **kwargs):
    return PermissionNode.get_query(info).filter_by(
        id=kwargs.get('id')
    ).first()
