# WeatherApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.3.

## Development
- git clone and enter the project folder
- run `npm install`
- set up project(see following).
- run `ng serve`
- Navigate to `http://localhost:4200`


## API Usage
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/?hl=zh_TW)
- [Firebase](https://firebase.google.com/)
- [Weather Underground API](https://www.wunderground.com/weather/api)


## Project Set Up
In this project, you will use 3 API which mentioned above. You need to get the API KEY from their website first.

After you get your api key, go to `src/environments/`, edit **environment.ts** and **environment.prod.ts**, you will see the contents:

``` Typescript
export const environment = {
  production: false,//false for environment.ts and true for environment.prod.ts
  WU_API_KEY: 'YOUR_API_KEY',
  WU_API_PREFIX: 'https://api.wunderground.com/api/',
  GOOGLE_MAP_API_KEY: 'YOUR_API_KEY',
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    databaseURL: 'https://YOUR_PROJECT_ID.firebaseio.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_messagingSenderId'
  }
};
```

Replace the value in the files with your api key or project id.


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.
