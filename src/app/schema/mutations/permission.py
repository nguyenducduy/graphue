import graphene
from app import db
from app.model import Permission
from app.schema.nodes import PermissionNode
from flask_babel import _


class CreatePermission(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String(required=True)

    permission = graphene.Field(lambda: PermissionNode)

    def mutate(self, info, **kwargs):
        myPermission = Permission(
            name=kwargs.get('name'),
            description=kwargs.get('description')
        )
        save(myPermission)

        return CreatePermission(permission=myPermission)


class UpdatePermission(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        name = graphene.String(required=True)
        description = graphene.String(required=True)

    permission = graphene.Field(lambda: PermissionNode)

    def mutate(self, info, **kwargs):
        myPermission = Permission.query.get(kwargs.get('id'))
        if not myPermission:
            raise Exception(_('Permission not found'))

        myPermission.name = kwargs.get('name')
        myPermission.description = kwargs.get('description')
        save(myPermission)

        return UpdatePermission(permission=myPermission)


class DeletePermission(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    deleted = graphene.Boolean()

    def mutate(self, info, **kwargs):
        myPermission = Permission.query.get(kwargs.get('id'))
        if not myPermission:
            raise Exception(_('Permission not found'))

        delete(myPermission)

        return DeletePermission(deleted=True)


def save(data):
    db.session.add(data)
    db.session.commit()


def delete(data):
    db.session.delete(data)
    db.session.commit()
