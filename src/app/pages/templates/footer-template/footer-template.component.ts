import { Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
@Component({
    selector: 'app-footer-template',
    templateUrl: './footer-template.component.html',
    standalone: true,
    imports: [
        TranslateModule,
    ],
})
export class FooterTemplateComponent{
}