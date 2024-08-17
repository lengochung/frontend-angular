import { Routes } from '@angular/router';
import Constants from '../../utils/constants';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
	{
		path: Constants.APP_URL.AUTH.LOGIN,
		component: LoginComponent,
	},
];