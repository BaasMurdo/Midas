import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { LoaderButtonComponent } from './loader-button/loader-button.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

const EXPORTED_DECLARATIONS = [
  LoaderButtonComponent,
  ErrorDialogComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule,
  ],
  entryComponents: [ErrorDialogComponent],
  exports: [EXPORTED_DECLARATIONS],
  declarations: EXPORTED_DECLARATIONS,
})
export class ComponentsModule { }
