from app import app
from models import db, User #Date

with app.app_context():
    print('Deleting data ... ')
    User.query.delete()
    # Date.query.delete()

    print('Creating User ... ')
    u1 = User(username='Michael', email='michaelj229@gmail.com', password='password')

    users = [u1]
    db.session.add_all(users)
    db.session.commit()

    # not using date table

    # print('Generating Dates ... ')
    # d1 = Date(day='06-14-2023', user_id=u1.id)

    # dates = [d1]
    # db.session.add_all(dates)
    # db.session.commit()

    print('Done Seeding!')