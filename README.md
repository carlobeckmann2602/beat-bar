# beat.bar

To run beat.bar locally you need:
1. The Django Backend (see: **Django Server** (requires python))
2. The CDN Mockup (see: **CDN Server** (requires node and npm))
3. The React Frontend (see: **React App** (requires node and npm))

## Django Server

### Activate Phython Enviorment

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

1. cd to `beatbar_cdn`
2. run `npm install`
3. run `npm start`

## React App

Is in directory 'beatbar_react' `cd beatbar_react`

### Installation

1. run `yarn install` to install all necessary packages
2. run `yarn start`
