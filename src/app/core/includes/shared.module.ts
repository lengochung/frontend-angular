import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseValidatorComponent } from './base.validator.component';
import { ContentHeaderComponent } from '../components/content-header/content-header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { UploadComponent } from '../components/upload/upload.component';
export const SHARED_MODULE = [
    CommonModule,
    TranslateModule,
    RouterOutlet,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BaseValidatorComponent,
    ContentHeaderComponent,
    NgbModule,
    NgSelectModule,
    NgMultiSelectDropDownModule,
    PaginationComponent,
    UploadComponent
] as const;
