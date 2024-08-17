import { Routes } from '@angular/router';
import Constants from './utils/constants';
import { LoginComponent } from './pages/auth/login/login.component';
import { NotFoundComponent } from './pages/error-page/not-found/not-found.component';
import { MasterTemplateComponent } from './pages/templates/master-template/master-template.component';
import { SingleTemplateComponent } from './pages/templates/single-template/single-template.component';
import { HomeComponent } from './pages/dashboard/home/home.component';
import { UserAccountComponent } from './pages/users/user-account/user-account.component';

export const routes: Routes = [
    {
        path: Constants.APP_URL.AUTH.MODULE,
        component: SingleTemplateComponent,
        children: [
            { path: Constants.APP_URL.AUTH.LOGIN, component: LoginComponent, }
        ]
    },
    {
        path: '',
        component: MasterTemplateComponent,
        children: [
            {
                path: '',
                redirectTo: `${Constants.APP_URL.DASHBOARD}`,
                pathMatch: 'full'
            },
            {
                path: `${Constants.APP_URL.DASHBOARD}`,
                component: HomeComponent
            },
            {
                path: `${Constants.APP_URL.USERS.MODULE}`,
                children: [
                    {
                        path: `${Constants.APP_URL.USERS.USER_ACCOUNT}`,
                        component: UserAccountComponent
                    }
                ]
            },
            {
                path: '**',
                component: NotFoundComponent
            }
        ]
    }
];
