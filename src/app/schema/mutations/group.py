import graphene
from app import db
from app.model import Group, Permission, Menu
from app.schema.nodes import GroupNode
from flask_babel import _
from flask_socketio import SocketIO
from flask import current_app


class CreateGroup(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        screen_name = graphene.String(required=True)
        color = graphene.String()

    group = graphene.Field(lambda: GroupNode)

    def mutate(self, info, **kwargs):
        myGroup = Group(
            name=kwargs.get('name'),
            screen_name=kwargs.get('screen_name'),
            color=kwargs.get('color')
        )
        save(myGroup)

        return CreateGroup(group=myGroup)


class UpdateGroup(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        name = graphene.String(required=True)
        screen_name = graphene.String(required=True)
        color = graphene.String()

    group = graphene.Field(lambda: GroupNode)

    def mutate(self, info, **kwargs):
        myGroup = Group.query.get(kwargs.get('id'))
        if not myGroup:
            raise Exception(_('Group not found'))

        myGroup.name = kwargs.get('name')
        myGroup.screen_name = kwargs.get('screen_name')
        myGroup.color = kwargs.get('color')
        save(myGroup)

        return UpdateGroup(group=myGroup)


class DeleteGroup(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    deleted = graphene.Boolean()

    def mutate(self, info, **kwargs):
        myGroup = Group.query.get(kwargs.get('id'))
        if not myGroup:
            raise Exception(_('Group not found'))

        delete(myGroup)

        return DeleteGroup(deleted=True)


class GrantPermission(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        permissions = graphene.List(graphene.String, required=True)

    granted = graphene.Boolean()

    def mutate(self, info, **kwargs):
        myGroup = Group.query.get(kwargs.get('id'))
        if not myGroup:
            raise Exception(_('Group not found'))

        currentPermissions = []
        for perm in myGroup.permissions:
            currentPermissions.append(perm.id)

        # add new permission
        for permId in kwargs.get('permissions'):
            if permId not in currentPermissions:
                myPerm = Permission.query.get(permId)
                myGroup.permissions.append(myPerm)

        # remove old permission which are not include in new permission
        for permId in currentPermissions:
            if permId not in kwargs.get('permissions'):
                myPerm = Permission.query.get(permId)
                myGroup.permissions.remove(myPerm)

        db.session.commit()

        # emit event "grant_permission_change"
        accessPermissions = []
        [accessPermissions.append({"name": item.name})
         for item in myGroup.permissions]
        socketio = SocketIO(message_queue=current_app.config['REDIS_URI'])
        socketio.emit('grant_permission_change', data=(
            myGroup.id, accessPermissions))

        return GrantPermission(granted=True)


class AssignMenu(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        menus = graphene.List(graphene.String, required=True)

    assigned = graphene.Boolean()

    def mutate(self, info, **kwargs):
        myGroup = Group.query.get(kwargs.get('id'))
        if not myGroup:
            raise Exception(_('Group not found'))

        currentMenus = []
        for menu in myGroup.menus:
            currentMenus.append(menu.id)

        # add new menu
        for menuId in kwargs.get('menus'):
            if menuId not in currentMenus:
                myMenu = Menu.query.get(menuId)
                myGroup.menus.append(myMenu)

        # remove old menu which are not include in new menu
        for menuId in currentMenus:
            if menuId not in kwargs.get('menus'):
                myMenu = Menu.query.get(menuId)
                if myMenu.name != 'Root':
                    myGroup.menus.remove(myMenu)

        db.session.commit()

        # emit event "assign_menu_change"
        accessMenus = []
        [accessMenus.append({"id": item.id}) for item in myGroup.menus]
        socketio = SocketIO(message_queue=current_app.config['REDIS_URI'])
        socketio.emit('assign_menu_change', data=(
            myGroup.id, accessMenus))

        return AssignMenu(assigned=True)


def save(data):
    db.session.add(data)
    db.session.commit()


def delete(data):
    db.session.delete(data)
    db.session.commit()
