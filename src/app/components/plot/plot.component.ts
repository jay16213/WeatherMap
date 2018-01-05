import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AngularFireDatabase } from 'angularfire2/database';
import { WeatherService } from '../../services/weather.service';
import { Params } from '@angular/router/src/shared';
import { Observable } from 'rxjs/Observable';
import { element } from 'protractor';

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.scss']
})
export class PlotComponent implements OnInit {

  @ViewChild('current') current: ElementRef;
  @ViewChild('predict') predict: ElementRef;

  tempObservable: Observable<any[]>;

  cityName: string;
  lat: number;
  lng: number;
  currentTempList: any[] = [];
  predictTempList: any[] = [];

  constructor(
    private db: AngularFireDatabase,
    private weatherService: WeatherService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.cityName = params['name'];
      var data = this.weatherService.getCity(this.cityName);
      this.lat = data.lat;
      this.lng = data.lng;

      this.weatherService.getHourlyTempHistory(this.cityName).subscribe(
        data => {
          for(var i = 0; i < data.length; i++)
            this.currentTempList.push(data[i].temp);

          console.log(this.currentTempList);
          this.basicChart(this.current.nativeElement, "previous 24HR Temperture", this.currentTempList);
        }
      );

      this.weatherService.getHourlyConditions(this.lat, this.lng).subscribe(
        data => {
          for(var i = 0; i < 24; i++)
          {
            this.predictTempList.push(parseFloat(data['hourly_forecast'][i]['temp']['metric']));
            console.log(parseFloat(data['hourly_forecast'][i]['temp']['metric']));
          }
          this.basicChart(this.predict.nativeElement, "Future 24HR predict Temperture", this.predictTempList);
        }
      );
    });
  }

  getCurrentTemp(listPath: string): Observable<any[]> {
    return this.db.list(listPath).valueChanges();
  }

  basicChart(element: ElementRef, title: string, list: any[]) {
    //const element = this.el.nativeElement;
    var layout = { title: title };
    var traceCurrent = {
      name: 'temperture',
      y: list,
      boxpoints: 'all',
      type: 'box'
    };

    var data = [traceCurrent];
    Plotly.newPlot(element, data, layout);
  }
}
