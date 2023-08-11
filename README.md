Welcome to the first step into 'Game-ify'-ing your life!
Still under development!!!

The main idea of this app is to allow you to be able to Travel and see a map on your mobile device that is covered in fog!

How can you use it?
As a user, allow it to track your data (No data will be saved!), and it will open up the layer of fog only in places you have been to.

Instructions for DEVs to run this code:

Remember to change Host in App.py to your own IP address
Also App.jsx, Homescreen.jsx, Login.jsx, UserDetailsScreen.jsx (Change these IP addresses as well in the fetch 'http://{insert IP address}:5556')

App is currently running on port 5556

- Client Side:
    - Make sure you have EXPO installed on your mobile device, or some sort of emulator on your laptop
    - Run npm install to install all the necessary packages
    - Finally, just run `npm run start`!
    - Scan the generated QR code through your mobile device and it will open it using EXPO

- Server Side:
    - Flask will not be installed when you clone the repo to your device!
    - Run `pip install` to install the necessary pacakges
    - Next, run `pipenv install && pipenv shell` to enter your terminal
        - Make sure you are still in the server folder after you run the above command
    - Next run these commands as well!
        - `export FLASK_APP=app.py`
        - `export FLASK_RUN_PORT=[port # (I currently have it set to 5556)]`
        - `flask db init`
        - `flask db revision --autogenerate -m '(any text blurb)'`
        - `flask db upgrade head`
    - Finally run `python app.py` to start your server

- If you want to hard code in random data points
    - run `python seed.py`
        - This will execute CLI prompts that you can follow to put in Longitude and Latitude coordinates!
        - Fun fact, the CLI is using the Click library for more functionality lol its pretty cool