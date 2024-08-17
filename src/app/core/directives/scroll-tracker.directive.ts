/*eslint-disable */
import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
    selector: '[scrollTracker]',
    standalone: true
})
export class ScrollTrackerDirective {
    @Output() scrollingFinished = new EventEmitter<void>();
    offsetB = 20;
    emitted = false;

    @HostListener("window:scroll", [])
    onScroll(): void {
        if ((window.innerHeight + window.scrollY + this.offsetB) >= document.documentElement.scrollHeight && !this.emitted) {
            this.emitted = true;
            this.scrollingFinished.emit();
        } else if ((window.innerHeight + window.scrollY + this.offsetB) < document.documentElement.scrollHeight) {
            this.emitted = false;
        }
    }
}