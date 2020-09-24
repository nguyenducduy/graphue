import logging
from flask_restplus import Api
from app.config import Config
from flask import current_app

log = logging.getLogger(__name__)

rest = Api(version=Config.REST_VERSION,
           title=Config.REST_TITLE,
           description=Config.REST_DESCRIPTION,
           doc=Config.REST_DOC_URI)


@rest.errorhandler
def default_error_handler(e):
    message = 'An unhandled exception occurred.'
    log.exception(message)
