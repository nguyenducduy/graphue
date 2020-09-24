import logging
from flask import request, redirect, current_app
from flask_restplus import Resource
from app.rest import rest
from app.rest.oauth.parsers import google_cb_args
# google auth
from authlib.integrations.requests_client import OAuth2Session
import google.oauth2.credentials
import googleapiclient.discovery
import urllib

log = logging.getLogger(__name__)

ns = rest.namespace(
    'oauth/google', description='Callback from goolge oauth login')


@ns.route('')
class GoogleCallback(Resource):
    @rest.expect(google_cb_args)
    def get(self):
        """
        Receive callback params from google
        """
        args = google_cb_args.parse_args(request)
        req_state = args.get('state')

        session = OAuth2Session(
            current_app.config['GOOGLE_CLIENT_ID'],
            current_app.config['GOOGLE_CLIENT_SECRET'],
            scope=current_app.config['GOOGLE_AUTHORIZATION_SCOPE'],
            state=req_state,
            redirect_uri=current_app.config['GOOGLE_REDIRECT_URI']
        )

        oauth2_tokens = session.fetch_access_token(
            current_app.config['GOOGLE_ACCESS_TOKEN_URI'],
            authorization_response=request.url,
        )

        credentials = google.oauth2.credentials.Credentials(
            oauth2_tokens['access_token'],
            refresh_token=oauth2_tokens['refresh_token'],
            client_id=current_app.config['GOOGLE_CLIENT_ID'],
            client_secret=current_app.config['GOOGLE_CLIENT_SECRET'],
            token_uri=current_app.config['GOOGLE_ACCESS_TOKEN_URI']
        )

        oauth2_client = googleapiclient.discovery.build(
            'oauth2', 'v2',
            credentials=credentials)

        user_info = oauth2_client.userinfo().get().execute()

        if user_info['verified_email']:
            return redirect(
                current_app.config['OAUTH_VERIFIED_PAGE_URI'] + '/google?' +
                urllib.parse.urlencode({**user_info, **oauth2_tokens})
            )
        else:
            return redirect(current_app.config['NOT_FOUND_PAGE_URI'])
