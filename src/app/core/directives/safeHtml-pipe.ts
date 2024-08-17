import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Pipe({ name: 'safeHtml', standalone: true })
export class SafeHtmlPipe implements PipeTransform {
    /** Constructor */
    constructor(private sanitized: DomSanitizer) {}

    /**
     * Transform HTML text to HTML
     * @param  {string} value HTML text
     * @returns {SafeHtml} HTML
     */
    transform(value: string): SafeHtml {
        if(!value) {
            value = "";
        }
        return this.sanitized.bypassSecurityTrustHtml(value);
    }
}
@Pipe({name: 'nl2br'})
export class Nl2brPipe implements PipeTransform {
    // eslint-disable-next-line require-jsdoc
    transform(value?: string): string {
        if(!value) {
            return "";
        }
        return value.replace(/\n/g, '<br/>');
   }
}
