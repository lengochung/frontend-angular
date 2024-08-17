import { AfterRenderPhase, Component, ElementRef, OnInit, ViewChild, afterNextRender } from '@angular/core';
@Component({
    standalone: true,
    selector: 'app-table',
    template: `
        <div #tableContent>
            <ng-content></ng-content>
        </div>
    `,
})
export class TableComponent implements OnInit {
    @ViewChild('tableContent') content?: ElementRef;
    private resizeObserver: ResizeObserver | null = null;

    /**
     * constructor
     */
    constructor() {
        afterNextRender(() => {
            if (this.content) {
                this.resizeObserver = new ResizeObserver(() => {
                    this._updateTable();
                });
                this.resizeObserver.observe(this.content?.nativeElement);
            }
        }, {phase: AfterRenderPhase.Read});
    }

    /**
     * @return {void}
     */
    ngOnInit(): void {
        return;
    }

    /**
     * update table fixed column
     * @authorhung.le
     *
     * @returns {void}
     */
    private _updateTable(): void {
        if (this.content) {
            const table = this.content.nativeElement as HTMLElement;
            const thElements = table.querySelectorAll('th');
            const trElements = table.querySelectorAll('tbody tr');

            const indexFixed = Array.from(thElements).findIndex(th => th.classList.contains('column-fixed'));
            let width = 0;
            for (let index = 0; index <= indexFixed; index++) {
                const element = thElements[index];
                element.style.left = `${width}px`;
                element.classList.add('fixed');
                for (let i = 0; i < trElements.length; i++) {
                    const tdElements = trElements[i]?.querySelectorAll('td');
                    const td = tdElements[index];
                    td.style.left = `${width}px`;
                    td.classList.add('fixed');
                }
                width += element.offsetWidth;
            }
        }
    }
}
