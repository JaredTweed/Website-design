// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-report-form',
//   templateUrl: './report-form.component.html',
//   styleUrl: './report-form.component.css'
// })
// export class ReportFormComponent {
// }

import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { HashService } from '../../services/hash.service';
import { ReportLocation } from '../../models/report.model';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent {
  reportForm: FormGroup;
  locationsList: ReportLocation[];
  // @Output() reportSubmitted = new EventEmitter();

  constructor(private fb: FormBuilder, private reportService: ReportService, private hashService: HashService) {
    this.locationsList = [];
    this.reportForm = this.fb.group({
      reportingPersonInfo: this.fb.group({
        name: ['', Validators.required],
        phoneNumber: ['', Validators.required]
      }),
      troublemakerName: ['', Validators.required],
      location: this.fb.group({
        placeName: ['', Validators.required],
        longitude: ['', Validators.required],
        latitude: ['', Validators.required]
      }),
      pictureLink: [''],
      extraInfo: ['']
    });
  }

  onSubmit() {
    if (this.reportForm.valid) {
      const password = prompt('Please enter the password:');
      if (password) {
        this.locationsList.push({name: this.reportForm.value.location, longtitude: this.reportForm.value.longitude, latitued: this.reportForm.value.latitude});

        this.hashService.hashPassword(password).subscribe((hashedPassword: string) => {
          if (hashedPassword === 'c9fc20c27a5e29813e54ada78dce6c8f') {
            console.log('Submitting report:', this.reportForm.value);
            this.reportService.createReport(this.reportForm.value).subscribe(
              (response: any) => {
                // Handle the response by resetting the form
                this.reportForm.reset();
                console.log('Report submitted successfully.');
              },
              (error: any) => {
                // Handle the error
                console.error('There was an error submitting the report:', error);
              }
            );
            // this.reportSubmitted.emit();
          } else {
            alert('Incorrect password. Report submission canceled. ');// + hashedPassword + ' \'' + password + '\'');
          }
        });
      }
      } else {
        alert('The report is not valid. Please fill in all required fields.');
      }
  }



  // onSubmit() {
  //   if (this.reportForm.valid) {
  //     const password = prompt('Please enter the password:');
  //     if (this.hashService.hashPassword(password) === 'fcab0453879a2b2281bc5073e3f5fe54') {
  //       console.log('Submitting report:', this.reportForm.value);
  //       this.reportService.createReport(this.reportForm.value).subscribe(
  //         (response: any) => {
  //           // Handle the response by resetting the form
  //           this.reportForm.reset();
  //           console.log('Report submitted successfully.');
  //         },
  //         (error: any) => {
  //           // Handle the error
  //           console.error('There was an error submitting the report:', error);
  //         }
  //       );
  //       // this.reportSubmitted.emit();
  //     } else {
  //       alert('Incorrect password. Report submission canceled.');
  //     }
  //   } else {
  //     alert('The report is not valid. Please fill in all required fields.');
  //   }
  // }
}
