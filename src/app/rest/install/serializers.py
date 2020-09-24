from flask_restplus import fields
from app.rest import rest

app_installation = rest.model('App installation', {
    'installed': fields.Boolean(readonly=True, description='The unique identifier of marked app installed success or not.')
})
