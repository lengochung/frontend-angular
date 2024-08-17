import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseValidatorComponent } from '../../../core/includes/base.validator.component';
export class UserAccountValidator extends BaseValidatorComponent {
    public readonly NAME_ML = 60;
    public readonly EMPLOYEE_NO_ML = 30;
    public readonly AFFILIATION_ML = 96;
    public readonly POSITION_ML = 96;
    public readonly EMAIL_ML = 255;
    public readonly PASS_ML = 60;
    /**
     * @description Get the validation rules that apply to the request.
     * @return {FormGroup} user account form
     */
    public createRules(): FormGroup {
        return new FormGroup({
            user_last_name: new FormControl<string | null>(null, [
                Validators.required,
                Validators.maxLength(this.NAME_ML),
            ]),
            user_first_name: new FormControl<string | null>(null, [
                Validators.required,
                Validators.maxLength(this.NAME_ML),
            ]),
            employee_no: new FormControl<string | null>(null, [
                this.checkAlphanumeric,
                Validators.maxLength(this.EMPLOYEE_NO_ML),
            ]),
            affiliation: new FormControl<string | null>(null, [
                Validators.maxLength(this.AFFILIATION_ML),
            ]),
            position: new FormControl<string | null>(null, [
                Validators.maxLength(this.POSITION_ML),
            ]),
            mail: new FormControl<string | null>(null, [
                Validators.required,
                Validators.maxLength(this.EMAIL_ML),
                this.checkEmail,
            ]),
            password: new FormControl<string | null>(null, [
                Validators.maxLength(this.PASS_ML),
                this.checkPassword,
            ]),
            new_password: new FormControl<string | null>(null, [
                Validators.maxLength(this.PASS_ML),
                this.checkPassword,
            ]),
            confirm_new_password: new FormControl(null, [
                Validators.maxLength(this.PASS_ML),
                this.checkPassword,
                this.checkMatch('new_password'),
            ]),
        });
    }

    /**
     * @description Get the error message for the defined validation rules.
     * @return {object} error messages
     */
    public createErrorMessages(): { [key: string]: any } {
        const last_name = this.translate.instant('label.last_name') as string;
        const first_name = this.translate.instant('label.first_name') as string;
        const employee_no = this.translate.instant('label.employee_no') as string;
        const affiliation = this.translate.instant('label.affiliation') as string;
        const position = this.translate.instant('label.position') as string;
        const email = this.translate.instant('label.email') as string;
        const current_password = this.translate.instant('label.current_password') as string;
        const new_password = this.translate.instant('label.new_password') as string;
        const confirm_new_password = this.translate.instant('label.confirm_new_password') as string;

        return {
            user_last_name: {
                required: this.translate.instant('validation.required', {
                    field: last_name,
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: last_name,
                    number: this.NAME_ML,
                }) as string,
            },
            user_first_name: {
                required: this.translate.instant('validation.required', {
                    field: first_name,
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: first_name,
                    number: this.NAME_ML,
                }) as string,
            },
            employee_no: {
                maxlength: this.translate.instant('validation.maxlength', {
                    field: employee_no,
                    number: this.EMPLOYEE_NO_ML,
                }) as string,
                alphanumeric: this.translate.instant(
                    'validation.invalid_alphanumeric',
                    {
                        field: employee_no,
                    }
                ) as string,
            },
            affiliation: {
                required: this.translate.instant('validation.required', {
                    field: affiliation,
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: affiliation,
                    number: this.AFFILIATION_ML,
                }) as string,
            },
            position: {
                required: this.translate.instant('validation.required', {
                    field: position,
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: position,
                    number: this.POSITION_ML,
                }) as string,
            },
            mail: {
                required: this.translate.instant('validation.required', {
                    field: email,
                }) as string,
                invalid_email: this.translate.instant('validation.email', {
                    field: email,
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: email,
                    number: this.EMAIL_ML,
                }) as string,
            },
            password: {
                invalid_password: this.translate.instant(
                    'validation.password'
                ) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: current_password,
                    number: this.PASS_ML,
                }) as string,
            },
            new_password: {
                invalid_password: this.translate.instant(
                    'validation.password'
                ) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: new_password,
                    number: this.PASS_ML,
                }) as string,
            },
            confirm_new_password: {
                invalid_password: this.translate.instant(
                    'validation.password'
                ) as string,
                match: this.translate.instant(
                    'validation.new_password_not_match'
                ) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: confirm_new_password,
                    number: this.PASS_ML,
                }) as string,
            },
        };
    }
}
