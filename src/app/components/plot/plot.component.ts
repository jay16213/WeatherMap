import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AngularFireDatabase } from 'angularfire2/database';
import { WeatherService } from '../../services/weather.service';
import { Params } from '@angular/router/src/shared';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.scss']
})
export class PlotComponent implements OnInit {

  @ViewChild('chart') el: ElementRef;

  tempObservable: Observable<any[]>;

  cityName: string;
  currentTempList: number[] = [];
  predictTempList: number[] = [];

  constructor(
    private db: AngularFireDatabase,
    private weatherService: WeatherService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    //this.currentTempList.push(this.tempObservable['temp_c']);
    //console.log("c: %f", this.currentTempList[0]);

    this.route.params.subscribe((params: Params) => {
      this.cityName = params['name'];
      this.tempObservable = this.getTemp('/current_observation');
      console.log("???");
      this.tempObservable.subscribe(
        data => {
          console.log(data);
          console.log(data[3]);
          this.currentTempList.push(data[3]);
        }
      );
      /*this.weatherService.getCurreentConditions(this.cityName).subscribe(
        data => {
          this.currentTempList.push(data['current_observation']['temp_c']);
        }
      );*/

      /*this.weatherService.getHourlyConditions(this.cityName).subscribe(
        data => {
          for(var i = 0; i < 24; i++)
          {
            this.predictTempList.push(parseFloat(data['hourly_forecast'][i]['temp']['metric']));
            console.log(parseFloat(data['hourly_forecast'][i]['temp']['metric']));
          }
          this.basicChart();
        }
      );*/
    });
  }

  getTemp(listPath: string): Observable<any[]> {
    return this.db.list(listPath).valueChanges();
  }

  basicChart() {
    const element = this.el.nativeElement;
    console.log("len: %d", this.currentTempList.length);
    var layout = { title: `${this.cityName} Temperture` };
    var traceCurrent = {
      name: 'Current temp',
      y: this.currentTempList,
      boxpoints: 'all',
      type: 'box'
    };
    var tracePredict = {
      name: 'Predict temp(24 hr)',
      y: this.predictTempList,
      boxpoints: 'all',
      type: 'box'
    };

    var data = [traceCurrent, tracePredict];
    Plotly.newPlot(element, data, layout);
  }
}
