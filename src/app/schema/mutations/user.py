import graphene
from app import db
from graphene_file_upload.scalars import Upload
from app.model import User, BlacklistToken
from app.schema.nodes import UserNode
from app.helper import downloadFromUrl
import random
import string
from flask_babel import _


def randomString(stringLength):
    letters = string.ascii_letters
    return ''.join(random.choice(letters) for i in range(stringLength))


class CreateUser(graphene.Mutation):
    class Arguments:
        full_name = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        group_id = graphene.Int(required=True)
        status = graphene.Int(required=True)

    user = graphene.Field(lambda: UserNode)

    def mutate(self, info, **kwargs):
        myUser = User(
            email=kwargs.get('email'),
            full_name=kwargs.get('full_name'),
            password_hash=kwargs.get('password'),
            group_id=kwargs.get('group_id'),
            status=kwargs.get('status')
        )
        save(myUser)

        return CreateUser(user=myUser)


class UpdateUser(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        full_name = graphene.String(required=True)
        group_id = graphene.Int(required=True)
        status = graphene.Int(required=True)

    user = graphene.Field(lambda: UserNode)

    def mutate(self, info, **kwargs):
        myUser = User.query.get(kwargs.get('id'))
        if not myUser:
            raise Exception(_('User not found'))

        myUser.full_name = kwargs.get('full_name')
        myUser.group_id = kwargs.get('group_id')
        myUser.status = kwargs.get('status')
        save(myUser)

        return UpdateUser(user=myUser)


class DeleteUser(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    deleted = graphene.Boolean()

    def mutate(self, info, **kwargs):
        myUser = User.query.get(kwargs.get('id'))
        if not myUser:
            raise Exception(_('User not found'))

        delete(myUser)

        return DeleteUser(deleted=True)


class LoginUser(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    user = graphene.Field(lambda: UserNode)
    token = graphene.String()

    def mutate(self, info, **kwargs):
        myUser = User.query.filter_by(email=kwargs.get('email')).first()

        if myUser is None:
            raise Exception(_('User not found'))

        # generate menus for logged user
        output = []
        for item in myUser.group.menus:
            output.append(item.drilldown_tree())

        myUser.menu = output[0]

        if myUser and myUser.check_password(kwargs.get('password')):
            auth_token = myUser.encode_auth_token(myUser.id)
        else:
            raise Exception(_('Invalid credentials'))

        return LoginUser(user=myUser, token=auth_token.decode())


class LogoutUser(graphene.Mutation):
    logged_out = graphene.Boolean()

    def mutate(self, info, **kwargs):
        myBlacklistToken = BlacklistToken(
            token=kwargs.get('token')
        )
        save(myBlacklistToken)

        return LogoutUser(logged_out=True)


class ChangePasswordUser(graphene.Mutation):
    class Arguments:
        password = graphene.String(required=True)

    user = graphene.Field(lambda: UserNode)

    def mutate(self, info, **kwargs):
        myUser = User.query.get(kwargs.get('user').id)
        if not myUser:
            raise Exception(_('User not found'))

        myUser.password_hash = kwargs.get('password')
        save(myUser)

        return ChangePasswordUser(user=myUser)


class CreateFromGoogleUser(graphene.Mutation):
    class Arguments:
        full_name = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String()
        picture = graphene.String()
        token = graphene.String()
        refresh_token = graphene.String()
        expires_at = graphene.Int()

    user = graphene.Field(lambda: UserNode)
    token = graphene.String()

    def mutate(self, info, **kwargs):
        myUser = User.query.filter_by(
            email=kwargs.get('email'),
            oauth_provider='google'
        ).first()

        if not myUser:
            if kwargs.get('password') != None:
                password = kwargs.get('password')
            else:
                password = randomString(10)

            myUser = User(
                full_name=kwargs.get('full_name'),
                email=kwargs.get('email'),
                password_hash=password,
                group_id=3,  # member
            )

        myUser.avatar = downloadFromUrl('avatars', kwargs.get('picture'))
        myUser.oauth_provider = 'google'
        myUser.oauth_token = kwargs.get('token')
        myUser.oauth_refresh_token = kwargs.get('refresh_token')
        myUser.oauth_token_expired_at = kwargs.get('expires_at')

        save(myUser)
        auth_token = myUser.encode_auth_token(myUser.id)

        return CreateFromGoogleUser(user=myUser, token=auth_token.decode())


def save(data):
    db.session.add(data)
    db.session.commit()


def delete(data):
    db.session.delete(data)
    db.session.commit()
