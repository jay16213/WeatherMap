import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { WeatherService } from '../../services/weather.service';
import { Params } from '@angular/router/src/shared';

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.scss']
})
export class PlotComponent implements OnInit {

  @ViewChild('chart') el: ElementRef;

  cityName: string;
  currentTempList: number[] = [];
  predictTempList: number[] = [];

  constructor(
    private weatherService: WeatherService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.cityName = params['name'];
      this.weatherService.getCurreentConditions(this.cityName).subscribe(
        data => {
          this.currentTempList.push(data['current_observation']['temp_c']);
        }
      );

      this.weatherService.getHourlyConditions(this.cityName).subscribe(
        data => {
          for(var i = 0; i < 24; i++)
          {
            this.predictTempList.push(parseFloat(data['hourly_forecast'][i]['temp']['metric']));
            console.log(parseFloat(data['hourly_forecast'][i]['temp']['metric']));
          }
          this.basicChart();
        }
      );
    });
  }

  basicChart() {
    const element = this.el.nativeElement
    console.log("len: %d", this.currentTempList.length);
    var traceCurrent = {
      y: this.currentTempList,
      type: 'box'
    };
    var tracePredict = {
      y: this.predictTempList,
      type: 'box'
    };

    var data = [traceCurrent, tracePredict];
    Plotly.newPlot(element, data);
  }
}
