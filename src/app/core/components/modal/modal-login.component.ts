import { Component, ElementRef, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup} from '@angular/forms';
import { SHARED_MODULE } from '../../includes/shared.module';
import { LoginValidator } from '../../../pages/auth/validator/login.validator';
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
 * const modal = this._modalService.open(ModalLoginComponent`, modalOpts);
 * const componentInstance = modal.componentInstance as ModalLoginComponent;
 * componentInstance.modalTitle = "?";
 */
@Component({
    standalone: true,
    imports: [
        SHARED_MODULE
    ],
    template: `
        <div class="modal-header">
            <h4 class="modal-title">
                @if(modalTitle) {
                    <span>{{modalTitle}}</span>
                } @else {
                    <span>{{'message.token_expired' | translate}}</span>
                }
            </h4>
        </div>
        <div class="modal-body modal-login">
            <div class="login-box">
                <div class="card card-outline card-main">
                    <div class="card-body pt-4">
                        <div class="row">
                            <div class="col-lg-12 col-sm-12 col-sm-12">
                                <app-form-errors [errors]="validator.errors"></app-form-errors>
                            </div>
                        </div>
                        <form [formGroup]="form" (ngSubmit)="onLogin()">
                            <div class="input-group mb-3">
                                <input formControlName="user_id" class="form-control"
                                    placeholder="{{'label.user_name_login' | translate}}" />
                                <div class="input-group-append">
                                    <div class="input-group-text">
                                        <span class="fas fa-user"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="input-group mb-3">
                                <input id="password" formControlName="pass" type="password" class="form-control"
                                    placeholder="{{'label.password' | translate}}" autocomplete="off" />
                                <div class="input-group-append">
                                    <div class="input-group-text">
                                        <span class="fas fa-lock"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <div class="icheck-primary">
                                        <input formControlName="remember_password" type="checkbox" id="remember_password"
                                            class="custom-control-input" />
                                        <label for="remember_password">{{'label.remember_password'
                                            | translate}}</label>
                                    </div>
                                </div>
                                <div class="col-12 text-center mt-3 mb-3">
                                    <button class="btn btn-primary" type="submit"><i class="fas fa-sign-in-alt"></i>
                                        {{'label.login' | translate}}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
	`,
})
export class ModalLoginComponent implements OnInit {
    public modalTitle = "";
    public form!: FormGroup;
	public validator!: LoginValidator;
    /** Constructor */
    constructor(
        public activeModal: NgbActiveModal,
        private _formRef: ElementRef,
    ) {
        this.validator = new LoginValidator();
    }
    /**
	 * @return {void}
	 */
	ngOnInit(): void {
		this.form = this.validator.rules();
	}
    /**
     * Redirect to login page if token expires
     * @return {void}
     */
    public onLogin(): void {
        this.activeModal.close('Close click');
    }
}
