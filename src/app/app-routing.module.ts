import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SingleCategoryComponent } from './pages/single-category/single-category.component';
import { SinglePostComponent } from './pages/single-post/single-post.component';
import { TermsAndConditionComponent } from './pages/terms-and-condition/terms-and-condition.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { AuthGuard } from './services/auth.guard';
import { SignUpLoginGuard } from './services/login.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'category/:category/:id',
    component: SingleCategoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'post/:id',
    component: SinglePostComponent,
  },

  { path: 'about', component: AboutUsComponent },
  {
    path: 'term-conditions',
    component: TermsAndConditionComponent,
  },
  { path: 'contact', component: ContactUsComponent },
  { path: 'login', component: LoginComponent, canActivate: [SignUpLoginGuard] },
  {
    path: 'signup',
    component: SignUpComponent,
    canActivate: [SignUpLoginGuard],
  },
  { path: '**', component: PageNotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
