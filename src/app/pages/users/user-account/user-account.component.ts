import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../core/includes/base.component';
import { SHARED_MODULE } from '../../../core/includes/shared.module';
import { UserService } from '../../../core/services/user.service';
import { AuthService, SubjectService } from '../../../core/services';
import { UserEntity } from '../../../core/entities';
import { ToastrService } from 'ngx-toastr';
import { UserAccountValidator } from '../validator/user-account.validator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    templateUrl: './user-account.component.html',
    standalone: true,
    imports: [SHARED_MODULE],
})
export class UserAccountComponent extends BaseComponent implements OnInit {
    public validator: UserAccountValidator;
    public form!: ReturnType<typeof this.validator.createRules>;
    public userInfo?: UserEntity;

    /** Constructor */
    constructor(
        private _router: Router,
        private _userService: UserService,
        private _subjectService: SubjectService,
        private _toastrService: ToastrService,
        private _authService: AuthService,
    ) {
        super();
        this.validator = new UserAccountValidator();
    }
    /**
     * @returns {void}
     */
    ngOnInit(): void {
        this.form = this.validator.createRules();
        this._getUserInfo();
    }

    /**
     * get user info
     * @author DuyPham
     *
     * @returns {void}
     */
    private _getUserInfo(): void {
        const params = {
            user_id: this.userLogin.user_id ?? 0,
        };
        this._userService
            .getUserInfo(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        const errorList = this.getApiErrorMessages(rsp.msg);
                        if (errorList && errorList.length > 0) this._toastrService.error(errorList[0]);
                        return;
                    }
                    this.userInfo = rsp.data;
                    this.Lib.assignDataFormControl(this.form.controls, this.userInfo);
                },
            });
    }

    /**
     * Submit form
     * @author DuyPham
     *
     * @returns {void}
     */
    public onSaveUser(): void {
        this.form?.get('confirm_new_password')?.updateValueAndValidity()
        this.validator.makeValidator(this.form, this.validator.createErrorMessages());

        if (this.form.invalid) return;
        const params = Object.assign({}, this.form.value) as UserEntity;
        params.password = this.Lib.md5(params.password ?? '');
        params.upd_datetime = this.userInfo?.upd_datetime;
        this._userService
            .updateProfileUser(params)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (rsp) => {
                    if (!rsp.status || !rsp.data) {
                        const errorList = this.getApiErrorMessages(rsp.msg);
                        this.validator.errors = errorList;
                        return;
                    }
                    if (this.userInfo) {
                        this.userInfo.update_date = rsp.data.update_date;
                        this.userInfo.password_update_date = rsp.data.password_update_date;
                        this.userInfo.upd_datetime = rsp.data.upd_datetime;
                    }
                    this.form.get('password')?.setValue('');
                    this.form.get('new_password')?.setValue('');
                    this.form.get('confirm_new_password')?.setValue('');
                    this._toastrService.success(this.translate.instant('message.update_user_success') as string);
                    const currentUser = this.userLogin;
                    if (currentUser) {
                        currentUser.user_first_name = rsp.data.user_first_name;
                        currentUser.user_last_name = rsp.data.user_last_name;
                        currentUser.mail = rsp.data.mail;
                        this._authService.updateCurrentLoginUser(currentUser);
                    }
                },
            });
    }

    /**
     * Go to back
     * @author DuyPham
     *
     * @returns {void}
     */
    public onGoBack(): void {
        void this._router.navigate([this.Constants.APP_URL.DASHBOARD]);
    }
}
