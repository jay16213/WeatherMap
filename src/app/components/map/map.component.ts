import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { WeatherService } from '../../services/weather.service';
import { Weather } from '../../models/weather';
import { Console } from '@angular/core/src/console';
import { MouseEvent } from '@agm/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor(
    private weatherService: WeatherService,
    private router: Router,
    private db: AngularFireDatabase) {}

  title = 'Weather app';
  mapLat: number = 23.5;
  mapLng: number = 121.0;
  time = new Date();

  citys: any[] = [];

  ngOnInit() {
    this.citys = this.weatherService.getCityList();
    console.log(this.citys.length);
    for(var i = 0; i < this.citys.length; i++) {
      this.citys[i].isOpen = false;
      this.getCurreentConditions(i, this.citys[i].cityName);
    }
  }

  getCurreentConditions(index: number, location: string)
  {
    this.weatherService.getCurreentConditions(location).subscribe(
      data => {
        console.log(this.citys[index].cityName);
        this.citys[index].temp_c = data['current_observation']['temp_c'];
        this.citys[index].wind_kph = data['current_observation']['wind_kph'];
        this.weatherService.updateCityData(this.citys);
      }
    )
  }

  uploadCurrentTemp(listPath: string, data: any) {
    this.db.database.ref().child(listPath).push(data);
  }

  mapClicked($event: MouseEvent) {
    this.weatherService.getGeoConditions($event.coords.lat, $event.coords.lng).subscribe(
      data => {
        console.log(`/geolookup/conditions/q/${$event.coords.lat},${$event.coords.lng}.json`);
        var temp_c ="N/A";
        var wind_kph ="N/A";

        if(data.hasOwnProperty('current_observation'))
        {
          temp_c = data['current_observation']['temp_c'];
          wind_kph = data['current_observation']['wind_kph'];
        }
        var cityName = data['location']['city'];
        this.citys.push({
          cityName: cityName,
          temp_c: temp_c,
          wind_kph: wind_kph,
          lat: $event.coords.lat,
          lng: $event.coords.lng,
          isOpen: false
        });

        this.weatherService.addNewCity({
          cityName: cityName,
          temp_c: temp_c,
          wind_kph: wind_kph,
          lat: $event.coords.lat,
          lng: $event.coords.lng,
          isOpen: false
        });
      }
    );
  }

  markerHover($event: MouseEvent, index: number) {
    this.citys[index].isOpen = true;
  }

  markerLeave($event: MouseEvent, index: number) {
    this.citys[index].isOpen = false;
  }

  markerClicked($event: MouseEvent, cityName: string)
  {
    this.router.navigate(['plot/' + cityName]);
  }
}
