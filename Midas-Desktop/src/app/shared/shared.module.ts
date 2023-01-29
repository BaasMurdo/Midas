import { NgModule } from '@angular/core';
import { ComponentsModule } from './components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';

@NgModule({
  imports: [
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule,
  ],
  exports: [
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule,
  ],
  entryComponents: [
    // Dialogs here
    ErrorDialogComponent
  ]
})
export class SharedModule {
  // tslint:disable-next-line: typedef
  static forRoot() {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
