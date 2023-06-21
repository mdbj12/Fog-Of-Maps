from flask import Flask, request, make_response, jsonify, session
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource

from models import db, User

app = Flask(__name__)
app.config['SECRET_KEY'] = 'fogofwar'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

CORS(app)
migrate = Migrate(app, db)
db.init_app(app)
api = Api(app)

class Users(Resource):
    def get(self):
        users = User.query.all()
        users_dict_list = [user.to_dict() for user in users]
        return make_response(
            users_dict_list, 200
        )
api.add_resource(Users, '/users')

class Signup(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter(User.username == data['username']).first()
        email = User.query.filter(User.email == data['email']).first()
        if user:
            return make_response(
                {'message': 'Username already exists!'},
                406
            )
        if email:
            return make_response(
                {'message': 'Email already registered!'},
                409
            )
        try:
            new_user = User(
                username = data['username'],
                email = data['email'],
                password = data['password']
            )
            db.session.add(new_user)
            db.session.commit()
        except ValueError as e:
            return make_response(
                e.__str__(),
                422
            )
        return make_response(
            new_user.to_dict(),
            201
        )
api.add_resource(Signup, '/signup')

class Login(Resource):
    def post(self):
        user = User.query.filter(
            User.username == request.get_json()['username'],
            User.password == request.get_json()['password']
        ).first()

        session['user_id'] = user.id
        print(user.id)
        print(session)
        return user.to_dict()
api.add_resource(Login, '/login')

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return {'message': '204: No Content'}, 204
api.add_resource(Logout, '/logout')

class UsersById(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response(
                {'error': 'user not found'},
                404
            )
        return make_response(
            user.to_dict(),
            200
        )
    def patch(self, id):
        user = User.query.filter_by(id=id).first()
        data = request.get_json()
        for attr in data:
            setattr(user, attr, data[attr])
        db.session.add(user)
        db.session.commit()
        return make_response(
            user.to_dict(),
            202
        )
    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response(
                {"error": "user not found"},
                404
            )
        db.session.delete(user)
        db.session.commit()
        return make_response(
            {'message': 'user has been deleted'},
            202
        )
api.add_resource(UsersById, '/users/<int:id>')

if __name__ == '__main__':
    app.run(port=5556, debug=True, host='192.168.1.27')


# change ip address in app.py(host), app.js(useEffect), homescreen.jsx(handleLogout), login.jsx(handleStubmit, handleSignup)
# fl ip 10.129.2.157
# vital 10.42.135.150
# kaigo 192.168.86.20
# home 192.168.1.27









# Google 0Auth Code. Does not work, will come back to this as a stretch goal if needed

# from flask import Flask, session, abort, redirect, request, jsonify , url_for
# from flask_cors import CORS
# from flask_migrate import Migrate
# from flask_restful import Api, Resource
# from models import db, User

# import os
# import pathlib
# import requests
# from pip._vendor import cachecontrol
# from google.oauth2 import id_token
# from google_auth_oauthlib.flow import Flow
# import google.auth.transport.requests
# import json
# import urllib.parse

# app = Flask(__name__)

# CORS(app)
# # delete key!!! app.secret
# app.secret_key = "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"
# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite"
# app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# app.json.compact = False

# os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
# # delete key!!! GOOGLE_CLIENT_ID
# GOOGLE_CLIENT_ID = "389376110209-fv1dnautiahmrmqt7gc2f4fdnlmn20s3.apps.googleusercontent.com"
# client_secrets_file = os.path.join(pathlib.Path(__file__).parent, 'client_secret.json')

# flow = Flow.from_client_secrets_file(
#     client_secrets_file=client_secrets_file,
#     scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
#     redirect_uri="http://127.0.0.1:5556/callback"
# )

# migrate = Migrate(app, db)
# db.init_app(app)
# api = Api(app)

# @app.route("/login")
# def login():
#     authorization_url, state = flow.authorization_url()
#     session["state"] = state
#     return redirect(authorization_url)

# #  fetches data from google thru auth
# @app.route("/callback")
# def callback():
#     flow.fetch_token(authorization_response=request.url)

#     if not session["state"] == request.args["state"]:
#         abort(500)  # State does not match!

#     credentials = flow.credentials
#     request_session = requests.session()
#     cached_session = cachecontrol.CacheControl(request_session)
#     token_request = google.auth.transport.requests.Request(session=cached_session)

#     try:
#         id_info = id_token.verify_oauth2_token(
#             id_token=credentials._id_token,
#             request=token_request,
#             audience=GOOGLE_CLIENT_ID,
#             clock_skew_in_seconds=0
#         )
#         session["google_id"] = id_info.get("sub")
#         session["name"] = id_info.get("name")
#         session["email"] = id_info.get("email")
#         if not User.query.filter_by(email=session["email"]).first():
#             new_user = User(name=session['name'], email=session['email'])
#             db.session.add(new_user)
#             db.session.commit()
#         return redirect("/protected_area")
#     except google.auth.exceptions.InvalidValue as e:
#         print("Token validation error:", e)
#         return "Token validation error. Please try again later."
#     except Exception as e:
#         print("An error occurred during token verification:", e)
#         return "An error occurred during token verification. Please try again."

# @app.route("/logout")
# def logout():
#     session.clear()
#     return redirect("http://localhost:19006/")

# @app.route("/")
# def index():
#     return "Hello World <a href='/login'><button>Login</button></a>"

# @app.route("/protected_area")
# # @login_is_required
# def protected_area():
#     user = User.query.filter_by(email=session["email"]).first()
#     if user:
#         user_data = {
#             "id": user.id,
#             "name": session["name"],
#             "email": session["email"]
#         }
#         return user_data
#         # grabbing user json
#         # session_data = urllib.parse.quote(json.dumps(user_data))
#         # redirect_url = "http://localhost:19006/?session_data=" + session_data
#         # return redirect(redirect_url)
#     else:
#         return jsonify({"error": "User not found"})

# if __name__ == '__main__':
    # app.run(port=5556, debug=True, host='192.168.86.20')