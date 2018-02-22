import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';  // replaces previous Http service
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { WeatherService } from './services/weather.service';
import { PlotComponent } from './components/plot/plot.component';
import { AppRoutingModule } from './app-routing.module';
import { MapComponent } from './components/map/map.component';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    PlotComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_API_KEY',
      language: 'zh-TW'
    }),
    AngularFireModule.initializeApp(environment.firebase, "YOUR_PROJECT_NAME"),
    AngularFireDatabaseModule,
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AppRoutingModule
  ],
  providers: [
    WeatherService,
    {
      provide: APP_INITIALIZER,
      useFactory: (ws: WeatherService) => function() { ws.init(); },
      deps: [WeatherService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
