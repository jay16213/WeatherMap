import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { AngularFireDatabase } from 'angularfire2/database';
import { environment } from '../../environments/environment';
import {Subject} from 'rxjs';

export interface Weather {
  cityName: string;
  currentTemp: number[];
  predictTemp?: number[];
}

@Injectable()
export class WeatherService {
  API_KEY: string = "YOUR_API_KEY";
  API_URL: string = "https://api.wunderground.com/api/" + this.API_KEY;

  GOOGLE_API_KEY: string = "YOUR_API_KEY";

  citys: any[] = [
    {//taipei
      country: "TW",
      cityName:"Taipei",
      temp_c: "N/A",
      wind_kph: "N/A",
      lat: 25.06999969,
      lng: 121.55000305,
      isOpen: false
    },
    {//hsin-chu
      country: "TW",
      cityName:"Hsin-chu",
      temp_c: "N/A",
      wind_kph: "N/A",
      lat: 24.79999924,
      lng: 120.97000122,
      isOpen: false
    },
    {
      country: "CA",
      cityName: "San_Francisco",
      temp_c: "N/A",
      wind_kph: "N/A",
      lat: 37.776289,
      lng: -122.395234,
      isOpen: false
    }
  ];

  constructor(private http: HttpClient, private db: AngularFireDatabase) {
  }

  init() {
    this.uploadCurrentTemp("Taipei", 25.06999969, 121.55000305);
    this.uploadCurrentTemp("Hsin-chu", 24.79999924, 120.97000122);
    this.uploadCurrentTemp("San_Francisco", 37.776289, -122.395234);

    Observable.interval(1000*3600).subscribe(() => {
      console.log("update current");
      this.uploadCurrentTemp("Taipei", 25.06999969, 121.55000305);
      this.uploadCurrentTemp("Hsin-chu", 24.79999924, 120.97000122);
      this.uploadCurrentTemp("San_Francisco", 37.776289, -122.395234);
    });
  }

  getCityList(): any[] {
    return this.citys;
  }

  getCity(name: string): any {
    for(var i = 0; i < this.citys.length; i++) {
      if(this.citys[i].cityName == name)
        return { lat: this.citys[i].lat, lng: this.citys[i].lng };
    }
  }

  updateCityData(citys: any[]) {
    this.citys = citys;
  }

  addNewCity(data: any) {
    var isNew = true;
    for(var i = 0; i < this.citys.length && isNew; i++) {
      if(this.citys[i] == data.cityName) isNew = false;
    }

    if(isNew) {
      this.citys.push({
        cityName: data.cityName,
        temp_c: data.temp_c,
        wind_kph: data.temp_c,
        lat: data.lat,
        lng: data.lng
      });
      
      this.uploadCurrentTemp(data.cityName, data.lat, data.lng);//first upload
      Observable.interval(1000*10).subscribe(() => {
        console.log("update current");
        this.uploadCurrentTemp(data.cityName, data.lat, data.lng);
      });
    }
  }

  getCurreentConditions(lat: number, lng: number): any {
    return this.http.get(`${this.API_URL}/geolookup/conditions/q/${lat},${lng}.json`);
  }

  uploadCurrentTemp(cityName: string, lat: number, lng: number) {
    console.log("update %s current temp", cityName);
    return this.getCurreentConditions(lat, lng).subscribe(
      data => {
        var hour = new Date().getHours();
        var temp = data['current_observation']['temp_c'];
        this.db.database.ref().child('/current/' + cityName).push({hour: hour, temp: temp});
    });
  }

  getGeoConditions(lat: number, lng: number): any {
    return this.http.get(`${this.API_URL}/geolookup/conditions/q/${lat},${lng}.json`);
  }

  getHourlyTempHistory(location: string): Observable<any[]> {
    return this.db.list('/current/' + location).valueChanges();
  }

  getHourlyConditions(lat: number, lng: number): any {
    console.log(`${this.API_URL}/geolookup/hourly/q/${lat},${lng}.json`);
    return this.http.get(`${this.API_URL}/geolookup/hourly/q/${lat},${lng}.json`);
  }

  getAddress(lat: number, lng: number): any {
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.GOOGLE_API_KEY}`);
  }

  private handleError(error: Response) {
    console.error(error);
    let message = `Error status code ${error.status} at ${error.url}`;
    return Observable.throw(message);
  }
}
