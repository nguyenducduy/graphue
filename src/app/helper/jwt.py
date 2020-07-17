import jwt
from flask import current_app


def decode_auth_token(auth_header):
    try:
        auth_token = auth_header.split(" ")[1]
    except:
        raise Exception('Security endpoint, must provide token to access.')

    try:
        payload = jwt.decode(
            auth_token, current_app.config['SECRET_KEY'], algorithms=['HS256'])

        blacklistTokenModel = current_app.db.Model._decl_class_registry.get(
            'BlacklistToken', None)
        blacklisted_token = blacklistTokenModel.query.filter_by(
            token=auth_token).first()

        if blacklisted_token:
            raise Exception('Token blacklisted. Please log in again.')
        else:
            return payload['sub']
    except jwt.ExpiredSignatureError:
        raise Exception('Signature expired. Please log in again.')
    except jwt.InvalidTokenError:
        raise Exception('Invalid token. Please log in again.')
