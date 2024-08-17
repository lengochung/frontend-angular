/*eslint-disable */
import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
    selector: '[onFocus], [onClick], [onKeyup]',
    standalone: true
})
export class ElementListenerDirective {
    @Output() onClick = new EventEmitter<boolean>();
    @Output() onFocus = new EventEmitter<any>();
    @Output() onKeyup = new EventEmitter<any>();

    @HostListener("click", ["$event"])
    public onListenerClick(event: any): void {
        this.onClick.emit(true);
    }
    @HostListener("focus", ["$event"])
    public onListenerFocus(event: any): void {
        this.onFocus.emit(true);
    }
    @HostListener("focusout", ["$event"])
    public onListenerFocusOut(event: any): void {
        this.onFocus.emit(false);
    }
    @HostListener("keyup", ["$event.target.value"])
    public onListenerKeyup(value: any): void {
        this.onKeyup.emit(value);
    }
}