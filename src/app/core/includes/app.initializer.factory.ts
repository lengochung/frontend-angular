import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LOCATION_INITIALIZED } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * requires an exported function for factories
 * load json files in assets.
 * @author hung.le 2024/03/01
 * @param  {HttpClient} httpClient http
 * @return {TranslateHttpLoader} TranslateHttpLoader
 */
export function HttpLoaderFactory(httpClient: HttpClient) {
	const timestamp = Date.now();
	return new TranslateHttpLoader(httpClient, './assets/i18n/', `.json?v=${timestamp}`);
}
/**
 * ApplicationInitializerFactory
 *
 * @author hung.le 2024/03/01
 * @param {TranslateService} translate TranslateService
 * @param {Injector} injector Injector
 * @returns {void}
 */
export function ApplicationInitializerFactory(
	translate: TranslateService, injector: Injector) {
	return async () => {
		try {
			await injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
			translate.setDefaultLang(environment.default_lang);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
			await firstValueFrom(translate.use(environment.default_lang));
		} catch (err) {
			console.log('ApplicationInitializerFactory:', err);
		}
	};
}
