# beat.bar

To run beat.bar locally you need:
1. The Django Backend (see: **Django Server** (requires python)). Therefore, check the following points:
- Python needs to installed

2. The CDN Mockup (see: **CDN Server** (requires node and npm)). Therefore, check the following points:
- Node needs to installed in v 16 or later

3. The React Frontend (see: **React App** (requires node and npm)). Therefore, check the following points:
- Node needs to installed in v 16 or later

## Django Server

### Activate Phython Enviorment

Make sure to add the path to your python installation and its version in `beatbar_env/pyvenv.cfg`
Is in directory 'beatbar_env'

(MacOS) run `source ./beatbar_env/bin/activate`

(Windows) or run `./beatbar_env/Scripts/activate`

### Ins Verzeichnis des Servers wechseln

Change to directory 'beatbar_django' `cd beatbar_django`

### Django Server starten Enviorment aktivieren

1. run `python manage.py runserver` in 'beatbar_django' directory
2. server runs on localhost:8000
3. admin side: '/admin'
   - Username: admin
   - Password: admin
4. upload new songs on '/upload'

## CDN Server

1. Open a new terminal in the directory where this readme file is also located
2. Change the directory. I.e. by running: `cd beatbar_cdn`
3. Run `npm install` to install the node dependencies. 
4. Once the installation step has finished, run `npm start` to start the application

The console should now promt that an application is serving content on 'http://localhost:3001'

## React App

1. Move into the directory by running `cd beatbar_react`
2. run `yarn install` to install all necessary packages 
3. run `yarn start`
