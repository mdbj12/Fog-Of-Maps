from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
# from sqlalchemy.ext.associationproxy import association_proxy

db = SQLAlchemy()

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(10), unique=True)
    email = db.Column(db.String(50), unique=True)
    # comment out password Column if using Google Auth
    password = db.Column(db.String(25))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    # dates = db.relationship('Date', backref='user')

    # serialize_rules = ('-dates.user', '-created_at', '-updated_at')

    # email validation. email must include @
    @validates('email')
    def validate_email(self, key, address):
        if '@' not in address:
            raise ValueError('Email must include @')
        return address
    # password validation. pass must have at least 4 characters
    @validates('password')
    def validate_password(self, key, value):
        if len(value) < 4:
            raise ValueError('Please enter a password with more than 4 characters')
        return value
    
# table not necessary at the moment. Come back to this later if using
# tracks when user was created (date and time)

# class Date(db.Model, SerializerMixin):
#     __tablename__ = 'dates'

#     id = db.Column(db.Integer, primary_key=True)
#     day = db.Column(db.String)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
#     created_at = db.Column(db.DateTime, server_default=db.func.now())
#     updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

#     serialize_rules = ('-user.dates', '-created_at', '-updated_at')