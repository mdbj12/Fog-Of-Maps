from app import app
from models import db, User, Marker

import click

with app.app_context():
    # User.query.delete()
    # Marker.query.delete()
    # click.echo('Deleting Data ... ')

    user_options = 0
    while user_options != 3:
        click.echo('(1) Create new UserID')
        click.echo('(2) Select UserID')
        click.echo('(3) Quit Program ... ')

        user_options = int(input())

        if user_options == 1:

            @click.command()
            @click.option('--username', prompt='Enter Username: ')
            @click.option('--email', prompt='Enter Email: ')
            @click.option('--password', prompt='Enter Password: ')

            def create_user(username, email, password):
                new_user = User(
                    username = username,
                    email = email,
                    password = password
                )

                db.session.add(new_user)
                db.session.commit()

                click.echo('Creating User ... ')

            if __name__ == '__main__':
                create_user.main(standalone_mode=False)

        elif user_options == 2:

            menu_options = 0
            while menu_options != 2:
                click.echo('(1) Want to add a location?')
                click.echo('(2) Back to UserIDs')

                menu_options = int(input())

                if menu_options == 1:

                    users = db.session.query(User).all()
                    user_info = dict()
                    for user in users:
                        user_info[user.id] = user
                        click.echo(user.username)

                    while True:
                        try:
                            user_id = int(input('Search a UserID: '))
                        except ValueError:
                            click.echo('Enter Valid UserID')
                            continue
                        if user_id not in list(user_info.keys()):
                            click.echo('UserID does not exist')
                        else:
                            break
                    
                    @click.command()
                    @click.option('--latitude', type=click.FloatRange(-180, 180), prompt='Enter Latitude: ')
                    @click.option('--longitude', type=click.FloatRange(-360, 360), prompt='Enter Longitude: ')
                    @click.option('--times_visited', type=int, prompt='How many times have you been here?: ')

                    def add_location(latitude, longitude, times_visited, user_id=user_id):
                        new_location = Marker(
                            latitude = latitude,
                            longitude = longitude,
                            user_id = user_id,
                            times_visited = times_visited
                        )

                        db.session.add(new_location)
                        db.session.commit()

                        click.echo('Location Entered!')

                    if __name__ == '__main__':
                        add_location.main(standalone_mode=False)
                    continue

                elif menu_options == 2:
                    click.echo('Going back to UserID')
    
        else:
            click.echo('Quitting Program ... ')
