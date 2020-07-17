from flask_restplus import reqparse

google_cb_args = reqparse.RequestParser()
google_cb_args.add_argument(
    'code', type=str, required=True, help='Google code')
google_cb_args.add_argument(
    'scope', type=str, required=False, help='Google scope')
google_cb_args.add_argument(
    'authuser', type=str, required=False, help='Google auth user')
google_cb_args.add_argument(
    'prompt', type=str, required=False, help='Google promt')
google_cb_args.add_argument(
    'state', type=str, required=False, help='Google state')
