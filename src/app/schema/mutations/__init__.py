import graphene

# SCHEMAS
from .user import CreateUser, UpdateUser, DeleteUser, LoginUser, LogoutUser, ChangePasswordUser, CreateFromGoogleUser
from .group import CreateGroup, UpdateGroup, DeleteGroup, GrantPermission, AssignMenu
from .permission import CreatePermission, UpdatePermission, DeletePermission
from .menu import CreateMenu, UpdateMenu, DeleteMenu


class Mutation(graphene.ObjectType):
    class Meta:
        description = 'All schema mutations'
    # user
    create_user = CreateUser.Field()
    update_user = UpdateUser.Field()
    delete_user = DeleteUser.Field()
    login_user = LoginUser.Field()
    logout_user = LogoutUser.Field()
    change_password_user = ChangePasswordUser.Field()
    create_from_google_user = CreateFromGoogleUser.Field()

    # group
    create_group = CreateGroup.Field()
    update_group = UpdateGroup.Field()
    delete_group = DeleteGroup.Field()
    grant_permission_group = GrantPermission.Field()
    assign_menu_group = AssignMenu.Field()

    # permission
    create_permission = CreatePermission.Field()
    update_permission = UpdatePermission.Field()
    delete_permission = DeletePermission.Field()

    # menu
    create_menu = CreateMenu.Field()
    update_menu = UpdateMenu.Field()
    delete_menu = DeleteMenu.Field()
