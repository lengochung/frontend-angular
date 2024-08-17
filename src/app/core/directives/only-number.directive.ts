/* eslint-disable require-jsdoc */
import { Directive, HostListener, ElementRef } from '@angular/core';
import Lib from '../../utils/lib';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[onlyNumber]',
    standalone: true
})
export class onlyNumberDirective {
    /** Constructor */
    constructor(private _el: ElementRef) {}

    @HostListener("input", ["$event"])
    onInputChange(event: InputEvent): void {
        this._check(event);
    }

    @HostListener("paste", ["$event"])
    onInputPaste(event: InputEvent): void {
        const element = this._el.nativeElement as HTMLInputElement;
        element.value = '';
        this._check(event);
    }

    @HostListener("blur", ["$event"])
    onInputBlur(event: FocusEvent): void {
        this._check(event);
        const element = this._el.nativeElement as HTMLInputElement;
        element.value = Lib.getFormatNumber(element.value);
    }

    @HostListener("focus", ["$event"])
    onInputFocus(event: FocusEvent): void {
        this._check(event);
    }

    private _check(event: UIEvent): void {
        const element = this._el.nativeElement as HTMLInputElement;
        const initialValue = element.value;
        const regex = /[^0-9.]*/g;
        element.value = initialValue.replace(regex, '');
        if (initialValue !== element.value) {
            event.stopPropagation();
        }
    }
}
