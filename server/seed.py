from app import app
from models import db, User, Marker

with app.app_context():
    print('Deleting data ... ')
    User.query.delete()
    Marker.query.delete()

    print('Creating User ... ')
    u1 = User(username='Michael', email='michaelj229@gmail.com', password='password')

    print('Generating Coordinates ...')
    c1 = Marker(latitude=40.707, longitude=-74.012, user_id=1, times_visited=1)
    c2 = Marker(latitude=40.702, longitude=-74.014, user_id=1, times_visited=10)
    c3 = Marker(latitude=40.718, longitude=-74, user_id=1, times_visited=30)

    users = [u1]
    markers = [c1, c2, c3]
    db.session.add_all(users + markers)
    db.session.commit()

    print('Done Seeding!')