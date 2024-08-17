import { Component, ElementRef, Input, inject } from '@angular/core';
import { FormGroup, FormControl, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
import Lib from '../../utils/lib';
import { TranslateService } from '@ngx-translate/core';
/*
|--------------------------------------------------------------------------
| 	Component displaying error message for form control
|	@author hung.le 2024/03/04
|--------------------------------------------------------------------------
|	Use formGroupName:
|	EX: Declare form group validator
| 	public formRules(): FormGroup {
| 		return new FormGroup({
|			user_id: new FormControl(null, [
|				Validators.required,
|			]),
|			form_group1: new FormGroup({
|				new_pass: new FormControl(null, [
|					Validators.required,
|				]),
|			}),
|		});
|	}
|	Call function formRules() from ngOnInit()
|	Call it from HTML:
|	<form [formGroup]="FormGroup is declared from component" (ngSubmit)="onSubmit()">
|		<input formControlName="user_id" />
|		<div formGroupName="form_group1">
|			<input formControlName="new_pass" />
|		</div>
|		<button type="submit">Submit</button>
|	</form>
|
*/
@Component({
	selector: 'app-form-errors',
	standalone: true,
	template: `
	@if(errors && errors.length > 0){
		<div class="error-message">
			<div class="row">
				<div class="col col-lg-12 col-md-12 col-sm-12">
					@for (error of errors; track error) {
					<p>{{ error }}</p>
					} @empty {}
				</div>
			</div>
		</div>
	}
	`
})
export class BaseValidatorComponent {
	protected readonly Lib = Lib;
	protected readonly translate = inject(TranslateService);
	@Input() errors: Array<string> = [];
	private _form!: FormGroup;
	private _elementRef = inject(ElementRef);
	public showMessageBelowControl = true;
	public clearErrorsInputChange = false;
	/**
	 * In scenarios where there are multiple forms within a single screen, it's necessary to declare a form reference to differentiate them as follows:
	 * Declare the form reference in the component:
	 * @ViewChild('formRef', { static: true }) formRef?: ElementRef;
	 * Call it from HTML:
	 * <form #formRef>....</form>
	 * */
	public formRef: any;
	private _errorMessages?: { [key: string]: any } = {};
	private _isControlError = false;
	private _elemIdError = Lib.getMillisecondsTimeUTC();
	private readonly _HTML_ELEMENT = {
		ERROR_CLASS_NAME: "control-invalid",
		CONTROL_CLASS_NAME: "form-error",
		HEADER: "header"
	};
	/**
	 * Displaying error message
	 *
	 * @param {Array} errors  error message list
	 * @returns {void}
	 */
	public setError(errors: Array<string> | null) {
		if (!errors) {
			return;
		}
		this.errors = errors;
		this._scrollToErrorMessage();
	}
	/**
	 * Scroll to HTMLElement error message
	 *
	 * @returns {void}
	 */
	private _scrollToErrorMessage() {
		if (
			!this._form ||
			!this.formRef ||
			!this.formRef.nativeElement ||
			!this.errors ||
			this.errors.length <= 0
		) {
			return;
		}
		const elemForm = this.formRef.nativeElement as HTMLElement;
		setTimeout(() => {
			const appFormError = elemForm.querySelector("app-form-errors");
			if (!appFormError) {
				return;
			}
			/**
			 * This is now a hard switch, but it allows options which are the following:
			 *
			 * behavior: auto or smooth
			 * block: start, center, end or nearest (default: start)
			 * inline: start, center, end or nearest (default: nearest)
			 */
			appFormError.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
		}, 50);
	}
	/**
	 * Scroll to error message
	 *
	 * @returns {void}
	 */
	private _scrollToErrorElement() {
		if (
			!this._form ||
			!this._form.controls ||
			this._isControlError ||
			!this.formRef ||
			!this.formRef.nativeElement
		) {
			return;
		}
		const elemForm = this.formRef.nativeElement as HTMLFormElement;
		const formControls: any = elemForm.querySelectorAll("input, textarea, select");
		if (!formControls || formControls.length <= 0) {
			return;
		}
		const controlNames: Array<string> = [];
		for (let i = 0; i < formControls.length; i++) {
			const elemFormControl = formControls[i] as HTMLElement;
			const formcontrolname = elemFormControl.getAttribute("formcontrolname");
			if (formcontrolname) {
				controlNames.push(formcontrolname);
			}
		}
		if (!controlNames || controlNames.length <= 0) {
			return;
		}

		let firstElemError: any = null;
		for (let i = 0; i < controlNames.length; i++) {
			const controlName = controlNames[i];
			const elemControl = this._form.controls[controlName];
			if (!elemControl) {
				continue;
			}
			const control = this._form.get(controlName);
			if (!control || !control.errors) {
				continue;
			}
			firstElemError = elemForm.querySelector(`[formcontrolname="${controlName}"]`) as HTMLElement;
			break;
		}
		if (!firstElemError) {
			return;
		}
		/**
		 * This is now a hard switch, but it allows options which are the following:
		 *
		 * behavior: auto or smooth
		 * block: start, center, end or nearest (default: start)
		 * inline: start, center, end or nearest (default: nearest)
		 */
		firstElemError.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
		//Set element focus
		setTimeout(() => {
			firstElemError.focus();
		}, 500);
	}

	/**
	 * Sets up validators for a FormGroup and displays error messages.
	 *
	 * @param {FormGroup} form 	instance to apply validators to
	 * @param {object} errorMessages 	An optional object containing custom error messages for form controls.
	 * EX: {
	 * 	"control_name": {
	 * 		"required": "Message"
	 * 	}
	 * }
	 *
	 * @returns {void}
	 */
	public makeValidator(form: FormGroup | null, errorMessages?: { [key: string]: string }) {
		// If formRef is not initialized, assign it to _elementRef
		if (!this.formRef) {
			this.formRef = this._elementRef;
		}
		// Check if any required parameters are missing, and exit if so
		if (!form || !errorMessages || !this.formRef || !this.formRef.nativeElement) {
			return;
		}
		// Store the provided error message object and form
		this._errorMessages = errorMessages;
		this._form = form;
		// If the form controls are not available, exit
		if (!this._form.controls) {
			return;
		}
		// Get the HTML element reference of the form
		const elemForm = this.formRef.nativeElement as HTMLElement;
		// Remove existing error messages
		const elemErrors = elemForm.getElementsByClassName(this._HTML_ELEMENT.ERROR_CLASS_NAME);
		if (elemErrors && elemErrors.length > 0) {
			for (let i = 0; i < elemErrors.length; i++) {
				const elemItem = elemErrors[i] as HTMLElement;
				if (elemItem) {
					elemItem.remove();
				}
			}
		}
		// Clear the errors array
		this.errors = [];
		// Perform form control validation
		this._formControlValidator(this._form);
		// Scroll to the form control error message
		this._isControlError = false;
		if (this.showMessageBelowControl) {
			this._scrollToErrorElement();
		} else {
			this._scrollToErrorMessage();
		}
	}
	/**
	 * Check and perform validation for each FormControl in a FormGroup.
	 * @param {FormGroup} form 	The FormGroup object to be checked and validated.
	 * @returns {void}
	 */
	private _formControlValidator(form: FormGroup) {
		const formControls = form.controls as { [key: string]: AbstractControl<any, any> };
		if (!formControls) {
			return;
		}
		Object.keys(formControls).forEach(controlName => {
			const control = form.get(controlName);
			if (!control) {
				return;
			}
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			}
			if (this.showMessageBelowControl) {
				control.valueChanges.subscribe(() => {
					let controlValue = control.value as string;
					if (!Lib.isNull(controlValue) && typeof controlValue == "string") {
						controlValue = controlValue.trim();
					}
					//Check control is required
					if (control.validator) {
						const validator = control.validator({} as AbstractControl);
						if (validator && validator['required'] && Lib.isBlank(controlValue)) {
							control?.setErrors({ required: true });
						}
					}
					this._onInputChange(control, controlName);
				});
			}
			let controlValue = control.value as string;
			if (!Lib.isNull(controlValue) && typeof controlValue == "string") {
				controlValue = controlValue.trim();
				control.setValue(controlValue);
			}
			//Check control is required
			if (control.validator) {
				const validator = control.validator({} as AbstractControl);
				if (validator && validator['required'] && Lib.isBlank(controlValue)) {
					control?.setErrors({ required: true });
				}
			}
			if (control.touched && control.invalid) {
				this._setErrorMessage(control, controlName);
			}
			if (!this.showMessageBelowControl) {
				if (!control.invalid) {
					this._removeErrorForControl(controlName);
				} else {
					this._showErrorForControl(controlName);
				}
			}
			const formGroup = control as FormGroup;
			if (formGroup.controls) {
				this._formControlValidator(formGroup);
			}
		});
	}
	/**
	 * Handles the input change event for a form control
	 *
	 * @param {AbstractControl} control  The AbstractControl instance representing the form control.
	 * @param {string} controlName 	The name of the form control.
	 *
	 * @returns {void}
	 */
	private _onInputChange(control: AbstractControl | null, controlName: string): void {
		if (!control || !controlName || !this.formRef || !this.formRef.nativeElement) {
			return;
		}
		// Clear errors if specified and errors exist
		if (this.clearErrorsInputChange && this.errors && this.errors.length > 0) {
			this.errors = [];
		}
		// Get the HTML element reference of the form and the specific form control
		const elemForm = this.formRef.nativeElement as HTMLElement;
		const elemControl = elemForm.querySelector(`[formcontrolname="${controlName}"]`) as HTMLElement;
		if (!elemControl) {
			return;
		}
		// Get the validation errors for the form control
		const controlErrors = control.errors as ValidationErrors || null;
		if (!controlErrors) {
			this._setErrorMessageHtml(controlName);
			return;
		}
		// Delay setting the error message to ensure correct rendering
		setTimeout(() => {
			this._setErrorMessage(control, controlName);
		}, 10);
	}
	/**
	 * Displays an error message for a form control.
	 *
	 * f `showMessageBelowControl` is set to `true`, the error message will be displayed below the form control.
	 * Otherwise, it will be displayed in the component template.
	 *
	 * @param {AbstractControl} control  The AbstractControl instance representing the form control.
	 * @param {string} controlName 		The name of the form control.
	 *
	 * @returns {any} error message
	 */
	private _setErrorMessage(control: AbstractControl | null, controlName: string): any {
		if (!control || !controlName || !Lib.isObject(this._errorMessages)) {
			return;
		}
		const controlErrors = control.errors as ValidationErrors || null;
		if (!controlErrors) {
			return;
		}
		Object.keys(controlErrors).forEach((keyError) => {
			if (!this._errorMessages || !Lib.isObject(this._errorMessages)) {
				return;
			}
			if (!Lib.prop(this._errorMessages, controlName)) {
				return;
			}
			const controlMessage = this._errorMessages[controlName] as { [key: string]: any };
			if (!Lib.prop(controlMessage, keyError)) {
				return;
			}
			const errorMessage = controlMessage[keyError] as string;
			if (this.showMessageBelowControl) {
				this._setErrorMessageHtml(controlName, errorMessage);
			} else {
				this.errors.push(errorMessage);
			}
		});
		if (!this.showMessageBelowControl) {
			return this.errors;
		}
		return;
	}

	/**
	 * Adds an HTMLElement for displaying error message below a form control
	 *
	 * This function adds an HTMLElement to display an error message below a specified form control.
	 * The error message is shown if the form control is invalid.
	 * Usage example:
	 * <p class="control-error" errorMessage = "formcontrol name" *ngIf="form.controls['controll name'].invalid"></p>
	 * The `errorMessage` attribute should be set to the name of the form control
	 *
	 * @param {string} controlName 		The name of the form control.
	 * @param {string} errorMessage 	error message
	 *
	 * @returns {void}
	 */
	private _setErrorMessageHtml(controlName: string, errorMessage?: string | null): void {
		if (!controlName || !this.formRef || !this.formRef.nativeElement) {
			return;
		}
		const elemForm = this.formRef.nativeElement as HTMLElement;
		const elemControl = elemForm.querySelector(`[formcontrolname="${controlName}"]`) as HTMLElement;
		if (!elemControl) {
			return;
		}
		const idError = `${this._elemIdError}_${controlName}`;
		let elemErrorMessage = null;
		const elemParentControl = elemControl.parentElement as HTMLElement;
		if (elemParentControl) {
			elemErrorMessage = elemParentControl.querySelector(`[id="${idError}"]`) as HTMLElement;
		}
		//Custom element error
		const elemCustomErrorMessage = elemForm.querySelector(`[errormessage="${controlName}"]`) as HTMLElement;
		if (elemCustomErrorMessage) {
			if (elemErrorMessage) {
				elemErrorMessage.remove();
			}
			elemCustomErrorMessage.innerHTML = (errorMessage || '');
			return;
		}
		if (errorMessage) {
			const elemNextControl = elemControl.nextElementSibling as HTMLElement;
			//Create error element
			let errorNode = null;
			if (!elemErrorMessage) {
				errorNode = document.createElement("p") as HTMLElement;
				errorNode.classList.add(this._HTML_ELEMENT.ERROR_CLASS_NAME);
				errorNode.innerHTML = (errorMessage || '');
				errorNode.id = idError;
			} else {
				errorNode = elemErrorMessage;
			}
			//console.log('elemNextControl: ', elemNextControl, elemErrorMessage);
			if (elemNextControl) {
				if (!elemErrorMessage) {
					elemParentControl.appendChild(errorNode);
				} else {
					elemErrorMessage.innerHTML = (errorMessage || '');
				}
			} else if (!elemControl.nextElementSibling) {
				//console.log("nextElementSibling", elemControl.nextElementSibling);
				elemControl.after(errorNode);
			}
		} else if (elemErrorMessage) {
			elemErrorMessage.remove();
		}
	}

	/**
	 * show error UI for error control
	 *
	 * @param {string} controlName 		The name of the form control.
	 * @returns {void}
	 */
	private _showErrorForControl(controlName: string): void {
		if (!controlName || !this.formRef || !this.formRef.nativeElement) {
			return;
		}
		const elemForm = this.formRef.nativeElement as HTMLElement;
		const elemControl = elemForm.querySelector(`[formcontrolname="${controlName}"]`) as HTMLElement;
		if (!elemControl) {
			return;
		}
		elemControl.classList.add(this._HTML_ELEMENT.CONTROL_CLASS_NAME);
	}

	/**
	 * remove error UI for error control
	 *
	 * @param {string} controlName 		The name of the form control.
	 *
	 * @returns {void}
	 */
	private _removeErrorForControl(controlName: string): void {
		if (!controlName || !this.formRef || !this.formRef.nativeElement) {
			return;
		}
		const elemForm = this.formRef.nativeElement as HTMLElement;
		const elemControl = elemForm.querySelector(`[formcontrolname="${controlName}"]`) as HTMLElement;
		if (!elemControl) {
			return;
		}
		elemControl.classList.remove(this._HTML_ELEMENT.CONTROL_CLASS_NAME);
	}

	/**
	 * Display error message
	 *
	 * @param {string} error string
	 * @return {string} error
	 */
	public getErrorMessage(error?: string | null): string {
		if (undefined === error || null === error || 'object' === typeof error) {
			return "";
		}
		return error.toString();
	}

	/**
	 * Check existed of whitespace in string
	 *
	 * @param {FormControl} control from control
	 * @returns {object} FormControl validator
	 */
	protected cannotContainSpace(control: FormControl) {
		const isWhitespace = (control.value || '').trim().length === 0;
		const isValid = !isWhitespace;
		return isValid ? null : { required: true };
	}
	/**
	 * Check if input data contains only alphanumeric characters
	 *
	 * @param {AbstractControl} control an Angular control object
	 * @returns {ValidationErrors?} `null` if the control value is valid, else a validation error object
	 */
	protected checkAlphanumeric = (control: AbstractControl): ValidationErrors | null => {
		if (control == null) {
			return null;
		}
		if (Lib.isBlank(control.value)) {
			return null;
		}
		const isValid = RegExp('^[A-Za-z0-9]+$').test(control.value as string);
		return !isValid ? { alphanumeric: { value: (control.value as string) } } : null;
	};

	/**
	* Check if input data is in a correct email list format
	 *
	 * @param {AbstractControl} control an Angular control object
	 * @returns {ValidationErrors?} `null` if the control value is valid, else a validation error object
	 */
	protected emailList = (control: AbstractControl): ValidationErrors | null => {
		if (control == null) return null;
		if (Lib.isBlank(control.value)) return null;
		if (typeof control.value !== 'string') return { email_list: { value: control.value as string } };

		const emails = control.value.split(',');
		for (let index = 0; index < emails.length; index++) {
			const email = emails[index];
			const isValid = Lib.getEmailRegex().test(email);
			if (!isValid || email.includes(';')) {
				return { email_list: { value: control.value } };
			}
		}

		return null;
	}

	/**
	 * Check user name
	 *
	 * @param {AbstractControl} control  an Angular control object
	 * @returns {ValidationErrors?} `null` if the control value is valid, else a validation error object
	 */
	protected checkUserName = (control: AbstractControl): ValidationErrors | null => {
		if (control == null) {
			return null;
		}
		if (Lib.isBlank(control.value)) {
			return null;
		}
		const test = control.value.match(/^[a-zA-Z0-9._-]+$/) as string;
		if (test) {
			return null;
		} else {
			return { invalid_username: true };
		}
	}
	/**
	 * Check password
	 *
	 * @param {AbstractControl} control  an Angular control object
	 *
	 * @returns {ValidationErrors?} `null` if the control value is valid, else a validation error object
	 */
	protected checkPassword = (control: AbstractControl): ValidationErrors | null => {
		if (control == null) {
			return null;
		}
		if (Lib.isBlank(control.value)) {
			return null;
		}
		const test = control.value.match(/^[a-zA-Z0-9!@#$%^&*<>()]+$/) as string;
		if (test) {
			return null;
		} else {
			return { invalid_password: true };
		}
	}

	/**
	 * Check Kana characters
	 *
	 * @param {AbstractControl} control  an Angular control object
	 * @returns {ValidationErrors?} `null` if the control value is valid, else a validation error object
	 */
	protected checkKatakana = (control: AbstractControl): ValidationErrors | null => {
		if (control == null) {
			return null;
		}
		if (Lib.isBlank(control.value)) {
			return null;
		}
		const regex = /^[\u30A0-\u30FF]+$/;
		const test = control.value.match(regex) as string;
		if (test) {
			return null;
		} else {
			return { katakana: true };
		}
	}

	/**
	 * Check phone
	 *
	 * @param {AbstractControl} control  an Angular control object
	 * @returns {ValidationErrors?} `null` if the control value is valid, else a validation error object
	 */
	protected checkPhoneNumber = (control: AbstractControl): ValidationErrors | null => {
		if (control == null) {
			return null;
		}
		if (Lib.isBlank(control.value)) {
			return null;
		}
		const test = control.value.match(/^[0-9-()]+$/) as string;
		if (test) {
			return null;
		} else {
			return { invalid_phone: true };
		}
	}

	/**
	 * Check email
	 *
	 * @param {AbstractControl} control  an Angular control object
	 * @returns {ValidationErrors?} `null` if the control value is valid, else a validation error object
	 */
	protected checkEmail = (control: AbstractControl): ValidationErrors | null => {
		if (control == null) {
			return null;
		}
		if (Lib.isBlank(control.value)) {
			return null;
		}
		// RFC 2822 compliant regex
		const test = control.value.match(
			/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
		) as string;
		if (test) {
			return null;
		} else {
			return { invalid_email: true };
		}
	}
	/**
	 * Custom validator to check that two fields match
	 *
	 * @param {string} matchControl formcontrol name
	 *
	 * @returns {ValidatorFn} ValidatorFn
	 */
	protected checkMatch = (matchControl: string): ValidatorFn => {
		return (control: AbstractControl): { [key: string]: boolean } | null => {
			if (control.parent == null || control.parent.controls == null) {
				return null;
			}
			if (!matchControl) {
				return null;
			}
			const controls = control.parent.controls as { [key: string]: any };
			const matchCtrl = controls[matchControl] as { [key: string]: any };
			if (!matchCtrl || matchCtrl == null || matchCtrl['errors']) {
				return null;
			}
			if (matchCtrl['value'] !== control.value) {
				return { match: true };
			}
			return null;
		};
	}
	/**
	 * Check Number
	 *
	 * @param {AbstractControl} control  an Angular control object
	 * @returns {ValidationErrors?} `null` if the control value is valid, else a validation error object
	 */
	protected checkNumber = (control: AbstractControl): ValidationErrors | null => {
		if (control == null) {
			return null;
		}
		if (Lib.isBlank(control.value)) {
			return { invalid_number: true };
		}
		const test = isNaN(control.value as number);
		if (test) {
			return { invalid_number: true };
		}
		return null;
	}
	/**
	 * Check date
	 *
	 * @param {AbstractControl} control  an Angular control object
	 * @returns {ValidationErrors?} `null` if the control value is valid, else a validation error object
	 */
	protected checkDate = (control: AbstractControl): ValidationErrors | null => {
		if (control == null) {
			return null;
		}
		if (Lib.isBlank(control.value)) {
			return null;
		}
		if (Lib.checkIsDate(control.value as string)) {
			return null;
		} else {
			return { invalid_date: true };
		}
	}
	/**
	 * Custom validator to check that two fields match
	 * @param {string} compareControl - compareControl
	 * @param {string} type - max or min
	 * @returns {ValidatorFn} ValidatorFn
	 */
	protected compareDate = (compareControl: string, type: string): ValidatorFn => {
		return (control: AbstractControl): { [key: string]: boolean } | null => {
			if (control.parent == null || control.parent.controls == null || Lib.isBlank(control.value)) {
				return null;
			}
			const controls: any = control.parent.controls;
			const compareCtrl = controls[compareControl] as { [key: string]: any };
			if (compareCtrl == null) {
				return null;
			}
			const ctrlValue = Lib.dateFormat(control.value as string, "YYYY/MM/DD", "DD/MM/YYYY");
			const compareCtrlValue = Lib.dateFormat(compareCtrl['value'] as string, "YYYY/MM/DD", "DD/MM/YYYY");
			if (Lib.isBlank(ctrlValue)) {
				return { compare_date: true };
			}
			if (type === 'min' && Lib.compare2Date(ctrlValue, compareCtrlValue, ">")) {
				return { compare_date: true };
			} else if (type === 'max' && Lib.compare2Date(ctrlValue, compareCtrlValue, "<")) {
				return { compare_date: true };
			} else if (type === 'equal' && Lib.compare2Date(ctrlValue, compareCtrlValue, "=")) {
				return { compare_date: true };
			}
			compareCtrl['setErrors'](null);
			return null;
		};
	}
}
