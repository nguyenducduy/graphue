import os
from dotenv import load_dotenv

dotenv_path = os.path.join('app/config/.env')
load_dotenv(dotenv_path)
# print('[INFO] Config loaded from: {0}'.format(dotenv_path))


class Config:
    """Base config vars."""
    GRAPHIQL = True
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'

    # secrect key for JWT token
    SECRET_KEY = os.environ.get('SECRET_KEY')

    # graphql endpoint
    GRAPHQL_ENDPOINT = '/graphql'

    # cors allowed domain
    ALLOW_ORIGINS = '*'

    # wagger docs
    REST_TITLE = 'Graphue REST API'
    REST_VERSION = '1.0'
    REST_DESCRIPTION = 'API documentation of a Graphue'
    REST_DOC_URI = '/doc'

    # language supported
    LANGUAGES = {
        'en': 'English',
        'vi': 'Vietnamese'
    }

    # public endpoint
    PUBLIC_SCHEMA = [
        '__schema',
        'loginUser',
        'createFromGoogleUser'
    ]

    # Google API credentials
    GOOGLE_ACCESS_TOKEN_URI = 'https://www.googleapis.com/oauth2/v4/token'
    GOOGLE_AUTHORIZATION_SCOPE = 'openid email profile'


class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = True
    BASE_URI = os.environ.get('DEVELOPMENT_BASE_URI')
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DEVELOPMENT_SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_ECHO = False
    MONGO_DATABASE_URI = os.environ.get('DEVELOPMENT_MONGO_DATABASE_URI')
    MONGO_DATABASE = os.environ.get('DEVELOPMENT_MONGO_DATABASE')
    REDIS_URI = os.environ.get('DEVELOPMENT_REDIS_URI')
    NOT_FOUND_PAGE_URI = os.environ.get('DEVELOPMENT_NOT_FOUND_PAGE_URI')
    OAUTH_VERIFIED_PAGE_URI = os.environ.get(
        'DEVELOPMENT_OAUTH_VERIFIED_PAGE_URI')
    GOOGLE_REDIRECT_URI = os.environ.get('DEVELOPMENT_GOOGLE_REDIRECT_URI')
    GOOGLE_CLIENT_ID = os.environ.get('DEVELOPMENT_GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.environ.get('DEVELOPMENT_GOOGLE_CLIENT_SECRET')


class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    BASE_URI = os.environ.get('PRODUCTION_BASE_URI')
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'PRODUCTION_SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_ECHO = False
    MONGO_DATABASE_URI = os.environ.get('PRODUCTION_MONGO_DATABASE_URI')
    MONGO_DATABASE = os.environ.get('PRODUCTION_MONGO_DATABASE')
    REDIS_URI = os.environ.get('PRODUCTION_REDIS_URI')
    NOT_FOUND_PAGE_URI = os.environ.get('PRODUCTION_NOT_FOUND_PAGE_URI')
    OAUTH_VERIFIED_PAGE_URI = os.environ.get(
        'PRODUCTION_OAUTH_VERIFIED_PAGE_URI')
    GOOGLE_REDIRECT_URI = os.environ.get('PRODUCTION_GOOGLE_REDIRECT_URI')
    GOOGLE_CLIENT_ID = os.environ.get('PRODUCTION_GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.environ.get('PRODUCTION_GOOGLE_CLIENT_SECRET')
