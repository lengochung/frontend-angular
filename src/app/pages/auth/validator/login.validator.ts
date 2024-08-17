import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseValidatorComponent } from '../../../core/includes/base.validator.component';
export class LoginValidator extends BaseValidatorComponent {
	/**
	 * @description Get the validation rules that apply to the request.
	 * @return {FormGroup} login form
	 */
	public rules(): FormGroup {
		return new FormGroup({
			email: new FormControl(null, [
				Validators.required,
			]),
			password: new FormControl(null, [
				Validators.required,
			]),
            remember_password: new FormControl(null)
		});
	}

	/**
	 * @description Get the error message for the defined validation rules.
     * @return {object} error messages
     */
	public errorMessages(): { [key: string]: any } {
		const email = this.translate.instant("label.email") as string;
		const password = this.translate.instant("label.password") as string;
		return {
			email: {
				required: this.translate.instant('validation.required', {
					field: email
				}) as string
			},
			password: {
				required: this.translate.instant('validation.required', {
					field: password
				}) as string
			}
		};
	}
}

