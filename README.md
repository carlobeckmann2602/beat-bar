# beat.bar

To run beat.bar locally you need:
1. The Django Backend (see: **Django Server** (requires python)). Therefore, check the following points:
- Python needs to be installed

2. The CDN Mockup (see: **CDN Server** (requires node and npm)). Therefore, check the following points:
- Node needs to be installed in v 16 or later

3. The React Frontend (see: **React App** (requires node and npm)). Therefore, check the following points:
- Node needs to be installed in v 16 or later

4. **OPTIONAL** The Beatbar Analyzer Tool
- Requires npm to be installed


# Django Server

## Activate Phython Enviorment

Make sure to add the path to your python installation and its version in `beatbar_env/pyvenv.cfg`
Is in directory 'beatbar_env'

(MacOS) run `source ./beatbar_env/bin/activate`

(Windows) or run `./beatbar_env/Scripts/activate`

A Python virtual environment should now have been started in the terminal. Use the terminal for the following two Python steps:

## Change into the django directory

Change to directory 'beatbar_django' `cd beatbar_django`

## Django Server starten Environment aktivieren

1. run `python manage.py runserver` in 'beatbar_django' directory
2. server runs on localhost:8000
3. admin side: '/admin'
   - Username: admin
   - Password: admin
4. upload new songs on '/upload'

# CDN Server

The CDN server stores the songs, that can be played through the frontend. 
It is not stored in the frontend itself to provide faster loading times and a loose-coupling-architecture


1. Open a new terminal in the directory where this readme file is also located
2. Change the directory. I.e. by running: `cd beatbar_cdn`
3. Run `npm install` to install the node dependencies. 
4. Once the installation step has finished, run `npm start` to start the application

The console should now promt that an application is serving content on 'http://localhost:3001'

# Beatbar Player (React App)

This is the actual frontend web player for the endusers.

1. Move into the directory by running `cd beatbar_react`
2. run `yarn install` to install all necessary packages 
3. run `yarn start`

# (Optional) Analyzer

To run the analyzer you have to serve it on your local machine to avoid several CORS issues. 
1. Move into the directory by running `cd beatbar_analyzer`
2. Run `npm install` to install all necessary dependencies
3. Run `npm start` to start the Analyzer on your local machine. By default it should be running on 'http://localhost:3003' (as defined in its package.json file at the start script)