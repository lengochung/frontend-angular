import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarNavigationComponent } from '../sidebar-navigation/sidebar-navigation.component';
import { HeaderTemplateComponent } from '../header-template/header-template.component';
import { FooterTemplateComponent } from '../footer-template/footer-template.component';
@Component({
    templateUrl: './master-template.component.html',
    standalone: true,
    imports: [
        RouterOutlet,
        HeaderTemplateComponent,
        FooterTemplateComponent,
        SidebarNavigationComponent
    ]
})
export class MasterTemplateComponent {
    constructor() {}
}