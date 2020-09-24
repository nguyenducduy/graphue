from app.model import Group, Menu, Permission
from flask_socketio import SocketIO, emit
from app import create_app
from flask_migrate import MigrateCommand
from flask_babel import _
import logging
import eventlet
eventlet.monkey_patch()

# init app
app = create_app()

# add custom cli command line here
app.cli.add_command('db', MigrateCommand)

# enable socketio
socketio = SocketIO(
    app, async_mode='eventlet', cors_allowed_origins=app.config['ALLOW_ORIGINS'], message_queue=app.config['REDIS_URI'],  manage_session=False)


########## SOCKET EVENT ##########

@socketio.on('check_menu_permission_change')
def check(groupId):
    """
    Check menu, permission change then emit to frontend to take effect at each enter page.
    """
    myGroup = Group.query.get(groupId)
    if not myGroup:
        raise Exception(_('Group not found'))

    # return all menu
    menu_tree = []
    myMenu = Menu.query.all()

    if len(myMenu) > 0:
        for item in myMenu:
            menu_tree.append(item.drilldown_tree(
                json=True, json_fields=cat_to_json))
    emit('menu_change', menu_tree[0][0])

    # return group menu
    accessMenus = []
    [accessMenus.append({"id": item.id}) for item in myGroup.menus]
    emit('assign_menu_change', (myGroup.id, accessMenus))

    # return group permission
    accessPermissions = []
    [accessPermissions.append({"name": item.name})
     for item in myGroup.permissions]
    emit('grant_permission_change', (myGroup.id, accessPermissions))

    pass


def cat_to_json(item):
    """
    Turn nested dictionary to json
    """
    return {
        'id': item.id,
        'name': item.name,
        'path': item.path,
        'icon': item.icon,
        'parentId': item.parent_id
    }


if __name__ == '__main__':
    """
    Run app
    """
    log = logging.getLogger(__name__)
    log.info(
        '----- Serving SOCKET-IO at {} -----'.format(app.config['BASE_URI']))
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
