import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { Report } from '../../models/report.model';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  reports: Report[] = [];
  sortColumn: string = '';
  sortDirection: string = 'asc';

  constructor(private reportService: ReportService) {this.reports = [];}

  ngOnInit(): void {
    this.loadReports();
  }

  reloadPage(): void {location.reload();}

  loadReports(): void {
    this.reportService.getAllReports().subscribe((reports: Report[]) => {
      this.reports = reports;
      console.log('Report ID:', this.reports[0].location); // this prints the correct id
      
    });
  }

  deleteReport(report: Report): void {
    console.log(report);
    this.reportService.deleteReport(report).subscribe((response: any) => {
      console.log('Report deleted successfully.');
      location.reload(); // Refresh the page
    });
  }

  sortReports(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // Call service function to sort reports based on column and direction
    this.reportService.sortReports(this.sortColumn, this.sortDirection).subscribe(sortedReports => {
      this.reports = sortedReports;
      // this.loadReports();
    });
  }

  viewDetails(report: Report): void {
    // Show the component
    console.log('Viewing details for report:', report);
    // <app-report-details [report]="report"></app-report-details>
  }

  
}

