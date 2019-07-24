import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetaSenderComponent } from './Home/meta-sender.component';

import { RouterModule } from '@angular/router';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule, MatSnackBarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatSnackBarModule,
    RouterModule,

  ],
  declarations: [MetaSenderComponent],
  exports: [MetaSenderComponent]
})
export class MetaModule {
}
