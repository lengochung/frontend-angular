import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { UserEntity } from '../../../core/entities';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { UserService } from '../../../core/services/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginValidator } from '../validator/login.validator';
import { AuthService } from '../../../core/services/auth.service';

@Component({
	templateUrl: './login.component.html',
	standalone: true,
	imports: [SHARED_MODULE],
})
export class LoginComponent extends BaseComponent implements OnInit {
	public form!: FormGroup;
	public loginValidator!: LoginValidator;
	public displayInModal = false;
	private _localStorageService = inject(LocalStorageService);
	private _userService = inject(UserService);
	private _activeModal = inject(NgbActiveModal);
	private _authService = inject(AuthService);
	@ViewChild('formRef', { static: true }) formRef?: ElementRef;
	/** Constructor */
	constructor(
		private _router: Router,
	) {
		super();
		// redirect to dashboard if already logged in
		if (this.Lib.isObject(this.userLogin)) {
			void this._router.navigate([this.Constants.APP_URL.DASHBOARD]);
			return;
		}
		this.loginValidator = new LoginValidator();
	}

	/** @return {void} */
	ngOnInit(): void {
		this.loginValidator.formRef = this.formRef;
		this.form = this.loginValidator.rules();
	}

	/**
	 * The login process, if successful will save user information to local storage
	 *
	 * @returns {void}
	 */
	public async onLogin(): Promise<void> {
		this.loginValidator.makeValidator(this.form, this.loginValidator.errorMessages());
		if (this.form.invalid) return;
		const params = this.form.value as UserEntity;
		params.password = this.Lib.md5(params.password || '');
		const resData = await this._userService.login(params);
		if (!resData ||
			!resData.status
			|| !resData.data
		) {
			const errorList = this.getApiErrorMessages(resData.msg); 
			this.loginValidator.errors = errorList;
			return;
		}
		this._localStorageService.set(this.Constants.LOCAL_STORAGE_USER_LOGIN_KEY, resData.data || {});
        this._authService.curLoginUserSubject.next(resData.data);
		if (this.displayInModal && this._activeModal) {
			this._activeModal.close();
            void this._router.navigate([this.Constants.APP_URL.DASHBOARD]);
		} else {
			void this._router.navigate([this.Constants.APP_URL.DASHBOARD]);
		}
	}

}
