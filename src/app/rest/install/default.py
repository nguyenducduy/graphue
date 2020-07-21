import logging
from app import db
from flask import current_app, request
from flask_restplus import Resource
from app.rest import rest
from app.rest.install.serializers import app_installation
from app.model import User, Group, Permission, Menu
from flask_babel import _

log = logging.getLogger(__name__)

ns = rest.namespace('install', description='Install require app data.')

DEFAULT_GROUP = [
    {'name': 'admin', 'screen_name': _('Administrator'), 'color': 'red'},
    {'name': 'mod', 'screen_name': _('Moderator'), 'color': 'orange'},
    {'name': 'member', 'screen_name': _('Member'), 'color': 'blue'},
    {'name': 'guest', 'screen_name': _('Guest'), 'color': ''},
]

DEFAULT_PERMISSION = [
    {'name': 'createUser', 'description': 'Create user from admin panel'},
    {'name': 'updateUser', 'description': 'Update user from admin panel'},
    {'name': 'deleteUser', 'description': 'Delete user from admin panel'},
    {'name': 'listUser', 'description': 'List all user in system'},
    {'name': 'getUser', 'description': 'Get a user info'},
    {'name': 'changePasswordUser',
        'description': '(Required) Change password of logged in user from admin panel'},
    {'name': 'logoutUser',
        'description': '(Required) Logout current logged in user'},
    {'name': 'createGroup', 'description': 'Create group from admin panel'},
    {'name': 'updateGroup', 'description': 'Update group from admin panel'},
    {'name': 'deleteGroup', 'description': 'Delete group from admin panel'},
    {'name': 'listGroup', 'description': 'List all group in system'},
    {'name': 'getGroup', 'description': 'Get a group info'},
    {'name': 'grantPermissionGroup', 'description': 'Grant permission to group'},
    {'name': 'assignMenuGroup', 'description': 'Assign menus to group'},
    {'name': 'createPermission', 'description': 'Create permission from admin panel'},
    {'name': 'updatePermission', 'description': 'Update permission from admin panel'},
    {'name': 'deletePermission', 'description': 'Delete permission from admin panel'},
    {'name': 'listPermission', 'description': 'List all permission in system'},
    {'name': 'getPermission', 'description': 'Get a permission info'},
    {'name': 'createMenu', 'description': 'Create menu from admin panel'},
    {'name': 'updateMenu', 'description': 'Update menu from admin panel'},
    {'name': 'deleteMenu', 'description': 'Delete menu from admin panel'},
    {'name': 'listMenu', 'description': 'List all menu in system'},
    {'name': 'getMenu', 'description': 'Get a menu info'},
    {'name': 'updateLanguage', 'description': 'Update component language from admin panel'},
]


@ns.route('')
class Install(Resource):

    @rest.expect(app_installation)
    def post(self):
        """
        Install requirement app data
        """
        formData = request.json

        # create default permission
        for perm in DEFAULT_PERMISSION:
            myPerm = Permission(
                name=perm['name'],
                description=perm['description']
            )
            db.session.add(myPerm)

        db.session.commit()

        # create default group
        for group in DEFAULT_GROUP:
            myGroup = Group(
                name=group['name'],
                screen_name=group['screen_name'],
                color=group['color']
            )

            if group['name'] == 'admin':
                myGroup.permissions = Permission.query.all()

            db.session.add(myGroup)

        db.session.commit()

        # create user and assign to admin group
        myUser = User(
            email=formData['email'],
            full_name=formData['fullName'],
            password_hash=formData['password'],
            status=1
        )
        myUser.group = Group.query.filter_by(name='admin').first()
        db.session.add(myUser)
        db.session.commit()

        # create default admin menu for group admin
        myMenuRoot = Menu(
            name='Root',
            path='',
            icon='',
            tree_id=1
        )
        db.session.add(myMenuRoot)
        db.session.commit()

        # overview menu
        myMenuDashboard = Menu(
            name='Overview',
            path='/admin/overview',
            icon='fa fa-home',
            parent_id=myMenuRoot.id
        )
        db.session.add(myMenuDashboard)

        # setting menu
        myMenuSetting = Menu(
            name='Setting',
            path='',
            icon='fa fa-cog',
            parent_id=myMenuRoot.id
        )
        db.session.add(myMenuSetting)
        db.session.commit()
        mySubMenuMenu = Menu(
            name='Menu',
            path='/admin/menu',
            icon='',
            parent_id=myMenuSetting.id
        )
        db.session.add(mySubMenuMenu)
        mySubMenuLanguage = Menu(
            name='Language',
            path='/admin/language',
            icon='',
            parent_id=myMenuSetting.id
        )
        db.session.add(mySubMenuLanguage)
        db.session.commit()

        # menu user
        myMenuUser = Menu(
            name='User',
            path='',
            icon='fa fa-user',
            parent_id=myMenuRoot.id
        )
        db.session.add(myMenuUser)
        db.session.commit()
        mySubMenuUserList = Menu(
            name='List',
            path='/admin/user',
            icon='',
            parent_id=myMenuUser.id
        )
        db.session.add(mySubMenuUserList)
        mySubMenuGroupList = Menu(
            name='Group',
            path='/admin/group',
            icon='',
            parent_id=myMenuUser.id
        )
        db.session.add(mySubMenuGroupList)
        mySubMenuGrant = Menu(
            name='Permission',
            path='/admin/permission',
            icon='',
            parent_id=myMenuUser.id
        )
        db.session.add(mySubMenuGrant)
        db.session.commit()

        # default assign menu for group admin
        myAdminGroup = Group.query.filter_by(name='admin').first()
        myAdminGroup.menus = Menu.query.all()
        db.session.add(myAdminGroup)
        db.session.commit()

        return {'installed': True}, 201
