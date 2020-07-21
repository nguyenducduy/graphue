import graphene
from app import db
from app.model import Menu
from app.schema.nodes import MenuNode


class CreateMenu(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        path = graphene.String()
        icon = graphene.String()
        parent_id = graphene.Int(required=True)

    menu = graphene.Field(lambda: MenuNode)

    def mutate(self, info, **kwargs):
        myMenu = Menu(
            name=kwargs.get('name'),
            path=kwargs.get('path'),
            icon=kwargs.get('icon'),
            parent_id=kwargs.get('parent_id')
        )
        save(myMenu)

        return CreateMenu(menu=myMenu)


class UpdateMenu(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        name = graphene.String(required=True)
        path = graphene.String()
        icon = graphene.String()
        parent_id = graphene.Int(required=True)

    menu = graphene.Field(lambda: MenuNode)

    def mutate(self, info, **kwargs):
        myMenu = Menu.query.filter_by(
            id=kwargs.get('id')
        ).first()
        if not myMenu:
            raise Exception('Menu not found')

        myMenu.name = kwargs.get('name')
        myMenu.path = kwargs.get('path')
        myMenu.icon = kwargs.get('icon')
        myMenu.parent_id = kwargs.get('parent_id')
        save(myMenu)

        return UpdateMenu(menu=myMenu)


class DeleteMenu(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    deleted = graphene.Boolean()

    def mutate(self, info, **kwargs):
        myMenu = Menu.query.filter_by(
            id=kwargs.get('id')
        ).first()
        if not myMenu:
            raise Exception('Menu not found')

        delete(myMenu)

        return DeleteMenu(deleted=True)


def save(data):
    db.session.add(data)
    db.session.commit()


def delete(data):
    db.session.delete(data)
    db.session.commit()
