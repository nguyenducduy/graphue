from flask_socketio import SocketIO
from app import create_app
import logging
import eventlet
eventlet.monkey_patch()
# from .model import User

# init app
app = create_app()

# add custom cli command line here


# enable socketio
socketio = SocketIO(
    app, async_mode='eventlet', cors_allowed_origins=app.config['ALLOW_ORIGINS'], message_queue=app.config['REDIS_URI'],  manage_session=False)

# check menu, permission
@socketio.on('check_menu_permission_change')
def check(data):
    # print('checking groupid %s' % data)
    pass


if __name__ == '__main__':
    # run app
    log = logging.getLogger(__name__)
    log.info(
        '----- Serving SOCKET-IO at {} -----'.format(app.config['BASE_URI']))
    socketio.run(app, debug=True)
