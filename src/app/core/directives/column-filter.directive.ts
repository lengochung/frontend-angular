
import { Directive, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FilterDisplay } from '../entities/filter-table.entity';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[columnFilterName]',
    standalone: true
})
export class ColumnFilterDirective implements OnChanges {
    @Input() columnFilterName?: string;
    @Input() displayData?: FilterDisplay[];
    @Output() displayDataChange = new EventEmitter<FilterDisplay[]>();
    /** constructor */
    constructor(public elementRef: ElementRef) {}

    /**
     * ngOnChanges
     * @authorhung.le
     *
     * @param {SimpleChanges} changes SimpleChanges
     * @returns {void}
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['displayData']?.currentValue) {
            this.displayDataChange.emit(this.displayData);
        }
    }

}
