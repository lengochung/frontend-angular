import { Component, OnInit } from '@angular/core';
import { SHARED_MODULE } from './core/includes/shared.module';
import { Router } from '@angular/router';
import Lib from './utils/lib';
import Constants from './utils/constants';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [SHARED_MODULE],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
	/** Constructor */
	constructor(
		private _router: Router,
	) {
		if (!Lib.getUserLogin()) {
			void this._router.navigate([`${Constants.APP_URL.AUTH.MODULE}/${Constants.APP_URL.AUTH.LOGIN}`]);
		}
	}
	/**
	 * @return {void}
	 */
	ngOnInit(): void {
		return;
	}
}
