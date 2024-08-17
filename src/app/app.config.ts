import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom, Injector } from '@angular/core';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import {
	PreloadAllModules,
	provideRouter,
	//withDebugTracing,
	withPreloading,
	withViewTransitions
} from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApplicationInitializerFactory, HttpLoaderFactory } from './core/includes/app.initializer.factory';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { SSDateParserFormatter, SSDatepickerI18n, SSDateDateAdapter, SSDatepickerConfig } from './core/components/datepicker';
import { environment } from '../environments/environment';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
	providers: [
		provideClientHydration(),
		provideAnimations(),
		provideHttpClient(withFetch()),
		provideRouter(
			routes,
			withPreloading(PreloadAllModules),
			//withDebugTracing(),
			withViewTransitions()
		),
		provideToastr({
			timeOut: environment.toastr_timeout,
			positionClass: 'toast-top-right',
			closeButton: true
		}),
		importProvidersFrom(
			TranslateModule.forRoot({
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClient],
				},
			}),
		),
		{
			provide: APP_INITIALIZER,
			useFactory: ApplicationInitializerFactory,
			deps: [TranslateService, Injector],
			multi: true,
		},
		{
			provide: NgbDateParserFormatter,
			useClass: SSDateParserFormatter
		},
		{
			provide: NgbDatepickerI18n,
			useClass: SSDatepickerI18n
		},
		{
			provide: NgbDateAdapter,
			useClass: SSDateDateAdapter
		},
		{
			provide: NgbDatepickerConfig,
			useClass: SSDatepickerConfig
		},
        provideCharts(withDefaultRegisterables()),
        NgbActiveModal
	],
};
