import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string,
      message: string,
      positiveText: string,
      negativeText: string,
      showPositive: boolean,
      showNegative: boolean,
      buttonWidth: string,
      buttonPosition: string
    }) {
    if (!data.title) { data.title = 'Error Has Occurred'; }
    if (!data.positiveText) { data.positiveText = 'Confirm'; }
    if (!data.negativeText) { data.negativeText = 'Cancel'; }
    if (!data.buttonPosition) {data.buttonPosition = 'unset'; }
    if (data.showPositive === null || data.showPositive === undefined) { data.showPositive = true; }
    if (data.showNegative === null || data.showNegative === undefined) { data.showNegative = true; }
  }

  confirm(value: boolean): void {
    this.dialogRef.close(value);
  }

}
