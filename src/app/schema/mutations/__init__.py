import graphene

# SCHEMAS
from .user import CreateUser, UpdateUser, DeleteUser, LoginUser, LogoutUser, ChangePasswordUser, CreateFromGoogleUser
from .group import CreateGroup, UpdateGroup, DeleteGroup, GrantPermission
from .permission import CreatePermission, UpdatePermission, DeletePermission


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

    # permission
    create_permission = CreatePermission.Field()
    update_permission = UpdatePermission.Field()
    delete_permission = DeletePermission.Field()
