import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { PlotComponent } from './components/plot/plot.component';
import { MapComponent } from './components/map/map.component';

const routes: Routes = [
  { path: '', redirectTo: "map/" , pathMatch: 'full' },
  { path: 'map/', component: MapComponent },
  { path: 'plot/:id', component: PlotComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
