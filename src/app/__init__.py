import logging.config
import os
from flask import Flask, request, redirect, jsonify, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_babel import Babel
from flask_cors import CORS
from .config import DevelopmentConfig, ProductionConfig

db = SQLAlchemy()


def create_app(*config_cls):
    # Create a Flask WSGI application
    app = Flask(__name__, static_folder='upload')

    # logging
    logging_conf_path = os.path.normpath(os.path.join(
        os.path.dirname(__file__), '../logging.conf'))
    logging.config.fileConfig(logging_conf_path)
    log = logging.getLogger(__name__)

    # environment config
    if app.config["ENV"] == "production":
        app.config.from_object(ProductionConfig)
    else:
        app.config.from_object(DevelopmentConfig)

    # flask babel
    babel = Babel(app)
    @babel.localeselector
    def get_locale():
        return request.accept_languages.best_match(app.config['LANGUAGES'].keys())

    # MySQL connection
    db.init_app(app)
    app.db = db

    # db migrate
    migrate = Migrate(app, db)

    # REST
    from .rest import rest
    from .rest.oauth.google import ns as google_callback_namespace
    from .rest.install.default import ns as install_namespace

    blueprint = Blueprint('rest', __name__)
    rest.init_app(app)
    rest.add_namespace(google_callback_namespace)
    rest.add_namespace(install_namespace)
    app.register_blueprint(blueprint)

    log.info(
        '----- Serving REST API at {} -----'.format(app.config['BASE_URI']))

    # GRAPHQL
    from app.schema import Schema
    Schema(app)

    # cors
    # CORS(app, resources={r'/*': {'origins': app.config['ALLOW_ORIGINS']}})

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db.session.remove()

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin',
                             app.config['ALLOW_ORIGINS'])
        response.headers.add('Access-Control-Allow-Headers',
                             'Content-Type,Authorization')
        return response

    return app
