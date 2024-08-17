import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderTemplateComponent } from '../header-template/header-template.component';
import { FooterTemplateComponent } from '../footer-template/footer-template.component';
@Component({
    templateUrl: './single-template.component.html',
    standalone: true,
    imports: [
        RouterOutlet,
        HeaderTemplateComponent,
        FooterTemplateComponent
    ]
})
export class SingleTemplateComponent {
}