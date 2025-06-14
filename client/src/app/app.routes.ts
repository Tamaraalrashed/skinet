import {Routes} from '@angular/router';
import {ShopComponent} from './Features/shop/shop.component';
import {HomeComponent} from './Features/home/home.component';
import {ProductDetailsComponent} from './Features/shop/product-details/product-details.component';
import {CartComponent} from './Features/cart/cart.component';
import {CheckoutComponent} from './Features/checkout/checkout.component';
import {LoginComponent} from './Features/login/login.component';
import {RegisterComponent} from './Features/register/register.component';
import {authGuard} from './Core/guards/auth.guard';
import {emptyCartGuard} from './Core/guards/empty-cart.guard';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'shop', component: ShopComponent},
  {path: 'shop/:id', component: ProductDetailsComponent},
  {path: 'cart', component: CartComponent},
  {path: 'account/login', component: LoginComponent},
  {path: 'account/register', component: RegisterComponent},
  {path: 'checkout', component: CheckoutComponent, canActivate: [authGuard, emptyCartGuard]},
  {path: '**', redirectTo: '/', pathMatch: 'full'}
];
