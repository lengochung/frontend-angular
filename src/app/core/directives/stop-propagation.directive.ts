import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appStopPropagation]',
    standalone: true
})
export class StopPropagationDirective {

    @HostListener("click", ["$event"])
    // eslint-disable-next-line require-jsdoc
    public onClick(event: Event): void {
        event.stopPropagation();
    }

    @HostListener("contextmenu", ["$event"])
    // eslint-disable-next-line require-jsdoc
    public onRightClick(event: Event): void {
        event.stopPropagation();
    }
}
