import { Routes } from '@angular/router';
import { JwtLogin } from './components/jwt-login/jwt-login';
import { Users } from './components/users/users';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: JwtLogin },
  { path: 'users', component: Users, canActivate: [authGuard] }
];
