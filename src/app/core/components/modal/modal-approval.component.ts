import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
/**
 * Call modal
 * Declare NgbModal in constructor or inject(NgbModal)
 * private _modalService = inject(NgbModal);
 *
 * @see {@link https://ng-bootstrap.github.io/#/components/modal/examples}
 * const modalOpts = {
 *  centered: true,
 *  scrollable: true,
 *  backdrop: 'static',
 *  keyboard: false
 * };
 * const modal = this._modalService.open(ModalApprovalComponent`, modalOpts);
 * const componentInstance = modal.componentInstance as ModalApprovalComponent;
 * componentInstance.messageApproval.subscribe((message: string) => {
 *  console.log('message: ', message);
 * });
 */
@Component({
    standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule],
    template: `
        <div class="modal-header">
            <h4 class="modal-title">
                @if(modalTitle) {
                <span>{{ modalTitle }}</span>
                } @else {
                <span>{{ 'label.approval_comment' | translate }}</span>
                }
            </h4>
            <button
                type="button"
                class="close"
                aria-label="Close"
                (click)="activeModal.dismiss('Cross click')">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <div class="message">
                <textarea
                    [maxlength]="maxLength"
                    class="form-control"
                    rows="6"
                    [(ngModel)]="message"></textarea>
            </div>
        </div>
        <div class="modal-footer">
            <button
                type="button"
                class="btn btn-primary"
                (click)="ok()">
                <i class="fas fa-check"></i> {{ 'label.ok' | translate }}
            </button>
            <button
                type="button"
                class="btn btn-danger"
                (click)="activeModal.close('Close click')">
                <i class="fas fa-times"></i> {{ 'label.close' | translate }}
            </button>
        </div>
    `,
})
export class ModalApprovalComponent {
    public modalTitle = '';
    public message = '';
    public maxLength = 65000;
    @Output() comment = new EventEmitter<string>();

    /**
     *
     * @param {NgbActiveModal} activeModal - NgbActiveModal
     */
    constructor(public activeModal: NgbActiveModal) {}
    /**
     * Close modal
     *
     * @return {void}
     */
    public ok(): void {
        this.comment.emit(this.message);
        this.activeModal.close('Close click');
    }
}
