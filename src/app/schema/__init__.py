import logging
import graphene
from graphene_file_upload.flask import FileUploadGraphQLView
from graphene_file_upload.scalars import Upload
from flask import jsonify, request, redirect

from app.schema.queries import Query
from app.schema.mutations import Mutation

# auth middleware
from app.middleware import AuthorizationMiddleware


log = logging.getLogger(__name__)


class Schema:
    def __init__(self, app):
        schema = graphene.Schema(
            query=Query, mutation=Mutation, types=[Upload])

        app.add_url_rule(
            app.config['GRAPHQL_ENDPOINT'],
            view_func=FileUploadGraphQLView.as_view('graphql',
                                                    schema=schema,
                                                    graphiql=app.config['GRAPHIQL'],
                                                    middleware=[AuthorizationMiddleware()])
        )

        log.info(
            '----- Serving GRAPHQL API at {}{} -----'.format(app.config['BASE_URI'], app.config['GRAPHQL_ENDPOINT']))
