import graphene
from app import db
from app.model import Menu
from app.schema.nodes import MenuNode
from flask_socketio import SocketIO
from flask import current_app


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

        emit_menu_change()

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

        emit_menu_change()

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

        emit_menu_change()

        return DeleteMenu(deleted=True)


def cat_to_json(item):
    return {
        'id': item.id,
        'name': item.name,
        'path': item.path,
        'icon': item.icon,
        'parentId': item.parent_id
    }


def emit_menu_change():
    socketio = SocketIO(message_queue=current_app.config['REDIS_URI'])
    menu_tree = []
    myMenu = Menu.query.all()

    if len(myMenu) > 0:
        for item in myMenu:
            menu_tree.append(item.drilldown_tree(
                json=True, json_fields=cat_to_json))

        socketio.emit('menu_change', menu_tree[0][0])
    else:
        pass


def save(data):
    db.session.add(data)
    db.session.commit()


def delete(data):
    db.session.delete(data)
    db.session.commit()
