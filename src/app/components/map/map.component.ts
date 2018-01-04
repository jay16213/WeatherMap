import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';

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

  constructor(private weatherService: WeatherService, private router: Router) {}

  title = 'Weather app';
  mapLat: number = 23.5;
  mapLng: number = 121.0;

  citys: any[] = [
    {//taipei
      cityName:"Taipei",
      temp_c: "N/A",
      wind_kph: "N/A",
      lat: 25.06999969,
      lng: 121.55000305,
      isOpen: false
    },
    {//hsin-chu
      cityName:"Hsin-chu",
      temp_c: "N/A",
      wind_kph: "N/A",
      lat: 24.79999924,
      lng: 120.97000122,
      isOpen: false
    }
  ];

  ngOnInit() {
    this.getCurreentConditions("Taipei");
    this.getCurreentConditions("Hsin-chu");
  }

  getCurreentConditions(location: string)
  {
    this.weatherService.getCurreentConditions(location).subscribe(
      data => {
        for(var i = 0; i < this.citys.length; i++)
        {
          if(this.citys[i].cityName == location)
          {
            console.log(this.citys[i].cityName);
            this.citys[i].temp_c = data['current_observation']['temp_c'];
            this.citys[i].wind_kph = data['current_observation']['wind_kph'];
          }
        }
      }
    )
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
