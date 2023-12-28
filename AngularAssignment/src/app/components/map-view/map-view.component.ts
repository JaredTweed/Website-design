// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-map-view',
//   templateUrl: './map-view.component.html',
//   styleUrl: './map-view.component.css'
// })
// export class MapViewComponent {

// }


import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Report } from '../../models/report.model';
// import '../../../node_modules/leaflet/dist/leaflet.js'
// import '../../../node_modules/leaflet/dist/leaflet.css'

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {

  private map!: L.Map;
  private centroid: L.LatLngExpression = [49.2600, -123.0000];
  private markers: L.Marker[] = [];
  reportService: any;

  private initMap(): void {
    // this.map = L.map('map').setView(this.centroid, 12)
    this.map = L.map('map', {
      center: this.centroid,
      zoom: 11
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 0, // set to 7 as default
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.updateMarkers();
  }


  updateMarkers(): void {
    this.clearMarkers();
    this.reportService.getAllReports().subscribe((reports: Report[]) => {
      console.log(reports[0].longitude);
      reports.forEach(report => this.addMarker(report));
    });
  }
  
  private clearMarkers(): void {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  }

  addMarker(report: Report): void {
    if(report.longitude != null || report.latitude != null) {
      const marker = L.marker([report.latitude, report.longitude]).addTo(this.map).bindPopup(this.createPopupContent(report));
      this.markers.push(marker);
    }
  }

  private createPopupContent(report: Report): string {
    return `<div>
              <h4>${report.troublemakerName}</h4>
              <p>Reported by: ${report.reporterInfo.name}</p>
              <p>Location: ${report.location}</p>
              <p>Details: ${report.extraInfo}</p>
            </div>`;
  }


  constructor() { }

  ngOnInit(): void {
    this.initMap();
  }
}

/*

import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapService } from '../services/map.service';
import { ReportService } from '../services/report.service';
import { Subscription } from 'rxjs';
import { Report } from '../models/report.model';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
// export class MapViewComponent {
// }

export class MapViewComponent  implements OnInit, OnDestroy {

  private reportsSubscription: Subscription = new Subscription();

  constructor(
    private mapService: MapService,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.initializeMap();
    this.subscribeToReportUpdates();
  }

  ngOnDestroy(): void {
    if (this.reportsSubscription) {
      this.reportsSubscription.unsubscribe();
    }
  }

  private initializeMap(): void {
    const initialCoordinates: L.LatLngExpression = [39.8283, -98.5795]; // Adjust as necessary
    this.mapService.initializeMap('map', initialCoordinates, 13);
  }

  private subscribeToReportUpdates(): void {
    this.reportsSubscription = this.reportService.getAllReports().subscribe(
      (reports: Report[]) => {
        this.mapService.updateMarkers(reports);
      },
      (error) => {
        console.error('Error fetching reports: ', error);
      }
    );
  }
}
*/